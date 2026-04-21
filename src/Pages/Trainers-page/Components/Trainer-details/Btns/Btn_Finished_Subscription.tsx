import { alert } from "@/Lib/functions";
import { stateIsFinished } from "@/Lib/constants";
import { Btn_Finished_Subscription_Props } from "@/Pages/types";
import { updateSomePropertiesInTrainer } from "@/Rtk/Slices/trainersSlice";
import { BanknoteX } from "lucide-react";
import { useDispatch } from "react-redux";
import { useAtom } from "jotai";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
// ========================================================== //
export default function Btn_Finished_Subscription(
    {
        id,
        onGetSubscriptionState,
    }: Btn_Finished_Subscription_Props
) {
    const [trainerDetailsAtom, setTrainerDetailsAtom] = useAtom(trainerDetails_Atom);
    const dispatch = useDispatch();


    function finishedSubscriptionUsingBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: id as any,
                    values: {
                        activeSessionsList: JSON.stringify([]),
                        subscriptionState: stateIsFinished,
                    } as any
                }) as any);

                onGetSubscriptionState(stateIsFinished);
                setTrainerDetailsAtom({
                    ...trainerDetailsAtom,
                    subscriptionState: stateIsFinished,
                } as any);
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