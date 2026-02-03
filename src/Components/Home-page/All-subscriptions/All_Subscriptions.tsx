import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
// ========================================================== //
export default function All_Subscriptions() {
    return <button className={`
            transform transition duration-500 hover:scale-105
            bg-[var(--primary)] text-white p-5 rounded-lg select-none cursor-pointer
        `}
    >
        <Link to={"/trainers-page"}>
            <div className=" flex justify-between mb-4">
                <Users
                    size={23}
                    strokeWidth={1.75}
                />

                <ArrowLeft
                    size={23}
                    strokeWidth={2.75}
                />
            </div>

            <div className="text-start">
                <h2 className="font-bold">المتدربين</h2>
                <p className="font-light opacity-80">عرض كل المتدربين مع الاشتراكات الخاصة بهم</p>
            </div>
        </Link>
    </button>
}
