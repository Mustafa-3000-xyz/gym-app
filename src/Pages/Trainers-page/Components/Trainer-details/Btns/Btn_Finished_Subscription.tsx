import { alert, stateIsFinished } from "@/Lib/customs";
import { Btn_Finished_Subscription_Props } from "@/Pages/types";
import { updateSomePropertiesInTrainer } from "@/Rtk/Slices/trainersSlice";
import { BanknoteX } from "lucide-react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Btn_Finished_Subscription(
    {
        id,
        trainerState,
        onGetSubscriptionState,
        onGetTrainer
    }: Btn_Finished_Subscription_Props
) {
    const dispatch = useDispatch();


    function finishedSubscriptionUsingBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: id as any,
                    trainer: trainerState as any
                }) as any);


                onGetSubscriptionState(stateIsFinished);
                onGetTrainer(trainerState as any);
            }
        });
    }



    return <button
        onClick={finishedSubscriptionUsingBtn}
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