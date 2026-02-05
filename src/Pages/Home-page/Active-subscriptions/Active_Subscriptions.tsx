import { Check } from "lucide-react";
// ========================================================== //
export default function Active_Subscriptions() {
  return <button className={`
    transform transition duration-500 hover:scale-105
    border border-slate-300 bg-slate-50 p-5 rounded-lg select-none cursor-pointer
  `}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="bg-emerald-100 text-emerald-600 font-bold rounded-lg px-4  pt-1">
        +4 النهارده
      </div>

      <div className="bg-emerald-100 p-2 rounded-lg">
        <div className="text-white bg-emerald-500 font-bold rounded-full p-2">
          <Check size={18} strokeWidth={3} />
        </div>
      </div>
    </div>

    <p className="font-bold text-start">800 اشتراك مفعل</p>
  </button>
}