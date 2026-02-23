import { BanknoteX } from "lucide-react";
// ========================================================== //
export default function Btn_Finished_Subscription(
    {onFinishedSubscription} : {onFinishedSubscription: ()=> void}
) {
    return <button
        onClick={onFinishedSubscription}
        className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-amber-300/40 text-amber-700"
    >
        <span>
            <BanknoteX size={23} />
        </span>

        <span>
            إنهاء الاشتراك
        </span>
    </button>
}