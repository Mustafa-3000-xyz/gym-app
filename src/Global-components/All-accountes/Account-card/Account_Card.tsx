import { accounte } from "@/Pages/types";
import { useAtom } from "jotai";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { Shell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { profilePagePath, trainerPagePath } from "@/Lib/constants";
import Password_Inp from "@/Global-components/Password-inp/Password_Inp";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSomePropertiesInAccount } from "@/Rtk/Slices/accountsSlice";
import { logOutFromOldAccount } from "@/Lib/functions";
import { Account_Card_Props } from "@/Global-components/types";
// ========================================================== //
export default function Account_Card(
    { account, isShowAccountCard }: Account_Card_Props
) {
    const dispatch = useDispatch();
    const [isLoginAtom, setIsLoginAtom] = useAtom(isLogin_Atom);


    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");



    function clickOnLogInBtn(
        e: React.MouseEvent<HTMLButtonElement>,
        account: accounte
    ) {
        if (account.password == password) {
            // when switch another account, this action is log out from old account
            if (isLoginAtom) {
                logOutFromOldAccount(isLoginAtom.id);
            }

            // Set the new account id
            setIsLoginAtom({
                id: account.id as any,
                type: account.type as any
            });

            // Start count the work houres for the new account
            dispatch(updateSomePropertiesInAccount({
                id: account.id as any,
                values: {
                    loginDate: new Date().toISOString(),
                    logOutDate: ""
                }
            }) as any);

            setErrorMessage("");
            navigate(trainerPagePath);
        }
        else {
            setErrorMessage("كلمة المرور غير صحيحه");
        }

        e.stopPropagation();
    }

    function showAccountDetail() {
        if (isLoginAtom && isLoginAtom.type == "manager") {
            navigate(profilePagePath.replace(":accountId", account.id as any));
        }
    }



    return isShowAccountCard ?
        <div
            className={`
                transition-all duration-300
                rounded-3xl shadow-xl p-8 relative
                flex flex-col justify-between items-center w-96 gap-10 text-gray-900
                ${isLoginAtom != null && isLoginAtom.id == account.id && isLoginAtom.type == "manager" ?
                    "hover:bg-(--managerColor) hover:text-white hover:m-6 hover:scale-110 cursor-pointer"
                    :
                    ""
                }

                ${(isLoginAtom != null && isLoginAtom.type == "manager" && account.type == "captain")
                    ||
                    (isLoginAtom != null && isLoginAtom.id == account.id && account.type == "captain") ?
                    "group hover:bg-(--captainColor) hover:text-white hover:m-6 hover:scale-110 cursor-pointer"
                    :
                    ""
                }
            `}
            onClick={showAccountDetail}
        >
            {/* Sessions */}
            <div className="flex gap-2 absolute bg-neutral-200 text-neutral-500 top-0 left-0 p-3 rounded-br-2xl rounded-tl-3xl">
                <Shell size={25} />

                <h3>
                    {Math.trunc(account.totalForActiveSessions)}
                </h3>
            </div>

            {/* Account image & Name & Tagline */}
            <div className="flex flex-col items-center gap-3 select-none">
                <div className=" w-28 h-28">
                    <img
                        className={`
                            w-full h-full object-cover rounded-full border-4
                            ${account.type == "manager" ? "border-(--colorManager)" : "border-(--captainColor)"}
                        `}
                        src={account.profileImg != "" ? account.profileImg : "/account.png"}
                        alt={account.type}
                    />
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold tracking-tight">
                        {account.name}
                    </h2>
                    <p className="text-sm text-gray-400 italic mt-1">
                        <span>
                            {account.type == "manager" ? "المدير" : "كابتن في المكان "}
                        </span>
                        ({Math.trunc(+account.age)} سنه)
                    </p>
                </div>
            </div>

            {/* Set password */}
            <div className="flex gap-1">
                <Password_Inp
                    removeValue={errorMessage != "" ? true : false}
                    onWriteInInput={(e) => setPassword(e.target.value)}
                />


                <button
                    className={`
                    transition duration-300 whitespace-nowrap
                    bg-neutral-500 text-white p-2 rounded-lg
                    ${!password ? "opacity-45 cursor-not-allowed" : "opacity-100 cursor-pointer"}
                `}
                    disabled={!password}
                    onClick={(e) => clickOnLogInBtn(e as any, account as accounte)}
                >
                    استخدام
                </button>
            </div>


            {
                errorMessage &&
                <p className="text-red-500 select-none">
                    {errorMessage}
                </p>
            }
        </div>
        :
        null
}