import { Archive, Book, Captions, CircleUser, IdCardLanyard, Settings, Users, WalletMinimal } from "lucide-react";
import Sidebar_Links from "./Sidebar-links/Sidebar_Links";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { store_Type } from "@/Rtk/types";
import { accounte } from "@/Pages/types";
import { accountesPagePath, attendanceRecordePagePath, expalinAppPagePath, profilePagePath, profitsAndExpensesPagePath, settingsPagePath, subscriptionsMenuPath, trainerPagePath } from "@/Lib/constants";
import { Link, useLocation } from "react-router-dom";
// ========================================================== //
export default function SideBar() {
    const state = useSelector(state => state as store_Type);

    const [theAccount, setTheAccount] = useState<accounte | null>(null);
    const { pathname } = useLocation();






    useEffect(function () {
        const result = state.accountes.find(ele => ele.id == state.logInInfo?.id);

        if (!result) {
            setTheAccount(null);
            return;
        }

        const obj = {
            ...result,
            permissions: result.permissions == "fullAccess" ? "fullAccess" : JSON.parse(result.permissions as any)
        } as accounte

        setTheAccount(obj);
    }, [state.accountes, state.logInInfo]);



    return <nav className={`
            transition-all duration-500
            sticky top-0 h-screen p-4 pb-0
            flex flex-col justify-between
            bg-white border-e border-black/20
            w-[75px] hover:w-[450px] group overflow-hidden
        `}
    >
        {/* Title */}
        <div className="mb-5 text-center" dir="ltr">
            <h1 className="font-bold text-[#FB6543] select-none">
                GYM APP
            </h1>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-2 select-none h-full">
            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(trainerPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="المتدربين"
                path={trainerPagePath}
                icon={<Users
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(attendanceRecordePagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="سجل الحضور"
                path={attendanceRecordePagePath}
                icon={<Archive
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(subscriptionsMenuPath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="قائمة الاشتراكات"
                path={subscriptionsMenuPath}
                icon={<Captions
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <hr />

            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(accountesPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="الحسابات"
                path={accountesPagePath}
                icon={<IdCardLanyard
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                isShowTheLink={true}
                linkName="الملف الشخصي"
                path={profilePagePath.replace(":accountId", `${state.logInInfo?.id}`)}
                icon={<CircleUser
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(profitsAndExpensesPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="الارباح والمصروفات"
                path={profitsAndExpensesPagePath}
                icon={<WalletMinimal
                    size={25}
                    strokeWidth={1.75}
                />}
            />
        </ul>

        <div className={`
            transition duration-300 rounded-lg p-4 select-none
            flex flex-col gap-2 mb-3 group-hover:bg-slate-200
            items-center group-hover:items-start
        `}
        >
            <h2 className="hidden group-hover:flex text-lg font-bold whitespace-nowrap">
                المزيد :
            </h2>

            {
                theAccount?.permissions == "fullAccess" || theAccount?.permissions?.includes(settingsPagePath) ?
                    <Link
                        className={`
                        flex gap-2 mb-1 hover:underline
                        ${pathname == settingsPagePath && "underline"}
                    `}
                        to={settingsPagePath}
                    >
                        <Settings
                            size={25}
                            strokeWidth={1.75}
                            className="shrink-0"
                        />

                        <h3 className="hidden group-hover:flex whitespace-nowrap">
                            الاعدادات
                        </h3>
                    </Link>
                    :
                    null
            }

            <Link
                className={`
                    flex gap-2 mb-1 hover:underline
                    ${pathname == expalinAppPagePath && "underline"}
                `}
                to={expalinAppPagePath}
            >
                <Book
                    size={25}
                    strokeWidth={1.75}
                    className="shrink-0"
                />

                <h3 className="hidden group-hover:flex whitespace-nowrap">
                    شرح البرنامج
                </h3>
            </Link>
        </div>
    </nav>
}