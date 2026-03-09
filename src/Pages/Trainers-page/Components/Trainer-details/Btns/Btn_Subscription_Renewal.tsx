import { alert, stateIsActive } from '@/Lib/customs';
import { Btn_Subscription_Renewal_Props } from '@/Pages/Trainers-page/types'
import { updateSomePropertiesInTrainer } from '@/Rtk/Slices/trainersSlice';
import { RefreshCcw } from 'lucide-react'
import { useDispatch } from 'react-redux';
// ========================================================== //
export default function Btn_Subscription_Renewal(
    {
        trainer,
        trainerState,
        isInfoComplete,
        closeWindow,
        onGetSubscriptionState
    }: Btn_Subscription_Renewal_Props
) {
    const dispatch = useDispatch();



    function subscriptionRenewal() {
        if (!isInfoComplete) return;

        alert({
            titleBeforeClickOnOk: "هل تريد تجديد الاشتراك ؟؟",
            titleAfterClickOnOk: `تم تجديد الاشتراك للمتدرب رقم : ${trainer?.trainerId}`,
            funRunWhenClickOnOk: function () {
                const obj = {
                    ...trainerState as any,
                    firstName: trainer?.firstName,
                    lastName: trainer?.lastName,
                    phone: trainer?.phone,
                    address: trainer?.address,
                    activeSessionsList: JSON.stringify([]),
                };

                dispatch(updateSomePropertiesInTrainer({
                    trainerId: trainer?.trainerId as any,
                    trainer: obj as any
                }) as any);

                onGetSubscriptionState(stateIsActive);
                closeWindow();
            }
        });
    }



    return <button
        onClick={subscriptionRenewal}
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