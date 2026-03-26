import { Archive, IdCardLanyard, Info, Settings, Users, WalletMinimal } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar_Links from "./Sidebar-links/Sidebar_Links";
// ========================================================== //
export default function SideBar() {
    return <nav className={`
            transition-all duration-500
            sticky top-0 h-screen p-4 pb-0
            flex flex-col justify-between
            bg-white border-e border-black/20
            w-[75px] hover:w-[450px] group overflow-hidden
        `}
    >
        <div className="mb-5 text-center" dir="ltr">
            <h1 className="font-bold text-[#FB6543] select-none">GYM APP</h1>
        </div>

        <ul className="flex flex-col gap-2 select-none h-full">
            <Sidebar_Links
                linkName="المتدربين"
                path="/trainers-page"
                icon={<Users
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                linkName="الحسابات"
                path="/accountes-page"
                icon={<IdCardLanyard
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                linkName="سجل الحضور"
                path="/attendance-recorde-page"
                icon={<Archive
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                linkName="الارباح والمصروفات"
                path="/profits-and-expenses-page"
                icon={<WalletMinimal
                    size={25}
                    strokeWidth={1.75}
                />}
            />
        </ul>

        <div className={`
            select-none bg-black/5 mb-4 rounded-lg p-3
            transition-all duration-300 ease-initial
            opacity-0 scale-z-0 pointer-events-none
            group-hover:opacity-100 group-hover:scale-z-100 group-hover:pointer-events-auto
        `}
        >
            <h3 className="mb-2 font-bold">
                المزيد :
            </h3>

            <div>
                <Link to={"/settings-page"} className="hover:underline">
                    <div className="flex items-center gap-2 mb-2">
                        <Settings
                            size={23}
                            strokeWidth={1.75}
                        />
                        <span>
                            الإعدادات
                        </span>
                    </div>
                </Link>

                <Link to={"/profits-page"} className="hover:underline">
                    <div className="flex items-center gap-2">
                        <Info
                            size={23}
                            strokeWidth={1.75}
                        />
                        <span>شرح البرنامج</span>
                    </div>
                </Link>
            </div>
        </div>
    </nav>
}