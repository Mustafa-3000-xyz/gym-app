import Subscriptions_Menu from "@/Pages/Trainers-page/Components/Subscriptions-menus/Subscriptions_Menus";
import { Subscription_Info_Form_Props } from "@/Pages/types";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "lucide-react";
import Discription from "@/Global-components/Description/Discription";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { USING_ACTIVE_SOME_SESSIONS } from "@/Lib/constants";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { addSessions, removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { theTodayDate } from "@/Lib/functions";
import { differenceInDays } from "date-fns";
// ========================================================== //
export default function Subscription_Info_Form(
    {
        onGetSubscriptionName,
        onGetPrice,
        onGetActiveSomeSessions
    }: Subscription_Info_Form_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            accountes: state.accountes,
            sessionsCount: state.sessionsCount,
            trainerDetails: state.trainerDetails,
            subscriptionEnd: state.subscriptionEnd,
            subscriptionStart: state.subscriptionStart,
        }
    }, shallowEqual);


    const [activeSomeSessions, setActiveSomeSessions] = useState(0);
    const [subscriptionName, setSubscriptionName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);

    const [isUsingTheActiveSomeSessions, setIsUsingTheActiveSomeSessions] = useState(false);
    const [maxForActiveSomeSessions, setMaxForActiveSomeSessions] = useState(0);
    const [alertForActiveSomeSubscription, setAlertForActiveSomeSubscription] = useState<string | null>("");
    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);



    function makeAlertForActiveSomeSubscription() {
        if (state.sessionsCount == 0) {
            setAlertForActiveSomeSubscription("قم بكتابة عدد الحصص");
        }
        else if (!state.subscriptionStart) {
            setAlertForActiveSomeSubscription("اختر تاريخ بداية الاشتراك");
        }
        else if (new Date(state.subscriptionStart).getTime() >= todayDate.getTime()) {
            setAlertForActiveSomeSubscription("تاريخ بداية الاشتراك غير مناسب لاستخدام ميزة تفعيل بعض الحصص");
        }
        else if (!state.subscriptionEnd && new Date(state.subscriptionStart).getTime() < todayDate.getTime()) {
            setAlertForActiveSomeSubscription("قم بختيار تاريخ نهاية الاشتراك");
        }
        else if (new Date(state.subscriptionEnd as any).getTime() < todayDate.getTime()) {
            setAlertForActiveSomeSubscription("تاريخ نهاية الاشتراك غير مناسب لاستخدام ميزة تفعيل بعض الحصص");
        }
        else {
            setAlertForActiveSomeSubscription(null);
        }
    }




    useEffect(function () {
        const theAccount = state.accountes?.find(ele => ele.id == state.logInInfo?.id);

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

    useEffect(() => {
        // When open state.trainerDetails details, i want show his values
        if (state.trainerDetails) {
            setSubscriptionName(state.trainerDetails.subscriptionName);
            dispatch(addSessions(Number(state.trainerDetails.sessionsCount)))
            setPrice(state.trainerDetails.price);

            dispatch(addSessions(Number(state.trainerDetails.sessionsCount)));
        } else {
            setSubscriptionName("");
            dispatch(addSessions(0));
            setPrice(0);

            dispatch(removeAllSessions());
        }
    }, [state.trainerDetails]);

    useEffect(function () {
        onGetSubscriptionName(subscriptionName);
        onGetPrice(price);
    }, [subscriptionName, price]);

    useEffect(() => {
        const subscriptionStart = new Date(state.subscriptionStart as any);
        const subscriptionEnd = new Date(state.subscriptionEnd as any);

        if (
            state.subscriptionStart && state.subscriptionEnd &&
            subscriptionStart.getTime() < todayDate.getTime() &&
            subscriptionEnd.getTime() >= todayDate.getTime()
        ) {
            const diff = Math.abs(differenceInDays(todayDate, subscriptionStart));

            setMaxForActiveSomeSessions(
                diff >= Number(state.sessionsCount) ?
                    Number(state.sessionsCount) - 1
                    :
                    subscriptionEnd.getTime() > todayDate.getTime() ?
                        diff + 1 : diff
            );
        } else {
            setMaxForActiveSomeSessions(0);
            onGetActiveSomeSessions?.(0);
        }

        makeAlertForActiveSomeSubscription();
    }, [state.subscriptionStart, state.subscriptionEnd, state.sessionsCount, todayDate]);




    return <div className={`
            mb-5 gap-3
            ${!state.trainerDetails ? "grid grid-cols-2" : ""}
        `}
    >
        <div className={`
                w-full rounded-lg flex flex-col justify-between px-4
                ${!state.trainerDetails ? "border border-slate-300 p-4" : ""}
            `}
        >
            <Subscriptions_Menu
                onGetSubscriptionName={setSubscriptionName}
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
                    inpValue={state.sessionsCount}
                    onWriteInInput={(e) => {
                        const value = Number(e.target.value)
                        if (value <= 60) {
                            dispatch(addSessions(value));
                        }
                        else {
                            dispatch(addSessions(60));
                        }
                    }}
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
            !state.trainerDetails &&
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

                    <Discription discription="هذا الخيار يُمكنك من تفعيل بعض الحصص للاشتراكات القديمه التي لم تنتهي بعد" />
                </div>

                {/* Active some session inp */}
                <div>
                    {
                        alertForActiveSomeSubscription == null ?
                            <>
                                <input
                                    type="number"
                                    value={activeSomeSessions ?? 0}
                                    onChange={(e) => {
                                        const result = Number(e.target.value) > Number(maxForActiveSomeSessions) ? maxForActiveSomeSessions : e.target.value;
                                        onGetActiveSomeSessions?.(result as any);
                                        setActiveSomeSessions(Number(result));
                                    }}
                                    disabled={!isUsingTheActiveSomeSessions}
                                    className={`
                                        bg-slate-100 border border-slate-300 p-2 rounded-lg focus:outline-0
                                        appearance-none w-full text-center
                                        [&::-webkit-inner-spin-button]:appearance-none
                                        [&::-webkit-outer-spin-button]:appearance-none
                                        ${!isUsingTheActiveSomeSessions && "cursor-not-allowed"}
                                    `}
                                />

                                {
                                    maxForActiveSomeSessions ?
                                        <p className="font-bold mt-3">
                                            الحد الاقصى للتفعيل : {maxForActiveSomeSessions}
                                        </p>
                                        :
                                        null
                                }
                            </>
                            :
                            <p className="bg-slate-200 border border-slate-300 p-2 rounded-lg focus:outline-0 w-full cursor-not-allowed text-center">
                                {alertForActiveSomeSubscription}
                            </p>
                    }
                </div>
            </div>
        }
    </div>
}