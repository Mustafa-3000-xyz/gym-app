import { Notebook } from "lucide-react";
// ========================================================== //
export default function Pending_Subscriptions() {
    return <button className={`
            transform transition duration-500 hover:scale-105
            border border-slate-300 bg-slate-50 p-5 rounded-lg select-none cursor-pointer
        `}
    >
        <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-200 text-yellow-600 font-bold rounded-lg px-4  pt-1">
                إشتراكات قيد التفعيل
            </div>

            <div className="bg-yellow-500/40 text-yellow-700 p-2 rounded-lg">
                <Notebook size={23}/>
            </div>
        </div>

        <p className="font-bold text-start">
            12 إشتراك
        </p>
    </button>
}
