import { IdCardLanyard, Plus, Shell } from "lucide-react";
import { useMemo, useState } from "react";
import Box from "@/Global-components/Box/Box";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Popup_Component from "@/Global-components/Popup-component/Popup_Component";
import { addRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { accounte_Type } from "../types";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import Permissions from "@/Global-components/Permissions/Permissions";
import { CANCEL_SUBSCRIPTION, CREATE_NEW_ACCOUNTS, REMOVE_TRAINERS, RENEWAL_SUBSCRIPTION } from "@/Lib/constants";
import { checkPermissionesInAccount, customAlert, normalAlert } from "@/Lib/functions";
import All_Accounts from "@/Global-components/All-accountes/All_Accounts";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
// ========================================================== //
export default function Accounts_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            accounts: state.accounts,
        }
    }, shallowEqual);


    const [isCreateNewAccount, setIsCreateNewAccount] = useState(false);
    const [permissionsList, setPermissionsList] = useState([REMOVE_TRAINERS, CANCEL_SUBSCRIPTION, RENEWAL_SUBSCRIPTION]);


    const [getName, setGetName] = useState({
        value: "",
        isTrue: false
    });
    const [getAge, setGetAge] = useState({
        value: 0,
        isTrue: false
    });
    const [getPassword, setGetPassword] = useState({
        value: "",
        isTrue: false
    });


    const checkCreateAccountPermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: CREATE_NEW_ACCOUNTS
    });


    const totalSessions = useMemo(function () {
        const result = Math.trunc(state.accounts?.reduce((sum, ele) => sum + Number(ele.numberOfActiveSessions), 0) || 0);


        return isNaN(result) ? "00" : result;
    }, []);



    function clickOnCreateAccountBtn() {
        if (!checkCreateAccountPermission) {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحيه لإنشاء حساب جديد",
                icon: "error"
            });

            return;
        }

        if (Number(state.accounts?.length) < 4) {
            setIsCreateNewAccount(true);
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "لقد وصلت للحد الاقصى",
                icon: "error"
            });

            setIsCreateNewAccount(false);
        }
    }

    function saveData() {
        const errorsMessagesList = [];

        if (!getName.isTrue) {
            errorsMessagesList.push("يجب اسم الحساب لا يقل عن ثلاثة احرف ولا يزيد عن ثلاثة عشر حرف");
        }

        if (!getAge.isTrue) {
            errorsMessagesList.push("يجب ادخال العمر");
        }

        if (!getPassword.isTrue) {
            errorsMessagesList.push("يجب الرقم السري لا يقل عن ثلاثة حروف ولا يزيد عن عشرون حرف");
        }


        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات خاطئه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            })
        }
        else {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل إنشاء حساب جديد ؟",
                textAfterSubmitAction: "تمت إضافة حساب جديد بنجاح",
                runFunctionAfterConfirm: function () {
                    const data = {
                        name: getName.value,
                        age: getAge.value,
                        password: getPassword.value,
                        type: "captain",
                        color: "#3b82f6",
                        profileImg: "",
                        coverImg: "",
                        trainersTotal: 0,
                        numberOfActiveSessions: 0,
                        permissions: JSON.stringify(permissionsList),
                    } as accounte_Type;

                    dispatch(addRowInAccountsTable(data) as any);
                    setIsCreateNewAccount(false);
                }
            });
        }
    }

    function cancel() {
        if (getName.value || getAge.value || getPassword.value) {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل عدم استكمال كتابة البيانات ؟",
                runFunctionAfterConfirm: () => setIsCreateNewAccount(false)
            })
        }
        else {
            setIsCreateNewAccount(false);
        }
    }




    return <section className="mt-10">
        {/* Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<IdCardLanyard size={25} />}
                title="مجموع الحسابات"
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                total={` ${state.accounts?.length} من اصل 4 `}
            />

            <Box
                icon={<Shell size={25} />}
                title="مجموع الحصص المفعله"
                styleIcon="bg-neutral-200 text-neutral-500"
                total={totalSessions as any}
            />
        </div>

        {/* Create new account */}
        <Custom_Btn
            className="bg-emerald-500! border-emerald-600! flex gap-3 items-center justify-center py-7 w-full"
            onClick={clickOnCreateAccountBtn}
        >
            <Plus size={20} strokeWidth={3} />

            <p className="font-bold mb-1">
                إنشاء حساب جديد
            </p>
        </Custom_Btn>

        {/* All accounts */}
        <div className="mt-20">
            <All_Accounts />
        </div>


        {
            isCreateNewAccount ?
                <Popup_Component
                    title="إنشاء حساب جديد"
                    classNameForParent="h-fit"
                    clickOnSaveBtn={saveData}
                    clickOnCancel={cancel}
                >
                    <Account_Form
                        name={getName.value}
                        age={getAge.value}
                        password={getPassword.value}
                        accountType={"captain"}
                        onGetName={setGetName}
                        onGetAge={setGetAge as any}
                        onGetPassword={setGetPassword}
                    />

                    <div className="mt-5">
                        <Permissions
                            permissionsList={permissionsList}
                            onGetPermissionsList={setPermissionsList as any}
                        />

                        {
                            state.logInInfo?.type == "captain" ?
                                <p className="mt-5 text-red-500 font-bold">
                                    حساب المدير هو القادر على إضافة الصلاحيات
                                </p>
                                :
                                null
                        }
                    </div>
                </Popup_Component>
                :
                null
        }
    </section>
}