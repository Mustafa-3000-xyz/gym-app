import { Archive, Captions, CircleUser, IdCardLanyard, Settings, Users, WalletMinimal } from "lucide-react";
import Sidebar_Links from "./Sidebar-links/Sidebar_Links";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { accountesPagePath, attendanceRecordePagePath, profilePagePath, profitsAndExpensesPagePath, settingsPagePath, subscriptionsMenuPath, trainerPagePath } from "@/Lib/constants";
import { checkPermissionesInAccount } from "@/Lib/functions";
import { openUrl } from '@tauri-apps/plugin-opener';
// ========================================================== //
export default function SideBar() {
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);


    const checkLinksPermissions = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
    }) as string[] | true;






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
            {
                checkLinksPermissions == true || checkLinksPermissions?.includes(trainerPagePath) ?
                    <Sidebar_Links
                        linkName="المتدربين"
                        path={trainerPagePath}
                        icon={<Users
                            size={25}
                            strokeWidth={1.75}
                        />}
                    />
                    :
                    null
            }

            {
                checkLinksPermissions == true || checkLinksPermissions?.includes(attendanceRecordePagePath) ?
                    <Sidebar_Links
                        linkName="سجل الحضور"
                        path={attendanceRecordePagePath}
                        icon={<Archive
                            size={25}
                            strokeWidth={1.75}
                        />}
                    />
                    :
                    null
            }

            {
                checkLinksPermissions == true || checkLinksPermissions?.includes(subscriptionsMenuPath) ?
                    <Sidebar_Links
                        linkName="قوائم الاشتراكات"
                        path={subscriptionsMenuPath}
                        icon={<Captions
                            size={25}
                            strokeWidth={1.75}
                        />}
                    />
                    :
                    null
            }

            {
                (checkLinksPermissions == true || checkLinksPermissions?.includes(trainerPagePath))
                    ||
                    (checkLinksPermissions == true as any || checkLinksPermissions?.includes(attendanceRecordePagePath))
                    ||
                    (checkLinksPermissions == true as any || checkLinksPermissions?.includes(subscriptionsMenuPath)) ?
                    <hr /> : null
            }

            {
                checkLinksPermissions == true || checkLinksPermissions?.includes(accountesPagePath) ?
                    <Sidebar_Links
                        linkName="الحسابات"
                        path={accountesPagePath}
                        icon={<IdCardLanyard
                            size={25}
                            strokeWidth={1.75}
                        />}
                    />
                    :
                    null
            }

            <Sidebar_Links
                linkName="الملف الشخصي"
                path={profilePagePath.replace(":accountId", state.logInInfo?.id as any)}
                icon={<CircleUser
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            {
                checkLinksPermissions == true || checkLinksPermissions?.includes(profitsAndExpensesPagePath) ?
                    <Sidebar_Links
                        linkName="الارباح والمصروفات"
                        path={profitsAndExpensesPagePath}
                        icon={<WalletMinimal
                            size={25}
                            strokeWidth={1.75}
                        />}
                    />
                    :
                    null
            }

            {
                checkLinksPermissions == true || checkLinksPermissions?.includes(settingsPagePath) ? <hr /> : null
            }

            {
                checkLinksPermissions == true || checkLinksPermissions?.includes(settingsPagePath) ?
                    <Sidebar_Links
                        linkName="الإعدادات"
                        path={settingsPagePath}
                        icon={<Settings
                            size={25}
                            strokeWidth={1.75}
                        />}
                    />
                    :
                    null
            }
        </ul>

        {/* Git hub, telegram */}
        <div className="group-hover:bg-slate-200 p-4 rounded-lg mb-3">
            <h3 className="font-bold text-lg mb-4 hidden group-hover:block">
                المزيد :
            </h3>

            <ul className="flex items-center flex-col gap-2 group-hover:items-start">
                <li
                    className="flex gap-2 items-center justify-end group-hover:justify-start cursor-pointer"
                    onClick={async () => await openUrl('https://github.com/Mustafa-3000-xyz')}
                >
                    <div className="w-7 h-7 shrink-0">
                        <img
                            alt="github"
                            src="/github.svg"
                            className="h-full w-full"
                        />
                    </div>

                    <span className="hidden group-hover:block font-bold hover:underline">
                        صفحة المطور
                    </span>
                </li>

                <li
                    className="flex gap-2 items-center justify-end group-hover:justify-start hover:underline cursor-pointer"
                    onClick={async () => await openUrl('https://t.me/Gym_app_channel_20')}
                >
                    <div className="w-7 h-7 shrink-0">
                        <img
                            alt="telegram"
                            src="/telegram.svg"
                            className="h-full w-full"
                        />
                    </div>

                    <span className=" hidden group-hover:block font-bold">
                        قناتنا على التليجرام
                    </span>
                </li>
            </ul>
        </div>
    </nav>
}