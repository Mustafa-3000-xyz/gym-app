import { Moon, Plus } from "lucide-react";
import Active_Subscriptions from "../../Components/Home-page/Active-subscriptions/Active_Subscriptions";
import Pending_Subscriptions from "../../Components/Home-page/Pending-subscriptions/Pending_Subscriptions";
import All_Subscriptions from "../../Components/Home-page/All-subscriptions/All_Subscriptions";
import { Link } from "react-router-dom";
import Discription from "@/Components/Description/Discription";
// ========================================================== //
export default function Home_page() {
    return <section>
        {/* Title && dark mood && add new subscription */}
        <div className="select-none flex mb-5 justify-between items-center w-full">
            <div>
                <h3 className="text-2xl font-bold">الصفحة الرئيسيه</h3>
                <Discription discription=" اهلا بك يا كابتن عمرو , تلك الصفحه لمعرفة بعض التفاصيل الخاصه بالمشتركين" />
            </div>

            <div className="flex items-center gap-3">
                <button className={`
                        transition duration-500 hover:bg-blue-600
                        bg-[var(--primary)] cursor-pointer text-white rounded-sm
                    `}
                >
                    <Link to={"/settings-page"} className="flex items-center gap-2 py-2 px-5">
                        <Plus strokeWidth={1.75} />

                        <span>
                            إضافة إشتراك جديد
                        </span>
                    </Link>
                </button>

                <button className={`
                        transition duration-500 hover:bg-slate-200
                        border border-slate-300 bg-slate-50 p-2 rounded-lg cursor-pointer
                    `}
                >
                    <Moon color="#000" strokeWidth={3} />
                </button>
            </div>
        </div>

        {/* Subscription details */}
        <div className="grid grid-cols-3 gap-5">
            <Active_Subscriptions />
            <Pending_Subscriptions />
            <All_Subscriptions />
        </div>
    </section>
}