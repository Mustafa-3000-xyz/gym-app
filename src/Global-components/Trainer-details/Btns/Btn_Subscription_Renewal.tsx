import { alert } from '@/Lib/functions';
import { Btn_Subscription_Renewal_Props } from "@/Pages/types";
import { updateSomePropertiesInRowInTrainersTable } from '@/Rtk/Slices/Db-slices/trainersSlice';
import { removeTrainerDetails } from '@/Rtk/Slices/UI-slices/trainerDetailsSlice';
import { RefreshCcw } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { stateIsActive } from '@/Lib/constants';
import { removeSubscriptionStart } from '@/Rtk/Slices/UI-slices/subscriptionStartSlice';
import { removeSubscriptionEnd } from '@/Rtk/Slices/UI-slices/subscriptionEndSlice';
import { removeAllSessions } from '@/Rtk/Slices/UI-slices/sessionsCountSlice';
// ========================================================== //
export default function Btn_Subscription_Renewal(
    { trainer, isInfoComplete }: Btn_Subscription_Renewal_Props
) {
    const dispatch = useDispatch();



    function subscriptionRenewal() {
        if (!isInfoComplete) return;

        alert({
            titleBeforeClickOnOk: "هل تريد تجديد الاشتراك ؟؟",
            titleAfterClickOnOk: `تم تجديد الاشتراك للمتدرب رقم : ${trainer?.id}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInRowInTrainersTable({
                    id: trainer?.id as any,
                    values: {
                        ...trainer,
                        subscriptionState: stateIsActive,
                        activeSessionsList: JSON.stringify([]) as any
                    }
                }) as any);

                dispatch(removeTrainerDetails() as any);
                dispatch(removeSubscriptionStart());
                dispatch(removeSubscriptionEnd());
                dispatch(removeAllSessions());
            }
        });
    }



    return <button
        type='button'
        className={`
            duration-300 
            bg-amber-300/40 text-amber-700 rounded-lg px-6 py-3 flex items-center gap-2 font-bold
            ${isInfoComplete ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}
        `}
        onClick={subscriptionRenewal}
    >
        <span>
            <RefreshCcw size={23} />
        </span>

        <span>
            تجديد الاشتراك
        </span>
    </button>
}