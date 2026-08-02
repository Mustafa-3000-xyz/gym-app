import { useEffect, useMemo, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { statusIsFinished, styleDate } from "@/Lib/constants";
import { Calendar } from 'primereact/calendar';
import { normalAlert, theTodayDate } from "@/Lib/functions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { addSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { addSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
// ========================================================== //
export default function Date_Info_Form() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            trainerDetails: state.trainerDetails,
            sessionsCount: state.sessionsCount,
            subscriptionStart: state.subscriptionStart,
            subscriptionEnd: state.subscriptionEnd,
        }
    }, shallowEqual);

    const [theDaysBetweenSubStartAndSubEnd, setTheDaysBetweenSubStartAndSubEnd] = useState(0);
    const [minDateInSubscriptionEnd, setMinDateInSubscriptionEnd] = useState<Date | null>(null);
    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);




    function renewalSubscription() {
        if (!state.trainerDetails) return;

        if (
            state.trainerDetails?.subscriptionStatus == statusIsFinished
            &&
            state.subscriptionStart
            &&
            todayDate.getTime() > new Date(state.subscriptionStart as any).getTime()
        ) {
            dispatch(addSubscriptionStart(null));
            normalAlert({
                title: "تنويه",
                text: "في حالة تجديد الاشتراك , يجب ان تاريخ بداية الاشتراك يسبق تاريخ اليوم او يساويه",
                icon: "info"
            })
        }
    }

    function firstDateForSubscriptionEnd() {
        if (!state.subscriptionStart) return;

        const date = new Date(state.subscriptionStart as any);

        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);

        setMinDateInSubscriptionEnd(date);
    }

    function getDaysBetweenSubscriptionStartAndSubscriptionDate() {
        if (!state.subscriptionStart && !state.subscriptionEnd) {
            setTheDaysBetweenSubStartAndSubEnd(0);
            return;
        }

        const startDate = format(state.subscriptionStart as string, styleDate);
        const endDate = format(state.subscriptionEnd as string, styleDate);
        const diff = differenceInDays(endDate, startDate) + 1;


        if (diff > 0) {
            setTheDaysBetweenSubStartAndSubEnd(diff);
        } else {
            setTheDaysBetweenSubStartAndSubEnd(0);
            dispatch(addSubscriptionEnd(null));
        }
    }




    useEffect(function () {
        /* 
            When show trainer info, i want see the subscriptionStart and subscriptionEnd
            if the subscriptionStatus is not statusIsFinished
        */
        if (state.trainerDetails && state.trainerDetails?.subscriptionStatus != statusIsFinished) {
            dispatch(addSubscriptionStart(new Date(state.trainerDetails?.subscriptionStart as string).toISOString()));
            dispatch(addSubscriptionEnd(new Date(state.trainerDetails?.subscriptionEnd as string).toISOString()));
        } else {
            dispatch(addSubscriptionStart(null));
            dispatch(addSubscriptionEnd(null));
        }
    }, [state.trainerDetails]);

    useEffect(function () {
        // If the user select subscriptionEnd in first, so we must block this action :)
        if (state.subscriptionEnd && state.sessionsCount == 0) {
            dispatch(addSubscriptionEnd(null));
            normalAlert({
                title: "تنويه",
                text: "قم بكتابة عدد الحصص اولا",
                icon: "info"
            });
            return;
        }


        if (
            theDaysBetweenSubStartAndSubEnd != 0
            &&
            theDaysBetweenSubStartAndSubEnd < (state.sessionsCount as any)
        ) {
            dispatch(addSubscriptionEnd(null));
            normalAlert({
                title: "تنويه",
                text: "يجب ان الايام التي تبدأ من تاريخ بداية الاشتراك الى تاريخ نهاية الاشتراك تكون اكبر من او تساوي عدد الحصص",
                icon: "info"
            });
        }
    }, [theDaysBetweenSubStartAndSubEnd, state.sessionsCount]);

    useEffect(function () {
        renewalSubscription();
        firstDateForSubscriptionEnd();
        getDaysBetweenSubscriptionStartAndSubscriptionDate();
    }, [state.subscriptionStart, state.subscriptionEnd, state.trainerDetails?.subscriptionStatus]);



    return <div className="flex justify-center items-end-safe gap-5 mt-10">
        {/* Start subscription */}
        <div dir="ltr" className="w-3/4">
            <h4 className="mb-2 flex justify-end gap-2">
                <span className={`${state.subscriptionStart ? "text-emerald-500" : "text-red-500"}`}>
                    ({state.subscriptionStart ? "تم اختيار التاريخ" : "لم يتم اختيار التاريخ"})
                </span>

                <span>
                    تاريخ بداية الاشتراك
                </span>
            </h4>

            <Calendar
                showIcon
                showButtonBar
                readOnlyInput
                value={state.subscriptionStart ? new Date(state.subscriptionStart as any) : null}
                showOtherMonths={false}
                dateFormat="yy/mm/dd"
                className="w-full select-none"
                placeholder="اليوم / الشهر / السنه"
                clearButtonClassName="clear-btn-in-calendar"
                todayButtonClassName="today-btn-in-calendar"
                inputClassName="text-right input-date-in-calendar font-bold!"
                onChange={(e) => dispatch(addSubscriptionStart(new Date(e.value as Date).toISOString()))}
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
                <span className={`${state.subscriptionEnd ? "text-emerald-500" : "text-red-500"}`}>
                    ({state.subscriptionStart ? "تم اختيار التاريخ" : "لم يتم اختيار التاريخ"})
                </span>

                <span>
                    تاريخ نهاية الاشتراك
                </span>
            </h4>

            <Calendar
                showIcon
                readOnlyInput
                value={state.subscriptionEnd ? new Date(state.subscriptionEnd as any) : null}
                minDate={minDateInSubscriptionEnd as any}
                showOtherMonths={false}
                disabled={state.subscriptionStart ? false : true}
                inputClassName="text-right input-date-in-calendar opacity-100! font-bold!"
                dateFormat="yy/mm/dd"
                className="w-full"
                placeholder={!state.subscriptionStart
                    ? "اختر تاريخ بداية الاشتراك اولا"
                    : "اليوم / الشهر / السنه"
                }
                onChange={(e) => dispatch(addSubscriptionEnd(new Date(e.value as Date).toISOString()))}
            />
        </div>
    </div>
}