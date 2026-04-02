import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import { alert, stateIsFinished } from "@/Lib/customs";
import { Btn_Finished_Subscription_Props } from "@/Pages/types";
import { updateSomePropertiesInTrainer } from "@/Rtk/Slices/trainersSlice";
import { useSetAtom } from "jotai";
import { BanknoteX } from "lucide-react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Btn_Finished_Subscription(
    {
        id,
        onGetSubscriptionState,
    }: Btn_Finished_Subscription_Props
) {
    const setIsShowTrainerDetailsAtom = useSetAtom(isShowTrainerDetails_Atom);
    const dispatch = useDispatch();


    function finishedSubscriptionUsingBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            titleAfterClickOnOk: "تم إنهاء اشتراك المتدرب بنجاح",
            showMessageAfterClickOnOk: true,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: id as any,
                    values: {
                        activeSessionsList: JSON.stringify([]),
                        subscriptionState: stateIsFinished,
                    } as any
                }) as any);

                setIsShowTrainerDetailsAtom(false);
                onGetSubscriptionState(stateIsFinished);
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