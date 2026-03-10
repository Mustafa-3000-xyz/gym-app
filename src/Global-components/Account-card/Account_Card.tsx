import isLogin_Atom from "@/Atoms/isLogin_Atom";
import { accounte } from "@/Pages/Accountes-page/types";
import { getAllAccountes } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// ========================================================== //
export default function Account_Card(
    {
        id,
        name,
        age,
        password,
        type,
    }: accounte
) {
    const state = useSelector(state => state as store_Type);
    const setIsLoginAtom = useAtom(isLogin_Atom)[1];
    const dispatch = useDispatch();


    const inpRef = useRef<HTMLInputElement>(null);
    const [passwordInp, setPasswordInp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    function clickOnBtnUsing() {
        if (password == passwordInp) {
            dispatch(getAllAccountes() as any);
            const getAccount = state.accountes.find(ele => ele.id == id);

            setIsLoginAtom(true);
            localStorage.setItem(
                "accountId",
                JSON.stringify(getAccount?.type == "manager" ? "manager" : getAccount?.id)
            );
        } else {
            setPasswordInp("");
            setErrorMessage("الرقم السري غير صحيح")
            inpRef.current?.classList.add("bg-red-500");
        }
    }



    return <div
        key={id}
        className={`
            rounded-3xl shadow-xl p-8
            flex flex-col justify-between items-center w-96 gap-10
        `}
    >
        {/* Avatar & Name & Tagline*/}
        <div className="flex flex-col items-center gap-3 select-none">
            <div className={`
                    w-30 h-30
                    border-4 border-emerald-500 rounded-full
                    flex items-center justify-center text-white
                `}
            >
                <img
                    className="w-14"
                    src="manager.png"
                    alt="manager.png"
                />
            </div>


            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    {name}
                </h2>
                <p className="text-sm text-gray-400 italic mt-1">
                    <span>
                        {
                            type == "manager" ? "مدير المكان " : "كابتن في المكان "
                        }
                    </span>

                    ({Math.trunc(age)} سنه)
                </p>
            </div>
        </div>


        {/* Set password */}
        <div className="flex items-center gap-2">
            <input
                type="text"
                ref={inpRef}
                className="border p-2 rounded-lg px-3"
                placeholder="الرقم السري"
                value={passwordInp}
                onChange={(e) => {
                    setErrorMessage("");
                    setPasswordInp(e.target.value);
                    e.target.classList.remove("bg-red-500");
                }}
            />

            <button
                className={`
                    px-4 transition duration-300
                    bg-blue-500 text-white p-2 rounded-lg
                    ${passwordInp.length == 0 ? "opacity-45 cursor-not-allowed" : "opacity-100 cursor-pointer"}
                `}
                disabled={passwordInp.length == 0 ? true : false}
                onClick={clickOnBtnUsing}
            >
                استخدام
            </button>
        </div>

        {
            errorMessage != "" &&
            <p className=" text-red-500 select-none">
                {errorMessage}
            </p>
        }
    </div>
}