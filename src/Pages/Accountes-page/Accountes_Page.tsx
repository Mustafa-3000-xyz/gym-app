import All_Accountes from "@/Global-components/All-accountes/All_Accountes";
import { IdCardLanyard, Shell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Box from "@/Global-components/Box/Box";
import { useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { addRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { accounte } from "../types";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import Permissions from "@/Global-components/Permissions/Permissions";
import { trainerPagePath } from "@/Lib/constants";
import { normalAlert } from "@/Lib/functions";
// ========================================================== //
export default function Accountes_Page() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);

    const [isShowAddAccount, setIsShowAddAccount] = useState<boolean>(false);
    const [getName, setGetName] = useState("");
    const [getAge, setGetAge] = useState("");
    const [getPassword, setGetPassword] = useState("");
    const [permissionsList, setPermissionsList] = useState([trainerPagePath]);
    const [isAllDataComplete, setIsAllDataComplete] = useState(false);




    function clickOnAddAccount() {
        if (theAccount?.type != "manager") {
            setIsShowAddAccount(false);
            return;
        }

        if (state.accountes.length == 4) {
            normalAlert({
                title: "المعذره",
                text: "لقد وصلت للحد الاقصى",
                icon: "error"
            })
        } else {
            setIsShowAddAccount(true);
        }
    }

    function saveData() {
        const data = {
            name: getName,
            age: +getAge,
            password: getPassword,
            type: "captain",
            profileImg: "",
            coverImg: "",
            loginDate: "",
            workingHours: 0,
            totalActiveSubscriptions: 0,
            permissions: JSON.stringify(permissionsList),
        } as accounte;

        setIsShowAddAccount(false);
        dispatch(addRowInAccountsTable(data as accounte) as any);
    }




    useEffect(function () {
        if (!getName || !getAge || !getPassword) {
            setIsAllDataComplete(false);
            return;
        }

        setIsAllDataComplete(true);
    }, [getName, getAge, getPassword]);



    const theAccount = useMemo(function () {
        return state.accountes.find(ele => ele.id == state.logInInfo?.id);
    }, [state.accountes]);




    return <section className="mb-5">
        {/* Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<IdCardLanyard size={25} />}
                title="مجموع الحسابات"
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                total={`
                    ${state.accountes.length} من اصل 4
                `}
            />

            <Box
                icon={<Shell size={25} />}
                title="مجموع الحصص المفعله"
                styleIcon="bg-neutral-200 text-neutral-500"
                total={
                    Math.trunc(state.accountes.reduce((sum, ele) => sum + Number(ele.totalActiveSubscriptions), 0))
                }
            />
        </div>

        {/* Create new account */}
        <div>
            <Add_Btn
                title="إنشاء حساب جديد"
                styleBtn={`
                    bg-emerald-500 border-emerald-600
                    ${theAccount?.type != "manager" && "cursor-not-allowed opacity-55"}
                `}
                onClick={clickOnAddAccount}
            />
        </div>

        {/* All accountes */}
        <div className="mt-20">
            <All_Accountes />
        </div>


        {
            isShowAddAccount ?
                <Popup_Form
                    titel={"إنشاء حساب"}
                    discription="يمكنك الان إنشاء حساب جديد"
                    isSave={isAllDataComplete}
                    clickOnCancel={() => setIsShowAddAccount(false)}
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
                    </div>
                </Popup_Form>
                :
                null
        }
    </section>
}