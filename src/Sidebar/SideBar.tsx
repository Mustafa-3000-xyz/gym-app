import { BellRing, CircleDollarSign, House, Info, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar_Links from "../Components/Sidebar/Sidebar-links/Sidebar_Links";
// ========================================================== //
export default function SideBar() {    
    return <nav className=" bg-white h-screen px-4 w-[350px] flex flex-col justify-between pt-4 border-e border-black/20">
        <div className="mb-12 text-center" dir="ltr">
            <h1 className="font-bold text-[#FB6543] select-none">GYM APP</h1>
        </div>

        <ul className="select-none h-full">
            <Sidebar_Links
                linkName="الصفحة الرئيسيه"
                path="/"
                icon={<House
                    size={23}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                linkName="المتدربين"
                path="/trainers-page"
                icon={<Users
                    size={23}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                linkName="الإشعارات"
                path="/notifications-page"
                icon={<BellRing
                    size={23}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                linkName="الإعدادات"
                path="/settings-page"
                icon={<Settings
                    size={23}
                    strokeWidth={1.75}
                />}
            />
        </ul>

        <div className="select-none bg-black/5 mb-4 rounded-lg p-3">
            <h3 className="mb-3 font-bold">التفاصيل</h3>

            <div>
                <Link to={"/profits-page"} className="hover:underline">
                    <div className="flex items-center gap-2 mb-3">
                        <CircleDollarSign size={23} color="#000" strokeWidth={1.75} />
                        <span>الارباح</span>
                    </div>
                </Link>


                <Link to={"/expenses-page"} className="hover:underline">
                    <div className="flex items-center gap-2">
                        <Info size={23} color="#000" strokeWidth={1.75} />
                        <span>المصروفات</span>
                    </div>
                </Link>
            </div>
        </div>
    </nav>
}