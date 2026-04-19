import { useEffect, useState } from "react";
import Popup from "@/Global-components/Popup/Popup";
import { accounte } from "@/Pages/types";
import { useDispatch } from "react-redux";
import { addAccount } from "@/Rtk/Slices/accountsSlice";
import Permissions from "../../../Global-components/Permissions/Permissions";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import { expalinAppPagePath, trainerPagePath } from "@/Lib/constants";
import { useAtomValue } from "jotai";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
// ========================================================== //
export default function Add_Account(
    { onIsShowAddAccount }: { onIsShowAddAccount: (x: boolean) => void }
) {
    const isLoginAtom = useAtomValue(isLogin_Atom);
    const dispatch = useDispatch();

    const [getName, setGetName] = useState("");
    const [getAge, setGetAge] = useState("");
    const [getPassword, setGetPassword] = useState("");
    const [permissionsList, setPermissionsList] = useState([trainerPagePath, expalinAppPagePath]);
    const [isAllDataComplete, setIsAllDataComplete] = useState(false);



    function saveData() {
        const data = {
            name: getName,
            age: +getAge,
            password: getPassword,
            type: "captain",
            profileImg: "",
            coverImg: "",
            loginDate: "",
            logOutDate: "",
            workingHours: 0,
            totalForActiveSessions: 0,
            permissions: JSON.stringify(permissionsList),
        } as accounte;


        onIsShowAddAccount(false);
        dispatch(addAccount(data as accounte) as any);
    }




    useEffect(function () {
        if (!getName || !getAge || !getPassword) {
            setIsAllDataComplete(false);
            return;
        }

        setIsAllDataComplete(true);
    }, [getName, getAge, getPassword]);



    return <Popup
        titel={"إنشاء حساب"}
        discription="يمكنك الان إنشاء حساب جديد"
        isSave={isAllDataComplete}
        clickOnCancel={() => onIsShowAddAccount(false)}
        clickOnSaveBtn={saveData}
    >
        <Account_Form
            name={""}
            age={0}
            password={""}
            dontChangeValues={false}
            accountType={"captain"}
            onGetName={setGetName}
            onGetAge={setGetAge as any}
            onGetPassword={setGetPassword}
        />

        <div className="mt-5">
            <Permissions
                permissionsList={permissionsList}
                changePermissions={isLoginAtom.type == "manager"}
                onGetPermissionsList={setPermissionsList as any}
            />
        </div>
    </Popup>
}