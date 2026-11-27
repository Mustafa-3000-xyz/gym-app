import Subscriptions_Menu from "@/Pages/Trainers-page/Components/Subscriptions_Menus";
import { useCallback, useEffect, useState } from "react";
import { ChartPie, Shell } from "lucide-react";
import { maxSessions, maxSubscriptionPrice } from "@/Lib/constants";
import { differenceInDays } from "date-fns";
import { regexSubscriptionName } from "@/Lib/REGEX";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { InputText } from "primereact/inputtext";
import { Subscription_Info_Form_Props } from "@/Pages/typesProps";
import { useParams } from "react-router-dom";
// ========================================================== //
export default function Subscription_Info_Form(
    {
        subscriptionName,
        price,
        sessions,
        subscriptionStart,
        subscriptionEnd,
        debt,
        activeSomeSessions,
        onGetSubscriptionName,
        onGetSessions,
        onGetPrice,
        onGetActiveSomeSessions,
        onGetDebt
    }: Subscription_Info_Form_Props
) {
    const [alertForActiveSomeSubscription, setAlertForActiveSomeSubscription] = useState<string | null>("");
    const [maxForActiveSomeSessions, setMaxForActiveSomeSessions] = useState(0);

    // Dont't change the startingInHalfNight value 
    const todayDate = new Date(new Date().setHours(0, 0, 0, 0));
    const { trainerId } = useParams();



    const handleName = useCallback(function (value: string) {
        if (value?.match(regexSubscriptionName)) {
            onGetSubscriptionName({
                value: value,
                isTrue: true
            });
        } else {
            onGetSubscriptionName({
                value: value,
                isTrue: false
            });
        }
    }, [regexSubscriptionName]);

    const handleSession = useCallback(function (value: number) {
        if (value == 0) {
            onGetSessions({
                value: 0,
                isTrue: false
            });
        }
        else if (value < maxSessions) {
            onGetSessions({
                value: value,
                isTrue: true
            });
        }
        else if (value >= maxSessions) {
            onGetSessions({
                value: maxSessions,
                isTrue: true
            });
        }

        onGetActiveSomeSessions?.(0);
    }, [maxSessions]);

    const handlePrice = useCallback(function (value: number) {
        if (value == 0) {
            onGetPrice({
                value: 0,
                isTrue: false
            });
        }
        else if (value < maxSubscriptionPrice) {
            onGetPrice({
                value: value,
                isTrue: true
            });
        }
        else if (value >= maxSubscriptionPrice) {
            onGetPrice({
                value: maxSubscriptionPrice,
                isTrue: true
            });
        }

        onGetDebt(0);
    }, [maxSubscriptionPrice]);

    const handleDebt = useCallback(function (value: number) {
        if (value <= price) {
            onGetDebt(value);
        }
        else {
            onGetDebt(price);
        }
    }, [price]);

    const handleActiceSomeSessions = useCallback(function (value: number) {
        if (value > Number(maxForActiveSomeSessions)) {
            onGetActiveSomeSessions?.(maxForActiveSomeSessions);
        }
        else {
            onGetActiveSomeSessions?.(value);
        }
    }, [maxForActiveSomeSessions]);




    function makeAlertForActiveSomeSubscription() {
        if (!sessions) {
            setAlertForActiveSomeSubscription("قم بكتابة عدد الحصص");
        }
        else if (!subscriptionStart) {
            setAlertForActiveSomeSubscription("اختر تاريخ بداية الاشتراك");
        }
        else if (new Date(subscriptionStart).getTime() >= todayDate.getTime()) {
            setAlertForActiveSomeSubscription("تاريخ بداية الاشتراك غير مناسب لاستخدام ميزة تفعيل بعض الحصص");
            onGetActiveSomeSessions?.(0);
        }
        else if (!subscriptionEnd && new Date(subscriptionStart).getTime() < todayDate.getTime()) {
            setAlertForActiveSomeSubscription("قم بختيار تاريخ نهاية الاشتراك");
        }
        else if (new Date(subscriptionEnd as any).getTime() < todayDate.getTime() || new Date(subscriptionEnd as any).getTime() == todayDate.getTime()) {
            setAlertForActiveSomeSubscription("تاريخ نهاية الاشتراك غير مناسب لاستخدام ميزة تفعيل بعض الحصص");
            onGetActiveSomeSessions?.(0);
        }
        else {
            setAlertForActiveSomeSubscription(null);
        }
    }


    // This for active some sessions
    useEffect(() => {
        makeAlertForActiveSomeSubscription();

        if (!sessions || !subscriptionStart || !subscriptionEnd) {
            onGetActiveSomeSessions?.(0);
            return
        }


        const subscriptionStartDate = new Date(subscriptionStart as any);
        const subscriptionEndDate = new Date(subscriptionEnd as any);

        if (
            subscriptionStartDate.getTime() < todayDate.getTime() &&
            subscriptionEndDate.getTime() > todayDate.getTime()
        ) {
            const diff = Math.abs(differenceInDays(todayDate, subscriptionStart));
            const result = diff >= sessions ? sessions - 1 : diff

            setMaxForActiveSomeSessions(result);
        } else {
            setMaxForActiveSomeSessions(0);
        }
    }, [subscriptionStart, subscriptionEnd, sessions, todayDate]);




    return <div className={`
            mb-5 gap-3 grid
            ${!trainerId ? "grid-cols-5 " : "grid-cols-4"}
        `}
    >
        {/* Subscription info */}
        <div className="col-span-2 rounded-lg flex flex-col justify-between border border-slate-300 p-4">
            <Subscriptions_Menu
                onGetSubscriptionName={(value) => {
                    onGetSubscriptionName({
                        value: value,
                        isTrue: true
                    })
                }}
                onGetSesions={(value) => {
                    onGetSessions({
                        value: value,
                        isTrue: true
                    })
                }}
                onGetPrice={(value) => {
                    onGetPrice({
                        value: value,
                        isTrue: true
                    })
                }}
            />

            <div className="grid grid-cols-3 gap-2 mt-5">
                {/* Subscription name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold"> اسم الاشتراك </label>

                    <InputText
                        className="h-10 text-center!"
                        value={subscriptionName}
                        onChange={(e) => handleName(e.target.value)}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={11}
                            minLength={subscriptionName.length}
                            isGreenFlag={subscriptionName?.length >= 3 && subscriptionName?.length <= 11}
                        />
                    </small>
                </div>

                {/* Sessions count */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold"> عدد الحصص </label>

                    <InputText
                        type="number"
                        className="h-10 text-center!"
                        value={sessions == 0 ? "" : sessions as any}
                        onChange={(e) => handleSession(Number(e.target.value))}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <p className="font-bold">
                            الحد الاقصى : {maxSessions}
                        </p>
                    </small>
                </div>

                {/* Price */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold"> السعر </label>

                    <InputText
                        type="number"
                        className="h-10 text-center!"
                        value={price == 0 ? "" : price as any}
                        onChange={(e) => handlePrice(Number(e.target.value))}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <p className="font-bold">
                            الحد الاقصى : {maxSubscriptionPrice}
                        </p>
                    </small>
                </div>
            </div>
        </div>

        <div className={`
                border border-slate-300 p-4 rounded-lg flex flex-col justify-between
                ${trainerId ? "col-span-2" : ""}
            `}
        >
            {/* Title and discription*/}
            <div>
                <div className="flex items-center gap-1">
                    <ChartPie className="text-neutral-500 mt-1 font-bold" />

                    <h3 className="text-lg  font-bold">
                        المديونيه (اختياري)
                    </h3>
                </div>

                <p className="opacity-45 font-bold">
                    اكتب السعر الذي لم يتم سداده من الاشتراك
                </p>
            </div>

            {
                price == 0 ?
                    <p className="bg-red-500 font-bold border border-slate-300 p-2 py-3 rounded-lg focus:outline-0 w-full cursor-not-allowed text-center">
                        من فضلك, قم بكتابة سعر الاشتراك
                    </p>
                    :
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">
                            الحد الاقصى للمديونيه : {price}
                        </label>

                        <InputText
                            type="number"
                            className="text-center! w-full"
                            value={debt == 0 ? "" : debt as any}
                            onChange={(e) => handleDebt(Number(e.target.value))}
                        />
                    </div>
            }
        </div>

        {/* Active some sessions */}
        {
            !trainerId &&
            <div className="col-span-2 border border-slate-300 p-4 rounded-lg flex flex-col justify-between">
                {/* Title and discription*/}
                <div>
                    <div className="flex items-center gap-1">
                        <Shell className="text-neutral-500 mt-1" />

                        <h3 className="text-lg  font-bold">
                            تفعيل بعض الحصص (اختياري)
                        </h3>
                    </div>

                    <p className="opacity-45 font-bold">
                        تستطيع تفعيل بعض الحصص للاشتراك القديم الذي لم ينتهي بعد
                    </p>
                </div>

                {/* Active some session inp */}
                <div>
                    {
                        alertForActiveSomeSubscription == null ?
                            <div className="flex flex-col gap-2">
                                <label className="font-bold">
                                    عدد الحصص المتاحه للتفعيل : {maxForActiveSomeSessions}
                                </label>

                                <InputText
                                    type="number"
                                    className="text-center! w-full"
                                    value={activeSomeSessions == 0 ? "" : activeSomeSessions as any}
                                    onChange={(e) => handleActiceSomeSessions(Number(e.target.value))}
                                />
                            </div>
                            :
                            <p className="bg-red-500 font-bold border border-slate-300 p-2 py-3 rounded-lg focus:outline-0 w-full cursor-not-allowed text-center">
                                {alertForActiveSomeSubscription}
                            </p>
                    }
                </div>
            </div>
        }
    </div>
}