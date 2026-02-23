import { Btn_Subscription_Renewal_Props } from '@/Pages/Trainers-page/types'
import { RefreshCcw } from 'lucide-react'
// ========================================================== //
export default function Btn_Subscription_Renewal(
    { isInfoComplete, onSubscriptionRenwal }: Btn_Subscription_Renewal_Props
) {
    return <button
        onClick={onSubscriptionRenwal}
        className={`
            transition duration-300 
            bg-amber-300/40 text-amber-700 rounded-lg px-6 py-3 flex items-center gap-2 font-bold
            ${isInfoComplete ? 
                "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}
        `}
    >
        <span>
            <RefreshCcw size={23} />
        </span>

        <span>
            تجديد الاشتراك
        </span>
    </button>
}