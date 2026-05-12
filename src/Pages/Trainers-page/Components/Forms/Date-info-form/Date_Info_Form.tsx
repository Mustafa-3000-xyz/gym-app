import { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Date_Info_Props } from "@/Pages/types";
import { stateIsFinished, styleDate } from "@/Lib/constants";
import { Calendar } from 'primereact/calendar';
import { useAtomValue } from "jotai";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
import { normalAlert, theTodayDate } from "@/Lib/functions";
// ========================================================== //
export default function Date_Info_Form(
    { onGetSubscriptionStart, onGetSubscriptionEnd }: Date_Info_Props
) {
    const trainerDetailsAtom = useAtomValue(trainerDetails_Atom);

    const [subscriptionStart, setSubscriptionStart] = useState<Date | null>(null);
    const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);

    const [theDaysBetweenSubStartAndSubEnd, setTheDaysBetweenSubStartAndSubEnd] = useState(0);
    const [minDateInSubscriptionEnd, setMinDateInSubscriptionEnd] = useState<Date | null>(null);

    const todayDate = theTodayDate({ startingIn12Houre: true });





    // This for set date start in subscription end
    useEffect(function () {
        if (!subscriptionStart) return;

        const date = new Date(subscriptionStart as any);

        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);

        setMinDateInSubscriptionEnd(date);
    }, [subscriptionStart]);

    /* 
        When show trainer info, i want see the subscriptionStart and subscriptionEnd
        if the subscriptionState is not stateIsFinished
    */
    useEffect(function () {
        if (trainerDetailsAtom && trainerDetailsAtom?.subscriptionState != stateIsFinished) {
            setSubscriptionStart(new Date(trainerDetailsAtom?.subscriptionStart as string));
            setSubscriptionEnd(new Date(trainerDetailsAtom?.subscriptionEnd as string));
        } else {
            setSubscriptionStart(null);
            setSubscriptionEnd(null);
        }
    }, [trainerDetailsAtom?.subscriptionState]);

    // This for get days between subscriptionStart and subscriptionEnd
    useEffect(function () {
        if (!subscriptionStart && !subscriptionEnd) return

        const startDate = format(subscriptionStart as Date, styleDate);
        const endDate = format(subscriptionEnd as Date, styleDate);
        const diff = differenceInDays(endDate, startDate);


        if (subscriptionStart && subscriptionEnd && diff > 0) {
            setTheDaysBetweenSubStartAndSubEnd(diff);
        } else {
            setTheDaysBetweenSubStartAndSubEnd(0);
            setSubscriptionEnd(null);
        }


        onGetSubscriptionStart(subscriptionStart as Date);
        onGetSubscriptionEnd(subscriptionEnd as Date);
    }, [subscriptionStart, subscriptionEnd]);

    useEffect(function () {
        if (!trainerDetailsAtom) return

        if (
            trainerDetailsAtom?.subscriptionState == stateIsFinished
            &&
            subscriptionStart
            &&
            todayDate.getTime() > new Date(subscriptionStart as any).getTime()
        ) {
            setSubscriptionStart(null);
            normalAlert({
                title: "تنويه",
                text: "في حالة تجديد الاشتراك , يجب ان تاريخ بداية الاشتراك يسبق تاريخ اليوم او يساويه",
                icon: "info"
            })
        }
    }, [trainerDetailsAtom?.subscriptionState, subscriptionStart])




    return <div className="flex justify-center items-center gap-7">
        {/* Start subscription */}
        <div dir="ltr" className="w-3/4 mt-2">
            <h4 className="font-bold mb-2 text-right">تاريخ بدا الاشتراك</h4>

            <Calendar
                showIcon
                showButtonBar
                readOnlyInput
                value={subscriptionStart}
                showOtherMonths={false}
                dateFormat="yy/mm/dd"
                className="w-full select-none"
                placeholder="اليوم / الشهر / السنه"
                clearButtonClassName="clear-btn-in-calendar"
                todayButtonClassName="today-btn-in-calendar"
                inputClassName="text-right input-date-in-calendar"
                onChange={(e) => setSubscriptionStart(e.value as Date)}
            />
        </div>

        {/* Days */}
        <div className="mt-8 flex gap-1">
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
            <h4 className="font-bold mb-2 text-right">تاريخ نهاية الاشتراك</h4>

            <Calendar
                showIcon
                readOnlyInput
                value={subscriptionEnd}
                minDate={minDateInSubscriptionEnd as any}
                showOtherMonths={false}
                disabled={subscriptionStart ? false : true}
                inputClassName="text-right input-date-in-calendar"
                dateFormat="yy/mm/dd"
                className={`w-full ${subscriptionStart ? "opacity-100" : "opacity-55"}`}
                placeholder={!subscriptionStart
                    ? "اختر تاريخ بداية الاشتراك اولا"
                    : "اليوم / الشهر / السنه"
                }
                onChange={(e) => setSubscriptionEnd(e.value as Date)}
            />
        </div>
    </div>
}