import { useEffect, useState } from "react";
import Popup from "@/Global-components/Popup/Popup";
import { accounte } from "@/Pages/types";
import { useDispatch } from "react-redux";
import { addAccount } from "@/Rtk/Slices/accountsSlice";
import { KeyRound } from "lucide-react";
import Permissions from "../Permissions/Permissions";
import Account_Img from "@/Global-components/All-accountes/Account-img/Account_Img";
// ========================================================== //
export default function Add_Account(
    { onIsShowAddAccount }: { onIsShowAddAccount: (x: boolean) => void }
) {
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [img, setImg] = useState("");
    const [permissionsList, setPermissionsList] = useState(["trainer-page"]);
    const [isAllDataComplete, setIsAllDataComplete] = useState(false);


    function saveData() {
        const data = {
            name,
            age: +age,
            password,
            img: img,
            type: "captain",
            permissions: JSON.stringify(permissionsList),
        } as accounte;


        onIsShowAddAccount(false);
        dispatch(addAccount(data as accounte) as any);
    }


    useEffect(function () {
        if (name && age && password) {
            setIsAllDataComplete(true);
            return;
        }

        setIsAllDataComplete(false);
    }, [name, age, password]);



    return <Popup
        titel={"حساب جديد"}
        discription="يمكنك الان إضافة حساب جديد"
        isSave={isAllDataComplete}
        clickOnCancel={() => onIsShowAddAccount(false)}
        clickOnSaveBtn={saveData}
    >
        <div className=" flex justify-center mb-7">
            <Account_Img
                img=""
                accountType="captain"
                isShowCamera
                onGetImg={setImg}
            />
        </div>

        <form className="mb-5">
            <div className="flex gap-2 justify-center mb-2">
                <div>
                    <h3 className="mb-1 font-bold">الاسم</h3>
                    <input
                        className="rounded-lg border border-black p-1 px-3 focus:outline-none"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <h3 className="mb-1 font-bold">العمر</h3>
                    <input
                        className="rounded-lg border border-black p-1 px-3 focus:outline-none"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-center">
                <div>
                    <h3 className="mb-1 font-bold">كلمة السر</h3>
                    <input
                        value={password}
                        dir="ltr"
                        className="rounded-lg border border-black p-1 px-3 focus:outline-none"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <h3 className="mb-1 font-bold">نوع الحساب</h3>
                    <input
                        className="rounded-lg border border-black p-1 px-3 focus:outline-none opacity-55 cursor-not-allowed select-none"
                        type="text"
                        value={"كابتن"}
                        disabled
                    />
                </div>
            </div>
        </form>

        <div className="px-3">
            <div className="flex gap-1 mb-2">
                <KeyRound
                    strokeWidth={2.5}
                    className="text-amber-500"
                />

                <h3 className="font-bold ">
                    الصلاحيات :
                </h3>
            </div>

            <Permissions
                onGetPermissionsList={setPermissionsList as any}
                accountType={"captain"}
                permissions={permissionsList}
            />
        </div>
    </Popup>
}