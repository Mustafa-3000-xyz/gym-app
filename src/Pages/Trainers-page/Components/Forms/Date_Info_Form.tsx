import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { statusIsFinished } from "@/Lib/constants";
import { Calendar } from 'primereact/calendar';
import { normalAlert } from "@/Lib/functions";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { Date_Info_Form_Props } from "@/Pages/typesProps";
// ========================================================== //
export default function Date_Info_Form(
    {
        sessions,
        onGetSubscriptionStart,
        onGetSubscriptionEnd
    }: Date_Info_Form_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            isShowTrainerDetails: state.trainerDetails?.id ? true : false,
            subscriptionStatus: state.trainerDetails?.subscriptionStatus,
            subscriptionStart: state.trainerDetails?.subscriptionStart,
            subscriptionEnd: state.trainerDetails?.subscriptionEnd,
        }
    }, shallowEqual);


    const [subscriptionStart, setSubscriptionStart] = useState<string | null>(null);
    const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
    const [theDaysBetweenSubStartAndSubEnd, setTheDaysBetweenSubStartAndSubEnd] = useState(0);
    const [minDateInSubscriptionEnd, setMinDateInSubscriptionEnd] = useState<Date | null>(null);



    function getDaysBetweenSubscriptionStartAndSubscriptionDate() {
        if (!subscriptionStart || !subscriptionEnd || !sessions) {
            setTheDaysBetweenSubStartAndSubEnd(0);
            return;
        }

        const startDate = new Date(subscriptionStart);
        const endDate = new Date(subscriptionEnd);

        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            setTheDaysBetweenSubStartAndSubEnd(0);
            return;
        }

        const diff = differenceInDays(endDate, startDate);


        if (diff > 0) {
            setTheDaysBetweenSubStartAndSubEnd(diff);
        } else {
            setTheDaysBetweenSubStartAndSubEnd(0);
            setSubscriptionEnd(null)
        }
    }




    /* 
        When show trainer info, i want see the subscriptionStart and subscriptionEnd
        if the subscriptionStatus is not statusIsFinished
    */
    useEffect(function () {
        if (state.isShowTrainerDetails && state.subscriptionStatus != statusIsFinished) {
            setSubscriptionStart(state.subscriptionStart as any);
            setSubscriptionEnd(state.subscriptionEnd as any);
        } else {
            setSubscriptionStart(null);
            setSubscriptionEnd(null);
        }
    }, [state.isShowTrainerDetails]);

    // This for set subscription end start
    useEffect(function () {
        if (!subscriptionStart) return;

        const date = new Date(subscriptionStart as any);

        date.setDate(date.getDate() + 1);
        setMinDateInSubscriptionEnd(date);
    }, [subscriptionStart]);

    // // Send data
    useEffect(function () {
        if (!subscriptionStart) {
            onGetSubscriptionStart(null);
        } else {
            onGetSubscriptionStart(new Date(subscriptionStart as any).toISOString());
        }

        if (!subscriptionEnd) {
            onGetSubscriptionEnd(null);
        } else {
            onGetSubscriptionEnd(new Date(subscriptionEnd as any).toISOString());
        }
    }, [subscriptionStart, subscriptionEnd])

    useEffect(function () {
        if (
            theDaysBetweenSubStartAndSubEnd != 0
            &&
            theDaysBetweenSubStartAndSubEnd < (sessions as any)
        ) {
            setSubscriptionEnd(null);
            normalAlert({
                title: "تنويه",
                text: "يجب ان الايام التي تبدأ من تاريخ بداية الاشتراك الى تاريخ نهاية الاشتراك تكون اكبر من او تساوي عدد الحصص",
                icon: "info"
            });
        }
    }, [theDaysBetweenSubStartAndSubEnd, sessions]);

    useEffect(function () {
        getDaysBetweenSubscriptionStartAndSubscriptionDate();
    }, [subscriptionStart, subscriptionEnd, sessions, state.subscriptionStatus]);





    return <div className="flex justify-center items-end-safe gap-5 mt-10 border border-slate-300 p-4 rounded-lg">
        {/* Start subscription */}
        <div dir="ltr" className="w-3/4">
            <h4 className="mb-2 flex justify-end gap-2">
                <span className={`${subscriptionStart ? "text-emerald-500" : "text-red-500"}`}>
                    ({subscriptionStart ? "تم اختيار التاريخ" : "لم يتم اختيار التاريخ"})
                </span>

                <span>
                    تاريخ بداية الاشتراك
                </span>
            </h4>

            <Calendar
                showIcon
                showButtonBar
                readOnlyInput
                value={subscriptionStart ? new Date(subscriptionStart as any) : null}
                showOtherMonths={false}
                dateFormat="yy/mm/dd"
                className="w-full select-none"
                placeholder="اليوم / الشهر / السنه"
                clearButtonClassName="clear-btn-in-calendar"
                todayButtonClassName="today-btn-in-calendar"
                inputClassName="text-right input-date-in-calendar font-bold!"
                onChange={(e) => setSubscriptionStart(e.value?.toDateString() as string)}
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
                <span className={`${subscriptionEnd ? "text-emerald-500" : "text-red-500"}`}>
                    ({subscriptionEnd ? "تم اختيار التاريخ" : "لم يتم اختيار التاريخ"})
                </span>

                <span>
                    تاريخ نهاية الاشتراك
                </span>
            </h4>

            <Calendar
                showIcon
                readOnlyInput
                value={subscriptionEnd ? new Date(subscriptionEnd as any) : null}
                minDate={minDateInSubscriptionEnd as any}
                showOtherMonths={false}
                disabled={subscriptionStart ? false : true}
                inputClassName="text-right input-date-in-calendar opacity-100! font-bold!"
                dateFormat="yy/mm/dd"
                className="w-full"
                placeholder={!subscriptionStart
                    ? "اختر تاريخ بداية الاشتراك اولا"
                    : "اليوم / الشهر / السنه"
                }
                onChange={(e) => setSubscriptionEnd(e.value?.toISOString() as string)}
            />
        </div>
    </div>
}