import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { statusIsFinished } from "@/Lib/constants";
import { Calendar } from 'primereact/calendar';
import { normalAlert } from "@/Lib/functions";
import { Date_Info_Form_Props } from "@/Pages/typesProps";
import { useParams } from "react-router-dom";
// ========================================================== //
export default function Date_Info_Form(
    {
        SubscriptionStart,
        SubscriptionEnd,
        sessions,
        subscriptionStatus,
        onGetSubscriptionStart,
        onGetSubscriptionEnd
    }: Date_Info_Form_Props
) {
    const [subscriptionStartInp, setSubscriptionStartInp] = useState<string | null>(null);
    const [subscriptionEndInp, setSubscriptionEndInp] = useState<string | null>(null);
    const [minDateInSubscriptionEnd, setMinDateInSubscriptionEnd] = useState<Date | null>(null);
    const [theDaysBetweenSubStartAndSubEnd, setTheDaysBetweenSubStartAndSubEnd] = useState(0);

    const { trainerId } = useParams();



    function DaysBetweenTheStartAndEnd() {
        if (!subscriptionStartInp || !subscriptionEndInp) {
            setTheDaysBetweenSubStartAndSubEnd(0);
            return;
        }


        const startDate = new Date(subscriptionStartInp);
        const endDate = new Date(subscriptionEndInp);
        const diff = differenceInDays(endDate, startDate);


        if (diff > 0) {
            setTheDaysBetweenSubStartAndSubEnd(diff);
        }
        else {
            setTheDaysBetweenSubStartAndSubEnd(0);
        }
    }



    useEffect(function () {
        if (trainerId && subscriptionStatus != statusIsFinished) {
            setSubscriptionStartInp(SubscriptionStart as any);
            setSubscriptionEndInp(SubscriptionEnd as any);
        } else {
            setSubscriptionStartInp(null);
            setSubscriptionEndInp(null);
        }
    }, [trainerId]);

    // This for set subscription end start
    useEffect(function () {
        if (!subscriptionStartInp) return;

        const date = new Date(subscriptionStartInp as any);

        date.setDate(date.getDate() + 1);
        setMinDateInSubscriptionEnd(date);
    }, [subscriptionStartInp]);

    // Send data and run DaysBetweenTheStartAndEnd
    useEffect(function () {
        if (!subscriptionStartInp) {
            onGetSubscriptionStart(null);
        } else {
            onGetSubscriptionStart(new Date(subscriptionStartInp as any).toISOString());
        }

        if (!subscriptionEndInp) {
            onGetSubscriptionEnd(null);
        } else {
            onGetSubscriptionEnd(new Date(subscriptionEndInp as any).toISOString());
        }


        DaysBetweenTheStartAndEnd();
    }, [subscriptionStartInp, subscriptionEndInp])

    useEffect(function () {
        if (
            theDaysBetweenSubStartAndSubEnd != 0
            &&
            theDaysBetweenSubStartAndSubEnd < (sessions as any)
        ) {
            setSubscriptionEndInp(null);
            normalAlert({
                title: "تنويه",
                text: " الايام التي بين تاريخ بداية ونهاية الاشتراك, تكون اكبر من او تساوي عدد الحصص",
                icon: "info"
            });
        }
    }, [theDaysBetweenSubStartAndSubEnd, sessions]);





    return <div className="flex justify-center items-end-safe gap-5 mt-10 border border-slate-300 p-4 rounded-lg">
        {/* Start subscription */}
        <div dir="ltr" className="w-3/4">
            <h4 className="mb-2 flex justify-end gap-2">
                <span className={`${subscriptionStartInp ? "text-emerald-500" : "text-red-500"}`}>
                    ({subscriptionStartInp ? "تم اختيار التاريخ" : "لم يتم اختيار التاريخ"})
                </span>

                <span>
                    تاريخ بداية الاشتراك
                </span>
            </h4>

            <Calendar
                showIcon
                showButtonBar
                readOnlyInput
                value={subscriptionStartInp ? new Date(subscriptionStartInp as any) : null}
                showOtherMonths={false}
                dateFormat="yy/mm/dd"
                className="w-full select-none"
                placeholder="اليوم / الشهر / السنه"
                clearButtonClassName="clear-btn-in-calendar"
                todayButtonClassName="today-btn-in-calendar"
                inputClassName="text-right input-date-in-calendar font-bold!"
                onChange={(e) => setSubscriptionStartInp(e.value?.toDateString() as string)}
            />
        </div>

        {/* Days */}
        <div className="flex gap-1 mb-3.5">
            <span className="leading-7">
                {
                    theDaysBetweenSubStartAndSubEnd ?? 0
                }
            </span>

            <span>
                يوم
            </span>
        </div>

        {/* End subscription */}
        <div dir="ltr" className="w-3/4">
            <h4 className="mb-2 text-right flex justify-end gap-2">
                <span className={`${subscriptionEndInp ? "text-emerald-500" : "text-red-500"}`}>
                    ({subscriptionEndInp ? "تم اختيار التاريخ" : "لم يتم اختيار التاريخ"})
                </span>

                <span>
                    تاريخ نهاية الاشتراك
                </span>
            </h4>

            <Calendar
                showIcon
                readOnlyInput
                value={subscriptionEndInp ? new Date(subscriptionEndInp as any) : null}
                minDate={minDateInSubscriptionEnd as any}
                showOtherMonths={false}
                disabled={subscriptionStartInp ? false : true}
                inputClassName="text-right input-date-in-calendar opacity-100! font-bold!"
                dateFormat="yy/mm/dd"
                className="w-full"
                placeholder={!subscriptionStartInp
                    ? "اختر تاريخ بداية الاشتراك اولا"
                    : "اليوم / الشهر / السنه"
                }
                onChange={(e) => setSubscriptionEndInp(e.value?.toISOString() as string)}
            />
        </div>
    </div>
}