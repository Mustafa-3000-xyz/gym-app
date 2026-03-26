import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { accounte } from "@/Pages/Accountes-page/types";
import { getAllAccountes } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// ========================================================== //
export default function All_Accountes() {
    const state = useSelector(state => state as store_Type);
    const setIsLoginAtom = useAtom(isLogin_Atom)[1];
    const dispatch = useDispatch();


    const inpRef = useRef<HTMLInputElement>(null);
    const [passwordInp, setPasswordInp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    function clickOnLogInBtn(account: accounte) {
        if (account.password == passwordInp) {
            setIsLoginAtom({
                id: account?.id as any,
                type: account?.type as any
            });
        } else {
            setPasswordInp("");
            setErrorMessage("الرقم السري غير صحيح")
            inpRef.current?.classList.add("bg-red-500");
        }
    }


    useEffect(function () {
        dispatch(getAllAccountes() as any);
    }, []);



    return <div className="flex justify-center items-center gap-3 flex-wrap">
        {
            state.accountes.map(ele => <div
                key={ele.id}
                className={`
                    rounded-3xl shadow-xl p-8
                    flex flex-col justify-between items-center w-96 gap-10
                `}
            >
                {/* Avatar & Name & Tagline*/}
                <div className="flex flex-col items-center gap-3 select-none">
                    <div className={`
                            w-30 h-30
                            ${ele.type == "manager" ? "border-amber-500" : "border-blue-500"}
                            border-4 rounded-full
                            flex items-center justify-center text-white
                        `}
                    >
                        <img
                            className={ele.img ? "object-cover" : "w-20"}
                            src={ele.img ? ele.img : "account.png"}
                            alt="account"
                        />
                    </div>

                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {ele.name}
                        </h2>
                        <p className="text-sm text-gray-400 italic mt-1">
                            <span>
                                {
                                    ele.type == "manager" ? "مدير المكان " : "كابتن في المكان "
                                }
                            </span>

                            ({Math.trunc(ele.age)} سنه)
                        </p>
                    </div>
                </div>


                {/* Password inp & Log in btn*/}
                <div className="flex items-center gap-2">
                    <input
                        dir={passwordInp ? "ltr" : "rtl"}
                        type="password"
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
                            transition duration-300 whitespace-nowrap
                            bg-blue-500 text-white p-2 rounded-lg
                            ${passwordInp.length == 0 ? "opacity-45 cursor-not-allowed" : "opacity-100 cursor-pointer"}
                        `}
                        disabled={passwordInp.length == 0 ? true : false}
                        onClick={() => clickOnLogInBtn(ele as accounte)}
                    >
                        تسجيل الدخول
                    </button>
                </div>

                {
                    errorMessage != "" &&
                    <p className=" text-red-500 select-none">
                        {errorMessage}
                    </p>
                }
            </div>)
        }
    </div>
}