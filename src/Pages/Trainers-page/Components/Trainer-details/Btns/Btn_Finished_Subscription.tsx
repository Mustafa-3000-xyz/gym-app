import { alert } from "@/Lib/functions";
import { stateIsFinished } from "@/Lib/constants";
import { updateSomePropertiesInTrainer } from "@/Rtk/Slices/trainersSlice";
import { removeTrainerDetails } from "@/Rtk/Slices/trainerDetailsSlice";
import { BanknoteX } from "lucide-react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Btn_Finished_Subscription(
    {trainerId}: {trainerId: number}
) {
    const dispatch = useDispatch();



    function finishedSubscriptionUsingBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            titleAfterClickOnOk: `تم إنهاء الاشتراك للمتدرب رقم : ${trainerId}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: trainerId as any,
                    values: {
                        activeSessionsList: JSON.stringify([]),
                        subscriptionState: stateIsFinished,
                    } as any
                }) as any);

                dispatch(removeTrainerDetails());
            }
        });
    }



    return <button
        type='button'
        className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-amber-300/40 text-amber-700"
        onClick={finishedSubscriptionUsingBtn}
    >
        <span>
            <BanknoteX size={23} />
        </span>

        <span>
            إنهاء الاشتراك
        </span>
    </button>
}