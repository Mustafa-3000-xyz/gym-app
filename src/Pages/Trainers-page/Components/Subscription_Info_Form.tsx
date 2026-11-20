import Subscriptions_Menu from "@/Pages/Trainers-page/Components/Subscriptions_Menus";
import { useEffect, useState } from "react";
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
        onGetSubscriptionName,
        onGetPrice,
        onGetSessions,
        onGetActiveSomeSessions,
        onGetDebt
    }: Subscription_Info_Form_Props
) {
    const [alertForActiveSomeSubscription, setAlertForActiveSomeSubscription] = useState<string | null>("");
    const [maxForActiveSomeSessions, setMaxForActiveSomeSessions] = useState(0);
    const [activeSomeSessionsInp, setActiveSomeSessionsInp] = useState(0);

    const [subscriptionNameInp, setSubscriptionNameInp] = useState<string>("");
    const [sessionsInp, setSessionsInp] = useState<number>(0);
    const [priceInp, setPriceInp] = useState<number>(0);

    const [debtInp, setDebtInp] = useState<number>(0);

    // Dont't change the startingInHalfNight value 
    const todayDate = new Date(new Date().setHours(0,0,0,0));
    const { trainerId } = useParams();



    function makeAlertForActiveSomeSubscription() {
        if (!sessionsInp) {
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




    useEffect(() => {
        // When read trainer details, i want show his values
        if (trainerId) {
            setSubscriptionNameInp(subscriptionName as string);
            setSessionsInp(sessions as number);
            setPriceInp(price ?? 0);
            setDebtInp(debt as number);
        }
        else {
            setSubscriptionNameInp("");
            setSessionsInp(0);
            setPriceInp(0);
            setDebtInp(0);
        }
    }, [trainerId]);

    useEffect(function () {
        if (activeSomeSessionsInp == 0) {
            onGetActiveSomeSessions?.(0);
        } else {
            onGetActiveSomeSessions?.(activeSomeSessionsInp);
        }
    }, [activeSomeSessionsInp]);

    // send values
    useEffect(function () {
        if (subscriptionNameInp?.match(regexSubscriptionName)) {
            onGetSubscriptionName({
                value: subscriptionNameInp,
                isTrue: true
            });
        } else {
            onGetSubscriptionName({
                value: subscriptionNameInp,
                isTrue: false
            });
        }

        if (sessionsInp > 0) {
            onGetSessions({
                value: sessionsInp,
                isTrue: true
            });
        } else {
            onGetSessions({
                value: sessionsInp,
                isTrue: false
            });
        }

        if (priceInp > 0) {
            onGetPrice({
                value: priceInp,
                isTrue: true
            });
        } else {
            onGetPrice({
                value: priceInp,
                isTrue: false
            });
        }


        onGetDebt(debtInp);
    }, [subscriptionNameInp, sessionsInp, priceInp, debtInp]);

    // This for active some sessions
    useEffect(() => {
        const subscriptionStartDate = new Date(subscriptionStart as any);
        const subscriptionEndDate = new Date(subscriptionEnd as any);

        if (
            sessionsInp && subscriptionStart && subscriptionEnd &&
            subscriptionStartDate.getTime() < todayDate.getTime() &&
            subscriptionEndDate.getTime() > todayDate.getTime()
        ) {
            const diff = Math.abs(differenceInDays(todayDate, subscriptionStart));
            const result = diff >= sessionsInp ? sessionsInp - 1 : diff

            setMaxForActiveSomeSessions(result);
        } else {
            setMaxForActiveSomeSessions(0);
        }

        setActiveSomeSessionsInp(0);
        onGetActiveSomeSessions?.(0);
        makeAlertForActiveSomeSubscription();
    }, [subscriptionStart, subscriptionEnd, sessionsInp, todayDate]);




    return <div className={`
            mb-5 gap-3 grid
            ${!trainerId ? "grid-cols-5 " : "grid-cols-4"}
        `}
    >
        {/* Subscription info */}
        <div className="col-span-2 rounded-lg flex flex-col justify-between border border-slate-300 p-4">
            <Subscriptions_Menu
                onGetSubscriptionName={setSubscriptionNameInp}
                onGetSesions={setSessionsInp}
                onGetPrice={setPriceInp}
            />

            <div className="grid grid-cols-3 gap-2 mt-5">
                {/* Subscription name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold"> اسم الاشتراك </label>

                    <InputText
                        className="h-10 text-center!"
                        value={subscriptionNameInp}
                        onChange={(e) => setSubscriptionNameInp(e.target.value)}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={11}
                            minLength={subscriptionNameInp.length}
                            isGreenFlag={subscriptionNameInp?.length >= 3 && subscriptionNameInp?.length <= 11}
                        />
                    </small>
                </div>

                {/* Sessions count */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold"> عدد الحصص </label>

                    <InputText
                        type="number"
                        className="h-10 text-center!"
                        value={sessionsInp == 0 ? "" : sessionsInp as any}
                        onChange={(e) => {
                            if (Number(e.target.value) < maxSessions) {
                                setSessionsInp(Number(e.target.value));
                            }
                            else if (Number(e.target.value) >= maxSessions) {
                                setSessionsInp(Number(maxSessions));
                            }
                        }}
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
                        value={priceInp == 0 ? "" : priceInp as any}
                        onChange={(e) => {
                            if (Number(e.target.value) < maxSubscriptionPrice) {
                                setPriceInp(Number(e.target.value));
                            }
                            else if (Number(e.target.value) >= maxSubscriptionPrice) {
                                setPriceInp(maxSubscriptionPrice);
                            }

                            setDebtInp(0);
                        }}
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
                    اكتب السعر المتبقي من سعر الاشتراك
                </p>
            </div>

            {
                priceInp == 0 ?
                    <p className="bg-red-500 font-bold border border-slate-300 p-2 py-3 rounded-lg focus:outline-0 w-full cursor-not-allowed text-center">
                        من فضلك, قم بكتابة سعر الاشتراك
                    </p>
                    :
                    <div className="flex flex-col gap-2">
                        <label className="font-bold">
                            الحد الاقصى للمديونيه : {priceInp}
                        </label>

                        <InputText
                            type="number"
                            className="text-center! w-full"
                            value={debtInp == 0 ? "" : debtInp as any}
                            onChange={(e) => {
                                if (Number(e.target.value) > priceInp) {
                                    setDebtInp(priceInp);
                                }
                                else {
                                    setDebtInp(Number(e.target.value));
                                }
                            }}
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
                                    value={activeSomeSessionsInp == 0 ? "" : activeSomeSessionsInp as any}
                                    onChange={(e) => {
                                        if (Number(e.target.value) > Number(maxForActiveSomeSessions)) {
                                            setActiveSomeSessionsInp(maxForActiveSomeSessions);
                                        }
                                        else {
                                            setActiveSomeSessionsInp(Number(e.target.value));
                                        }
                                    }}
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