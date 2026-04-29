import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
import Subscriptions_Menu from "@/Pages/Trainers-page/Components/Subscriptions-menu/Subscriptions_Menu";
import { Subscription_Info_Form_Props } from "@/Pages/types";
import { useAtomValue } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";
import { Shell } from "lucide-react";
import Discription from "@/Global-components/Description/Discription";
import { useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { USING_ACTIVE_SOME_SESSIONS } from "@/Lib/constants";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
// ========================================================== //
export default function Subscription_Info_Form(
    {
        onGetSubscriptionName,
        onGetSessionsCount,
        onGetPrice,
        onGetActiveSomeSessions
    }: Subscription_Info_Form_Props
) {
    const state = useSelector(state => state as store_Type);

    const isLoginAtom = useAtomValue(isLogin_Atom);
    const trainerDetailsAtom = useAtomValue(trainerDetails_Atom);
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);

    const [isUsingTheActiveSomeSessions, setIsUsingTheActiveSomeSessions] = useState(false);
    const [activeSomeSessions, setActiveSomeSessions] = useState(0);
    const [subscriptionName, setSubscriptionName] = useState<string>("");
    const [sessions, setSessions] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);



    function writeInActiveSomeSessionsInp(e: ChangeEvent<HTMLInputElement>) {
        const value = +e.target.value;

        if (value >= sessions) return;

        setActiveSomeSessions(value);
        onGetActiveSomeSessions?.(value);
    }






    useEffect(function () {
        const theAccount = state.accountes.find(ele => ele.id == isLoginAtom.id);

        if (
            theAccount?.permissions?.includes(USING_ACTIVE_SOME_SESSIONS)
            ||
            theAccount?.permissions == "fullAccess"
        ) {
            setIsUsingTheActiveSomeSessions(true);
        }
        else {
            setIsUsingTheActiveSomeSessions(false);
        }
    }, [state.accountes]);

    useEffect(function () {
        setActiveSomeSessions(0);
    }, [sessions]);

    useEffect(() => {
        if (isShowTrainerDetailsAtom && trainerDetailsAtom) {
            setSubscriptionName(trainerDetailsAtom.subscriptionName);
            setSessions(trainerDetailsAtom.sessionsCount);
            setPrice(trainerDetailsAtom.price);
        } else {
            setSubscriptionName("");
            setSessions(0);
            setPrice(0);
        }
    }, [isShowTrainerDetailsAtom, trainerDetailsAtom]);


    useEffect(function () {
        onGetSubscriptionName(subscriptionName);
        onGetSessionsCount(sessions);
        onGetPrice(price);
    }, [subscriptionName, sessions, price]);




    return <div className={`
        mb-5 gap-3
        ${!isShowTrainerDetailsAtom ? "grid grid-cols-2" : ""}
    `}
    >
        <div className={`
            w-full rounded-lg flex flex-col justify-between px-4
            ${!isShowTrainerDetailsAtom ? "border border-slate-300 p-4" : ""}
        `}
        >
            <Subscriptions_Menu
                onGetSubscriptionName={setSubscriptionName}
                onGetSessionsCount={setSessions}
                onGetPrice={setPrice}
            />

            {/* Inputs */}
            <div className="grid grid-cols-3 gap-2 mt-5">
                {/* Subscription name */}
                <Inp_With_Label
                    labelName="اسم الاشتراك"
                    inpType="text"
                    inpValue={subscriptionName}
                    onWriteInInput={(e) => setSubscriptionName(e.target.value)}
                />

                {/* Sessions count */}
                <Inp_With_Label
                    labelName="عدد الحصص"
                    inpType="number"
                    inpValue={sessions}
                    onWriteInInput={(e) => setSessions(+e.target.value)}
                />

                {/* Price */}
                <Inp_With_Label
                    labelName="السعر"
                    inpType="number"
                    inpValue={price}
                    onWriteInInput={(e) => setPrice(+e.target.value)}
                />
            </div>
        </div>


        {
            !isShowTrainerDetailsAtom &&
            <div className={`
                w-full border border-slate-300 p-4 rounded-lg flex flex-col justify-between
                ${!isUsingTheActiveSomeSessions && "cursor-not-allowed opacity-40"}
            `}
            >
                {/* Title and discription*/}
                <div className="mb-5">
                    <div className="flex items-center gap-1">
                        <Shell className="text-neutral-500 mt-1" />

                        <h3 className="text-lg  font-bold">
                            تفعيل بعض الحصص
                        </h3>
                    </div>

                    <Discription discription="هذا الخيار يُمكنك من تفعيل بعض الحصص ويجب ان تفعيل بعض الحصص تكون اقل من عدد الحصص" />
                </div>

                {/* Active some session inp */}
                <div className="mb-5">
                    <input
                        type="number"
                        value={activeSomeSessions}
                        disabled={!isUsingTheActiveSomeSessions}
                        onChange={writeInActiveSomeSessionsInp}
                        className={`
                            bg-slate-100 border border-slate-300 p-2 rounded-lg focus:outline-0
                            appearance-none w-full text-center
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none
                            ${!isUsingTheActiveSomeSessions && "cursor-not-allowed"}
                        `}
                    />
                </div>
            </div>
        }
    </div>
}