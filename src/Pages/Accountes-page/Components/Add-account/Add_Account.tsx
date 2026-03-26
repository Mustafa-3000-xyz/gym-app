import { useEffect, useState } from "react";
import Popup from "@/Global-components/Popup/Popup";
import { accounte } from "../../types";
import { useDispatch } from "react-redux";
import { addAccount } from "@/Rtk/Slices/accountsSlice";
// ========================================================== //
export default function Add_Account(
    { onIsShowAddAccount }: { onIsShowAddAccount: (x: boolean) => void }
) {
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [isAllDataComplete, setIsAllDataComplete] = useState(false);


    function saveData() {
        const data = {
            name,
            age: +age,
            password,
            img: "",
            type: "captain",
            permissions: [],
        };

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
        <form>
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

            <div className="flex gap-2 justify-center mb-5">
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
    </Popup>
}