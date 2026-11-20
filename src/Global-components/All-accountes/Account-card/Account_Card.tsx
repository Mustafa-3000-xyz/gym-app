import { accounte_Type } from "@/Pages/types";
import { Shell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { profilePagePath } from "@/Lib/constants";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Password_Inp from "../Password-inp/Password_Inp";
// ========================================================== //
export default function Account_Card(
    { account }: { account: accounte_Type }
) {
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);


    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();



    function showAccountDetail() {
        // If the user login and click on another account, so show this account
        if (state.logInInfo) {
            navigate(profilePagePath.replace(":accountId", account.id as any));
        }
    }




    useEffect(function () {
        if (errorMessage == "") return;

        setTimeout(function () {
            setErrorMessage("");
        }, 3000);
    }, [errorMessage]);




    return <div
        style={{ backgroundColor: account?.color }}
        className={`
            rounded-3xl p-8 relative
            duration-300 text-white border-r-8
            flex flex-col justify-between items-center w-96 gap-10 shadow-2xl
            ${state.logInInfo ? "hover:m-6 hover:scale-110 cursor-pointer  hover:border-amber-500" : ""}
        `}
        onClick={showAccountDetail}
    >
        {/* Sessions */}
        <div className="flex gap-2 absolute bg-neutral-200 text-neutral-500 top-0 left-0 p-3 rounded-br-2xl rounded-tl-2xl">
            <Shell size={25} />

            <h3>
                {
                    Math.trunc(Math.abs(account?.numberOfActiveSessions)) > 99 ?
                        `99+`
                        :
                        Math.trunc(Math.abs(account?.numberOfActiveSessions))
                }
            </h3>
        </div>

        {/* Account image & Name & Tagline */}
        <div className="flex flex-col items-center gap-3 select-none">
            <div className=" w-28 h-28">
                <img
                    className="w-full h-full object-cover rounded-full"
                    src={account.profileImg != "" ? account.profileImg : "/account.png"}
                    alt={account.type}
                />
            </div>

            <div className="text-center">
                <h2 className="text-xl font-bold tracking-tight">
                    {account.name}
                </h2>
                <p className="text-sm text-gray-200 italic mt-1 underline">
                    <span>
                        {account.type == "manager" ? "المدير " : "الكابتن  "}
                    </span>
                    ({Math.trunc(+account.age)} سنه)
                </p>
            </div>
        </div>

        {/* Set password */}
        <Password_Inp
            account={{
                id: Number(account.id),
                type: account.type,
                color: account.color,
                password: account.password
            }}
            value={password}
            onWrite={setPassword}
            onIsErrorPassword={setErrorMessage}
        />


        {
            errorMessage ?
                <p className="text-red-500 select-none">
                    {errorMessage}
                </p>
                :
                null
        }
    </div>
}