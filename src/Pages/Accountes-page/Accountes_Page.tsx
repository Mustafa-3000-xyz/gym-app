import All_Accountes from "@/Global-components/All-accountes/All_Accountes";
import { IdCardLanyard, Shell } from "lucide-react";
import { useEffect, useState } from "react";
import Box from "@/Global-components/Box/Box";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { addRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { accounte } from "../types";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import Permissions from "@/Global-components/Permissions/Permissions";
import { CREATE_NEW_ACCOUNTS, REMOVE_TRAINERS, RENEWAL_SUBSCRIPTION, trainerPagePath, WITHDRAW_SUBSCRIPTION } from "@/Lib/constants";
import { checkThePermissionIsHere, normalAlert } from "@/Lib/functions";
// ========================================================== //
export default function Accountes_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            accountes: state.accountes,
        }
    }, shallowEqual);


    const [isAllDataComplete, setIsAllDataComplete] = useState(false);
    const [isCreateNewAccount, setIsCreateNewAccount] = useState(false);

    const [getName, setGetName] = useState<string | null>(null);
    const [getAge, setGetAge] = useState<number | null>(null);
    const [getPassword, setGetPassword] = useState<string | null>(null);
    const [permissionsList, setPermissionsList] = useState([trainerPagePath, REMOVE_TRAINERS, WITHDRAW_SUBSCRIPTION, RENEWAL_SUBSCRIPTION]);

    const checkCreateAccountPermission = checkThePermissionIsHere({
        accountId: Number(state.logInInfo?.id),
        permissionType: CREATE_NEW_ACCOUNTS
    });



    function clickOnCreateAccount() {
        if (checkCreateAccountPermission && state.accountes?.length as any < 4) {
            setIsCreateNewAccount(true);
        }
        else if (checkCreateAccountPermission && state.accountes?.length as any >= 4) {
            normalAlert({
                title: "المعذره",
                text: "لقد وصلت للحد الاقصى",
                icon: "error"
            });

            setIsCreateNewAccount(false);
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحيه لإنشاء حساب جديد",
                icon: "error"
            });

            setIsCreateNewAccount(false);
        }
    }

    function saveData() {
        const data = {
            name: getName,
            age: getAge,
            password: getPassword,
            type: "captain",
            profileImg: "",
            coverImg: "",
            loginDate: "",
            workingHours: 0,
            totalActiveSubscriptions: 0,
            permissions: JSON.stringify(permissionsList),
        } as accounte;


        normalAlert({
            title: "تهانينا",
            text: "تم إنشاء حساب جديد",
            icon: "success"
        });
        setIsCreateNewAccount(false);
        dispatch(addRowInAccountsTable(data as accounte) as any);
    }



    useEffect(function () {
        if (!getName || !getAge || !getPassword) {
            setIsAllDataComplete(false);
            return;
        }

        setIsAllDataComplete(true);
    }, [getName, getAge, getPassword]);




    return <section className="mb-5">
        {/* Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<IdCardLanyard size={25} />}
                title="مجموع الحسابات"
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                total={`
                    ${state.accountes?.length} من اصل 4
                `}
            />

            <Box
                icon={<Shell size={25} />}
                title="مجموع الحصص المفعله"
                styleIcon="bg-neutral-200 text-neutral-500"
                total={Math.trunc(state.accountes?.reduce((sum, ele) => sum + Number(ele.totalActiveSubscriptions), 0) || 0)}
            />
        </div>

        {/* Create new account */}
        <Add_Btn
            title="إنشاء حساب جديد"
            className="bg-emerald-500 border-emerald-600"
            onClick={clickOnCreateAccount}
        />

        {/* All accountes */}
        <div className="mt-20">
            <All_Accountes />
        </div>


        {
            isCreateNewAccount ?
                <Popup_Form
                    titel={"إنشاء حساب"}
                    discription="يمكنك الان إنشاء حساب جديد"
                    className="h-[70vh] flex flex-col justify-between"
                    isSave={isAllDataComplete}
                    clickOnCancel={() => setIsCreateNewAccount(false)}
                    clickOnSaveBtn={saveData}
                >
                    <Account_Form
                        name={""}
                        age={0}
                        password={""}
                        accountType={"captain"}
                        onGetName={setGetName}
                        onGetAge={setGetAge as any}
                        onGetPassword={setGetPassword}
                    />

                    <div className="mt-5">
                        <Permissions
                            permissionsList={permissionsList}
                            changePermissions={state.logInInfo?.type == "manager"}
                            onGetPermissionsList={setPermissionsList as any}
                        />

                        {
                            state.logInInfo?.type == "captain" ?
                                <p className="mt-5 text-red-500 font-bold">
                                    حساب المدير هو القادر على تغير الصلاحيات
                                </p>
                                :
                                null
                        }
                    </div>
                </Popup_Form>
                :
                null
        }
    </section>
}