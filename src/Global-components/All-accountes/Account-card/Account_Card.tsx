import { useEffect, useState } from "react";
import Account_Img from "../Account-img/Account_Img";
import { accounte } from "@/Pages/types";
import { useAtom, useSetAtom } from "jotai";
import isShowAccountDetails_Atom from "@/Atoms/Is/isShowAccountDetails_Atom";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { useDispatch } from "react-redux";
import { updatePropertyInAccount } from "@/Rtk/Slices/accountsSlice";
import { alert } from "@/Lib/customs";
import accountDetails_Atom from "@/Atoms/Details/accountDetails_Atom";
// ========================================================== //
export default function Account_Card(
    { account }: { account: accounte }
) {
    const dispatch = useDispatch();

    const setIsShowAccountDetailsAtom = useSetAtom(isShowAccountDetails_Atom);
    const setAccountDetailsAtom = useSetAtom(accountDetails_Atom);
    const [isLoginAtom, setIsLoginAtom] = useAtom(isLogin_Atom);


    const [img, setImg] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");



    function writeInInp(e: React.ChangeEvent<HTMLInputElement>) {
        e.target.classList.remove("bg-red-500");

        setPassword(e.target.value);
        setErrorMessage("");
    }

    function clickOnLogInBtn(
        e: React.MouseEvent<HTMLButtonElement>,
        account: accounte
    ) {
        // Get input
        const input = e.currentTarget.previousElementSibling as HTMLInputElement;

        if (account.password == password) {
            setIsLoginAtom({
                id: account.id as any,
                type: account.type as any
            });

            setErrorMessage("");
        }
        else {
            input.classList.add("bg-red-500");
            setErrorMessage("كلمة المرور غير صحيحه");
        }

        setPassword("");
        e.stopPropagation();
    }

    function clickOnLogOutBtn(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();

        setIsShowAccountDetailsAtom(false);

        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تسجيل الخروج لهذا الحساب ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                setIsLoginAtom(null);
            }
        });
    }

    function showAccountDetail() {
        if (!isLoginAtom) return;

        if (
            (isLoginAtom.id == account.id)
            ||
            (isLoginAtom.type == "manager")
        ) {
            setIsShowAccountDetailsAtom(true);
            setAccountDetailsAtom(account);
            return;
        }
    }




    useEffect(function () {
        if (!img) return;

        dispatch(updatePropertyInAccount({
            id: isLoginAtom.id,
            column: "img",
            value: img
        }) as any);
    }, [img]);



    return <div
        className={`
            transition-all duration-300
            rounded-3xl shadow-xl p-8
            flex flex-col justify-between items-center w-96 gap-10 text-gray-900
            ${isLoginAtom != null && isLoginAtom.id == account.id && isLoginAtom.type == "manager" ?
                "hover:bg-(--managerColor) hover:text-white hover:m-6 hover:scale-110 cursor-pointer"
                :
                ""
            }

            ${
                (isLoginAtom != null && isLoginAtom.type == "manager" && account.type == "captain")
                ||
                (isLoginAtom != null && isLoginAtom.id == account.id && account.type == "captain") ?
                "group hover:bg-(--captainColor) hover:text-white hover:m-6 hover:scale-110 cursor-pointer"
                :
                ""
            }
        `}
        onClick={showAccountDetail}
    >
        {/* Account image & Name & Tagline */}
        <div className="flex flex-col items-center gap-3 select-none">
            <Account_Img
                img={account.img}
                accountType={account.type}
                isShowCamera={isLoginAtom != null && isLoginAtom.id == account.id}
                whenClickOnCameraCloseAccountDetails={true}
                onGetImg={setImg}
            />

            <div className="text-center">
                <h2 className="text-xl font-bold tracking-tight">
                    {account.name}
                </h2>
                <p className="text-sm text-gray-400 italic mt-1">
                    <span>
                        {account.type == "manager" ? "مدير المكان " : "كابتن في المكان "}
                    </span>
                    ({Math.trunc(+account.age)} سنه)
                </p>
            </div>
        </div>


        {/* [Set password] OR [log out] */}
        <div>
            {
                isLoginAtom != null && account.id == isLoginAtom.id ?
                    <button
                        className="bg-red-500 py-2 pb-3 px-10 rounded-lg text-white cursor-pointer transition duration-300 hover:bg-red-600"
                        onClick={clickOnLogOutBtn}
                    >
                        تسجيل الخروج
                    </button>
                    :
                    <div className="flex gap-1">
                        <input
                            type="password"
                            placeholder="الرقم السري"
                            className="border p-2 rounded-lg px-3 focus:outline-0"
                            dir={password ? "ltr" : "rtl"}
                            value={password ?? ""}
                            onChange={writeInInp}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <button
                            className={`
                                transition duration-300 whitespace-nowrap
                                bg-neutral-500 text-white p-2 rounded-lg
                                ${!password ?
                                    "opacity-45 cursor-not-allowed"
                                    :
                                    "opacity-100 cursor-pointer"
                                }
                            `}
                            disabled={!password}
                            onClick={(e) => clickOnLogInBtn(e as any, account as accounte)}
                        >
                            تسجيل الدخول
                        </button>
                    </div>
            }
        </div>


        {
            errorMessage &&
            <p className="text-red-500 select-none">
                {errorMessage}
            </p>
        }
    </div>
}