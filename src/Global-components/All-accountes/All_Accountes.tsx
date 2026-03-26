import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { alert } from "@/Lib/customs";
import { accounte } from "@/Pages/Accountes-page/types";
import { getAllAccountes } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account_Img from "./Account-img/Account_Img";
// ========================================================== //
export default function All_Accountes() {
    const [isLoginAtom, setIsLoginAtom] = useAtom(isLogin_Atom);
    const state = useSelector(state => state as store_Type);
    const dispatch = useDispatch();

    const [passwords, setPasswords] = useState<Record<number, string>>({});
    const [errorMessages, setErrorMessages] = useState<Record<number, string>>({});



    function writeInInp(
        e: React.ChangeEvent<HTMLInputElement>,
        id: number
    ) {
        setPasswords(prev => ({
            ...prev,
            [id]: e.target.value
        }));

        setErrorMessages(prev => ({
            ...prev,
            [id]: ""
        }));

        e.target.classList.remove("bg-red-500");
    }

    function clickOnLogInBtn(
        e: React.MouseEvent<HTMLButtonElement>,
        account: accounte
    ) {
        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
        const id = account.id as number;

        if (account.password == passwords[id]) {
            setIsLoginAtom({
                id: account.id as any,
                type: account.type as any
            });

            setErrorMessages(prev => ({
                ...prev,
                [id]: ""
            }));
        }
        else {
            input.classList.add("bg-red-500");
            setPasswords(prev => ({
                ...prev,
                [id]: ""
            }));

            setErrorMessages(prev => ({
                ...prev,
                [id]: "كلمة المرور غير صحيحه"
            }));
        }
    }

    function clickOnLogOutBtn() {
        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تسجيل الخروج لهذا الحساب ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                setIsLoginAtom(null);
            }
        })
    }

    function clickOnUsingThisAccountBtn(account: accounte) {
        setIsLoginAtom({ id: account.id, type: account.type });
        setPasswords({});
    }



    useEffect(function () {
        dispatch(getAllAccountes() as any);
    }, []);



    return <div className="flex justify-center items-center gap-3 flex-wrap">
        {
            state.accountes.map(ele => {
                return <div
                    key={ele.id}
                    className={`
                        transition duration-300
                        rounded-3xl shadow-xl p-8
                        flex flex-col justify-between items-center w-96 gap-10
                        ${isLoginAtom != null && isLoginAtom.id == ele.id && isLoginAtom.type == "manager" &&
                        "hover:bg-amber-500 hover:scale-110 cursor-pointer"
                        }

                        ${isLoginAtom != null && isLoginAtom.id == ele.id && isLoginAtom.type == "captain" &&
                        "hover:bg-blue-500 hover:text-white  text-gray-900 hover:scale-110 cursor-pointer"
                        }
                    `}
                >
                    {/* Account image & Name & Tagline */}
                    <div className="flex flex-col items-center gap-3 select-none">
                        <Account_Img
                            idAccount={ele.id as number}
                            img={ele.img}
                            accountType={ele.type}
                            isShowCamera={isLoginAtom != null && isLoginAtom.id == ele.id}
                        />

                        <div className="text-center">
                            <h2 className="text-xl font-bold tracking-tight">
                                {ele.name}
                            </h2>
                            <p className="text-sm text-gray-400 italic mt-1">
                                <span>
                                    {ele.type == "manager" ? "مدير المكان " : "كابتن في المكان "}
                                </span>
                                ({Math.trunc(+ele.age)} سنه)
                            </p>
                        </div>
                    </div>


                    {
                        isLoginAtom != null && ele.id == isLoginAtom.id ?
                            <button
                                className="bg-red-500 py-2 pb-3 px-10 rounded-lg text-white cursor-pointer transition duration-300 hover:bg-red-600"
                                onClick={clickOnLogOutBtn}
                            >
                                تسجيل الخروج
                            </button>
                            :
                            isLoginAtom != null && isLoginAtom.type == "manager" ?
                                <button
                                    onClick={() => clickOnUsingThisAccountBtn(ele as accounte)}
                                    className="bg-blue-500 py-2 pb-3 px-10 rounded-lg text-white cursor-pointer transition duration-300 hover:bg-blue-600"
                                >
                                    استخدام الحساب
                                </button>
                                :
                                <div className="flex gap-1">
                                    <input
                                        type="password"
                                        placeholder="الرقم السري"
                                        className="border p-2 rounded-lg px-3"
                                        value={passwords[ele.id as number] ?? ""}
                                        dir={passwords[ele.id as number] ? "ltr" : "rtl"}
                                        onChange={(e) => writeInInp(e, ele.id as number)}
                                    />

                                    <button
                                        className={`
                                            transition duration-300 whitespace-nowrap
                                            bg-blue-500 text-white p-2 rounded-lg
                                            ${!passwords[ele.id as number]?.length ?
                                                "opacity-45 cursor-not-allowed"
                                                :
                                                "opacity-100 cursor-pointer"
                                            }
                                        `}
                                        disabled={!passwords[ele.id as number]?.length}
                                        onClick={(e) => clickOnLogInBtn(e as any, ele as accounte)}
                                    >
                                        تسجيل الدخول
                                    </button>
                                </div>
                    }


                    {
                        errorMessages[ele.id as number] &&
                        <p className="text-red-500 select-none">
                            {errorMessages[ele.id as number]}
                        </p>
                    }
                </div>
            })
        }
    </div>
}