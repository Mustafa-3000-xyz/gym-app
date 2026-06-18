import { accounte } from "@/Pages/types";
import { Shell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { profilePagePath } from "@/Lib/constants";
import Password_Inp from "@/Global-components/Password-inp/Password_Inp";
import { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { updateSomePropertiesInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { logOutFromOldAccount } from "@/Lib/functions";
import { Account_Card_Props } from "@/Global-components/types";
import { store_Type } from "@/Rtk/types";
import { changeLogInInfo } from "@/Rtk/Slices/UI-slices/logInInfoSlice";
// ========================================================== //
export default function Account_Card(
    { account, isShowAccountCard }: Account_Card_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);


    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");



    function clickOnLogInBtn(
        e: React.MouseEvent<HTMLButtonElement>,
        account: accounte
    ) {
        if (account.password == password) {
            // when switch another account, this action is log out from old account
            if (state.logInInfo) {
                logOutFromOldAccount(state.logInInfo.id);
            }

            // Set the new account id
            dispatch(changeLogInInfo({
                id: account.id as any,
                type: account.type as any
            }));

            // Start count the work houres for the new account
            dispatch(updateSomePropertiesInRowInAccountsTable({
                id: account.id as any,
                values: { loginDate: new Date().toISOString() }
            }) as any);


            setErrorMessage("");
        }
        else {
            setErrorMessage("كلمة المرور غير صحيحه");
        }

        e.stopPropagation();
    }

    function showAccountDetail() {
        if (state.logInInfo) {
            navigate(profilePagePath.replace(":accountId", `${account.id}`));
        }
    }



    return isShowAccountCard ?
        <div
            className={`
                transition-all duration-300
                rounded-3xl shadow-xl p-8 relative
                flex flex-col justify-between items-center w-96 gap-10 text-gray-900
                ${state.logInInfo != null
                    &&
                    (
                        state.logInInfo.type == "manager" && account.type == "captain"
                        ||
                        state.logInInfo.type == "captain" && account.type == "captain"
                    ) ?
                    "group hover:bg-(--captainColor) hover:text-white hover:m-6 hover:scale-110 cursor-pointer"
                    :
                    state.logInInfo?.type == "captain" && account.type == "manager" ?
                        "group hover:bg-(--managerColor) hover:text-white hover:m-6 hover:scale-110 cursor-pointer"
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
                    {
                        Math.trunc(Math.abs(account?.totalActiveSubscriptions)) > 99 ?
                            `99+`
                            :
                            Math.trunc(Math.abs(account?.totalActiveSubscriptions))
                    }
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