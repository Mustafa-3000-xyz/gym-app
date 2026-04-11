import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
import { Calendar } from 'primereact/calendar';
import { stateIsFinished } from "@/Lib/constants";
// ========================================================== //
export default function Start_Date_Picker(
    { getDate } : {getDate: (x: any)=> void}
) {
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);
    const trainer = useAtomValue(trainerDetails_Atom);

    const [selectDate, setSelectDate] = useState<Date | null>(null);


    // Check if the isShowTrainerDetailsAtom is true, so the manager he want see trainer details
    useEffect(function () {
        if (isShowTrainerDetailsAtom && trainer?.subscriptionState != stateIsFinished) {
            setSelectDate(new Date(trainer?.subscriptionStart as string));
        } else {
            setSelectDate(null);
        }
    }, [isShowTrainerDetailsAtom, trainer]);


    useEffect(function () {
        getDate(selectDate);
    }, [selectDate]);


    return <div
        dir="ltr"
        className="mt-2"
    >
        <h4 className="font-bold mb-2 text-right">تاريخ بدا الاشتراك</h4>

        <Calendar
            showIcon
            showButtonBar
            readOnlyInput
            value={selectDate}
            showOtherMonths={false}
            dateFormat="yy/mm/dd"
            className="w-full select-none"
            placeholder="اليوم / الشهر / السنه"
            clearButtonClassName="clear-btn-in-calendar"
            todayButtonClassName="today-btn-in-calendar"
            inputClassName="text-right input-date-in-calendar"
            onChange={(e) => setSelectDate(e.value as Date)}
        />
    </div>
}