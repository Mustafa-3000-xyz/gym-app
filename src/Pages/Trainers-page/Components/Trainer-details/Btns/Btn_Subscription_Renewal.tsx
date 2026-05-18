import { alert } from '@/Lib/functions';
import { Btn_Subscription_Renewal_Props } from "@/Pages/types";
import { updateSomePropertiesInRowInTrainersTable } from '@/Rtk/Slices/trainersSlice';
import { removeTrainerDetails } from '@/Rtk/Slices/trainerDetailsSlice';
import { RefreshCcw } from 'lucide-react'
import { useDispatch } from 'react-redux';
// ========================================================== //
export default function Btn_Subscription_Renewal(
    {
        trainer,
        isInfoComplete,
    }: Btn_Subscription_Renewal_Props
) {
    const dispatch = useDispatch();



    function subscriptionRenewal() {
        if (!isInfoComplete) return;

        alert({
            titleBeforeClickOnOk: "هل تريد تجديد الاشتراك ؟؟",
            titleAfterClickOnOk: `تم تجديد الاشتراك للمتدرب رقم : ${trainer?.trainerId}`,
            showMessageAfterClickOnOk: true,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInRowInTrainersTable({
                    trainerId: trainer?.trainerId as any,
                    values: {
                        ...trainer,
                        activeSessionsList: JSON.stringify([]) as any
                    }
                }) as any);

                dispatch(removeTrainerDetails() as any);
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