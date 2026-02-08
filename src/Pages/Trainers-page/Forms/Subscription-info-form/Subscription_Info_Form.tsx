import isShowTrainerDetails_Atom from "@/Atoms/isShowTrainerDetails_Atom";
import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
import Subscriptions_Menu from "@/Components/Subscriptions-menu/Subscriptions_Menu";
import { Subscription_Info_Form_Props } from "@/Pages/Trainers-page/trainersTypes";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
// ========================================================== //
export default function Subscription_Info_Form(
    {
        onGetSubscriptionName,
        onGetSessionsCount,
        onGetPrice
    }: Subscription_Info_Form_Props
) {
    const trainer = useAtomValue(trainerDetails_Atom);
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);

    const [subscriptionName, setSubscriptionName] = useState<string>("");
    const [sessions, setSessions] = useState<number | string>("");
    const [price, setPrice] = useState<number | string>("");



    useEffect(() => {
        if (isShowTrainerDetailsAtom && trainer) {
            setSubscriptionName(trainer.subscriptionName);
            setSessions(trainer.sessionsCount);
            setPrice(trainer.price);
        } else {
            setSubscriptionName("");
            setSessions("");
            setPrice("");
        }
    }, [isShowTrainerDetailsAtom, trainer]);


    useEffect(function () {
        onGetSubscriptionName(subscriptionName);
        onGetSessionsCount(sessions);
        onGetPrice(price);
    }, [subscriptionName, sessions, price]);



    return <form className="px-3 mb-5">
        <div>
            <Subscriptions_Menu />
        </div>

        <div className="flex justify-center flex-wrap gap-2 ">
            <div>
                <h4>اسم الاشتراك</h4>
                <input
                    value={subscriptionName}
                    onChange={(e) => setSubscriptionName(e.target.value)}
                    type="text"
                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                />
            </div>

            <div>
                <h4>عدد الحصص</h4>
                <input
                    value={sessions}
                    onChange={(e) => setSessions(e.target.value)}
                    type="number"
                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0
                        appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none
                        [&::-webkit-outer-spin-button]:appearance-none"
                />
            </div>

            <div>
                <h4>السعر</h4>
                <input
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    type="number"
                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0
                    appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                />

            </div>
        </div>
    </form>
}