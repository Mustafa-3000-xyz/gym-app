import Subscriptions_Menu from "@/Pages/Trainers-page/Components/Subscriptions-menus/Subscriptions_Menus";
import { Subscription_Info_Form_Props } from "@/Pages/typesProps";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "lucide-react";
import Discription from "@/Global-components/Description/Discription";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { maxSessions, maxSubscriptionPrice, USING_ACTIVE_SOME_SESSIONS } from "@/Lib/constants";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { checkPermissionesInAccount, theTodayDate } from "@/Lib/functions";
import { differenceInDays } from "date-fns";
import { regexSubscriptionName } from "@/Lib/REGEX";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
// ========================================================== //
export default function Subscription_Info_Form(
    {
        subscriptionStart,
        subscriptionEnd,
        onGetSubscriptionName,
        onGetPrice,
        onGetSessions,
        onGetActiveSomeSessions
    }: Subscription_Info_Form_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            trainerDetails: state.trainerDetails,
        }
    }, shallowEqual);


    const [alertForActiveSomeSubscription, setAlertForActiveSomeSubscription] = useState<string | null>("");
    const [maxForActiveSomeSessions, setMaxForActiveSomeSessions] = useState(0);
    const [activeSomeSessionsInp, setActiveSomeSessionsInp] = useState(0);

    const [subscriptionName, setSubscriptionName] = useState<string>("");
    const [sessions, setSessions] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);

    // Dont't change the startingInHalfNight value 
    const todayDate = useMemo(() => theTodayDate({ startingInHalfNight: true }), []);

    const checkActiveSomeSessionsPermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: USING_ACTIVE_SOME_SESSIONS
    });




    function makeAlertForActiveSomeSubscription() {
        if (!sessions) {
            setAlertForActiveSomeSubscription("قم بكتابة عدد الحصص");
        }
        else if (!subscriptionStart) {
            setAlertForActiveSomeSubscription("اختر تاريخ بداية الاشتراك");
        }
        else if (new Date(subscriptionStart).getTime() >= todayDate.getTime()) {
            setAlertForActiveSomeSubscription("تاريخ بداية الاشتراك غير مناسب لاستخدام ميزة تفعيل بعض الحصص");
        }
        else if (!subscriptionEnd && new Date(subscriptionStart).getTime() < todayDate.getTime()) {
            setAlertForActiveSomeSubscription("قم بختيار تاريخ نهاية الاشتراك");
        }
        else if (new Date(subscriptionEnd as any).getTime() < todayDate.getTime() || new Date(subscriptionEnd as any).getTime() == todayDate.getTime()) {
            setAlertForActiveSomeSubscription("تاريخ نهاية الاشتراك غير مناسب لاستخدام ميزة تفعيل بعض الحصص");
        }
        else {
            setAlertForActiveSomeSubscription(null);
        }
    }




    // When open state.trainerDetails details, i want show his values
    useEffect(() => {
        if (state.trainerDetails) {
            setSubscriptionName(state.trainerDetails.subscriptionName);
            setSessions(state.trainerDetails.sessionsCount);
            setPrice(state.trainerDetails.price ?? 0);
        } else {
            setSubscriptionName("");
            setSessions(0);
            setPrice(0);
        }
    }, [state.trainerDetails]);

    useEffect(function () {
        if (activeSomeSessionsInp == 0) {
            onGetActiveSomeSessions?.(0);
        } else {
            onGetActiveSomeSessions?.(activeSomeSessionsInp);
        }
    }, [activeSomeSessionsInp]);

    useEffect(function () {
        if (subscriptionName?.match(regexSubscriptionName)) {
            onGetSubscriptionName(subscriptionName);
        } else {
            onGetSubscriptionName(null);
        }

        if (sessions > 0) {
            onGetSessions(sessions);
        } else {
            onGetSessions(null);
        }

        if (price > 0) {
            onGetPrice(price);
        } else {
            onGetPrice(null);
        }
    }, [subscriptionName, sessions, price]);

    // This for active some sessions
    useEffect(() => {
        const subscriptionStartDate = new Date(subscriptionStart as any);
        const subscriptionEndDate = new Date(subscriptionEnd as any);

        if (
            sessions && subscriptionStart && subscriptionEnd &&
            subscriptionStartDate.getTime() < todayDate.getTime() &&
            subscriptionEndDate.getTime() > todayDate.getTime()
        ) {
            const diff = Math.abs(differenceInDays(todayDate, subscriptionStart));
            const result = diff >= sessions ? sessions - 1 : diff

            setMaxForActiveSomeSessions(result);
        } else {
            setMaxForActiveSomeSessions(0);
        }

        setActiveSomeSessionsInp(0);
        onGetActiveSomeSessions?.(0);
        makeAlertForActiveSomeSubscription();
    }, [subscriptionStart, subscriptionEnd, sessions, todayDate]);




    return <div className={`
            mb-5 gap-3 grid
            ${!state.trainerDetails && checkActiveSomeSessionsPermission ? "grid-cols-2 " : "grid-cols-1"}
        `}
    >
        <div className={`
                w-full rounded-lg flex flex-col justify-between px-4
                ${!state.trainerDetails ? "border border-slate-300 p-4" : ""}
            `}
        >
            <Subscriptions_Menu
                onGetSubscriptionName={setSubscriptionName}
                onGetSesions={setSessions}
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
                        onWriteInInput={setSubscriptionName}
                    />

                    <Max_Min_Length
                        isGreenFlag={subscriptionName?.length >= 3 && subscriptionName?.length <= 11}
                        maxLength={11}
                        minLength={subscriptionName.length}
                    />
                </div>

                {/* Sessions count */}
                <div>
                    <Inp_With_Label
                        labelName="عدد الحصص"
                        inpType="number"
                        inpValue={sessions == 0 ? "" : sessions}
                        onWriteInInput={(value) => {
                            if (Number(value) < maxSessions) {
                                setSessions(Number(value));
                            }
                            else if (Number(value) >= maxSessions) {
                                setSessions(Number(maxSessions));
                            }
                        }}
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
                        onWriteInInput={(value) => {
                            if (Number(value) < maxSubscriptionPrice) {
                                setPrice(Number(value));
                            }
                            else if (Number(value) >= maxSubscriptionPrice) {
                                setPrice(maxSubscriptionPrice);
                            }
                        }} />

                    <p className="font-bold">
                        الحد الاقصى : {maxSubscriptionPrice}
                    </p>
                </div>
            </div>
        </div>


        {/* Active some sessions */}
        {
            !state.trainerDetails && checkActiveSomeSessionsPermission ?
                <div className="w-full border border-slate-300 p-4 rounded-lg flex flex-col justify-between">
                    {/* Title and discription*/}
                    <div>
                        <div className="flex items-center gap-1">
                            <Shell className="text-neutral-500 mt-1" />

                            <h3 className="text-lg  font-bold">
                                تفعيل بعض الحصص (اختياري)
                            </h3>
                        </div>

                        <Discription discription="هذا الخيار يُمكنك من تفعيل بعض الحصص للاشتراكات القديمه التي لم تنتهي بعد" />
                    </div>

                    {/* Active some session inp */}
                    <div>
                        {
                            alertForActiveSomeSubscription == null ?
                                <Inp_With_Label
                                    inpType="number"
                                    inpValue={activeSomeSessionsInp == 0 ? "" : activeSomeSessionsInp}
                                    labelName={`الحد الاقصى للتفعيل : ${maxForActiveSomeSessions}`}
                                    className=""
                                    onWriteInInput={(value) => {
                                        if (Number(value) > Number(maxForActiveSomeSessions)) {
                                            setActiveSomeSessionsInp(maxForActiveSomeSessions);
                                        }
                                        else {
                                            setActiveSomeSessionsInp(Number(value));
                                        }
                                    }}
                                />
                                :
                                <p className="bg-red-500 font-bold border border-slate-300 p-2 rounded-lg focus:outline-0 w-full cursor-not-allowed text-center">
                                    {alertForActiveSomeSubscription}
                                </p>
                        }
                    </div>
                </div>
                :
                null
        }
    </div>
}