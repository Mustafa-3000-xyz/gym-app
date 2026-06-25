import Subscriptions_Menu from "@/Pages/Trainers-page/Components/Subscriptions-menus/Subscriptions_Menus";
import { Subscription_Info_Form_Props } from "@/Pages/types";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "lucide-react";
import Discription from "@/Global-components/Description/Discription";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { maxSessions, maxSubscriptionPrice, USING_ACTIVE_SOME_SESSIONS } from "@/Lib/constants";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { addSessions, removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { checkThePermissionIsHere, theTodayDate } from "@/Lib/functions";
import { differenceInDays } from "date-fns";
import { regexSubscriptionName } from "@/Lib/REGEX";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
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
            sessionsCount: state.sessionsCount,
            trainerDetails: state.trainerDetails,
            subscriptionEnd: state.subscriptionEnd,
            subscriptionStart: state.subscriptionStart,
        }
    }, shallowEqual);


    const [alertForActiveSomeSubscription, setAlertForActiveSomeSubscription] = useState<string | null>("");
    const [maxForActiveSomeSessions, setMaxForActiveSomeSessions] = useState(0);
    const [activeSomeSessions, setActiveSomeSessions] = useState<number>(0);

    const [subscriptionName, setSubscriptionName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);

    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);

    const checkActiveSomeSessionsPermission = checkThePermissionIsHere({
        accountId: Number(state.logInInfo?.id), 
        permissionType: USING_ACTIVE_SOME_SESSIONS
    });




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

    function writeInSessionsInp(e: any) {
        const value = Number(e.target.value);


        if (value < maxSessions) {
            dispatch(addSessions(value));
        }
        else if (value >= maxSessions) {
            dispatch(addSessions(maxSessions));
        }
    }

    function writeInPriceInp(e: any) {
        const value = Number(e.target.value);


        if (value < maxSubscriptionPrice) {
            setPrice(value);
        }
        else if (value >= maxSubscriptionPrice) {
            setPrice(maxSubscriptionPrice);
        }
    }




    // When open state.trainerDetails details, i want show his values
    useEffect(() => {
        if (state.trainerDetails) {
            setSubscriptionName(state.trainerDetails.subscriptionName ?? "");
            dispatch(addSessions(state.trainerDetails.sessionsCount ?? 0));
            setPrice(state.trainerDetails.price ?? 0);
        } else {
            setSubscriptionName("");
            dispatch(removeAllSessions());
            setPrice(0);
        }
    }, [state.trainerDetails]);

    useEffect(function () {
        if (subscriptionName?.match(regexSubscriptionName)) {
            onGetSubscriptionName(subscriptionName);
        } else {
            onGetSubscriptionName(null);
        }

        if (price > 0) {
            onGetPrice(price);
        } else {
            onGetPrice(null);
        }
    }, [subscriptionName, price]);

    // This for activeSomeSessions
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
                <div>
                    <Inp_With_Label
                        labelName="اسم الاشتراك"
                        inpType="text"
                        inpValue={subscriptionName}
                        onWriteInInput={(e) => setSubscriptionName(e.target.value)}
                    />

                    <Max_Min_Length
                        isGreenFlag={subscriptionName?.length < 3 || subscriptionName?.length > 11}
                        maxLength={11}
                        minLength={subscriptionName.length}
                    />
                </div>

                {/* Sessions count */}
                <div>
                    <Inp_With_Label
                        labelName="عدد الحصص"
                        inpType="number"
                        inpValue={state.sessionsCount == 0 ? "" : state.sessionsCount}
                        onWriteInInput={(e) => writeInSessionsInp(e)}
                    />

                    <p className="font-bold">
                        الحد الاقصى : {maxSessions}
                    </p>
                </div>

                {/* Price */}
                <div>
                    <Inp_With_Label
                        labelName="السعر"
                        inpType="number"
                        inpValue={price == 0 ? "" : price}
                        onWriteInInput={(e) => writeInPriceInp(e)}
                    />

                    <p className="font-bold">
                        الحد الاقصى : {maxSubscriptionPrice}
                    </p>
                </div>
            </div>
        </div>


        {/* Active some sessions */}
        {
            !state.trainerDetails &&
            <div className={`
                    w-full border border-slate-300 p-4 rounded-lg flex flex-col justify-between
                    ${!checkActiveSomeSessionsPermission ? "cursor-not-allowed opacity-40" : ""}
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
                                    disabled={!checkActiveSomeSessionsPermission}
                                    className={`
                                        bg-slate-100 border border-slate-300 p-2 rounded-lg focus:outline-0
                                        appearance-none w-full text-center
                                        [&::-webkit-inner-spin-button]:appearance-none
                                        [&::-webkit-outer-spin-button]:appearance-none
                                        ${!checkActiveSomeSessionsPermission && "cursor-not-allowed"}
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