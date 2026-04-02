import isShowTrainerDetails_Atom from '@/Atoms/Is/isShowTrainerDetails_Atom';
import { alert } from '@/Lib/functions';
import { stateIsActive } from '@/Lib/constants';
import { Btn_Subscription_Renewal_Props } from "@/Pages/types";
import { updateSomePropertiesInTrainer } from '@/Rtk/Slices/trainersSlice';
import { useSetAtom } from 'jotai';
import { RefreshCcw } from 'lucide-react'
import { useDispatch } from 'react-redux';
// ========================================================== //
export default function Btn_Subscription_Renewal(
    {
        trainer,
        isInfoComplete,
        onGetSubscriptionState
    }: Btn_Subscription_Renewal_Props
) {
    const setIsShowTrainerDetailsAtom = useSetAtom(isShowTrainerDetails_Atom);
    const dispatch = useDispatch();



    function subscriptionRenewal() {
        if (!isInfoComplete) return;

        alert({
            titleBeforeClickOnOk: "هل تريد تجديد الاشتراك ؟؟",
            titleAfterClickOnOk: `تم تجديد الاشتراك للمتدرب رقم : ${trainer?.trainerId}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: trainer?.trainerId as any,
                    values: {
                        ...trainer
                    }
                }) as any);

                setIsShowTrainerDetailsAtom(false);
                onGetSubscriptionState(stateIsActive);
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