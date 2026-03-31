import { useEffect, useState } from "react";
import Popup from "@/Global-components/Popup/Popup";
import { accounte } from "@/Pages/types";
import { useDispatch } from "react-redux";
import { addAccount } from "@/Rtk/Slices/accountsSlice";
import Permissions from "../Permissions/Permissions";
import Account_Img from "@/Global-components/All-accountes/Account-img/Account_Img";
import Account_Form from "@/Global-components/Account-form/Account_Form";
// ========================================================== //
export default function Add_Account(
    { onIsShowAddAccount }: { onIsShowAddAccount: (x: boolean) => void }
) {
    const dispatch = useDispatch();

    const [getName, setGetName] = useState("");
    const [getAge, setGetAge] = useState("");
    const [getPassword, setGetPassword] = useState("");
    const [img, setImg] = useState("");
    const [permissionsList, setPermissionsList] = useState(["/trainers-page"]);
    const [isAllDataComplete, setIsAllDataComplete] = useState(false);


    function saveData() {
        const data = {
            name: getName,
            age: +getAge,
            password: getPassword,
            img: img,
            type: "captain",
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
        titel={"حساب جديد"}
        discription="يمكنك الان إضافة حساب جديد"
        isSave={isAllDataComplete}
        clickOnCancel={() => onIsShowAddAccount(false)}
        clickOnSaveBtn={saveData}
    >
        <div className="flex justify-center mb-7">
            <Account_Img
                img=""
                accountType="captain"
                isShowCamera
                onGetImg={setImg}
            />
        </div>


        <Account_Form
            name={""}
            age={0}
            password={""}
            dontChangeValues={false}
            accountType={"manager"}
            onGetName={setGetName}
            onGetAge={setGetAge as any}
            onGetPassword={setGetPassword}
        />

        <div className="mt-5">
            <Permissions
                onGetPermissionsList={setPermissionsList as any}
                accountType={"captain"}
                permissions={permissionsList}
            />
        </div>
    </Popup>
}