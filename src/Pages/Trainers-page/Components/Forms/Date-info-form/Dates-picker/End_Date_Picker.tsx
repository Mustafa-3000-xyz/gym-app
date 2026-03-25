import * as React from "react"
import { End_Date_Picker_Props } from "@/Pages/Trainers-page/types";
import { useAtomValue } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
import { Calendar } from 'primereact/calendar';
import { stateIsFinished } from "@/Lib/customs";
// ========================================================== //
export function End_Date_Picker(
    { dateStart, getDate }: End_Date_Picker_Props
) {
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);
    const trainer = useAtomValue(trainerDetails_Atom);

    const [selectDate, setSelectDate] = React.useState<Date | null>(null);


    React.useEffect(function () {
        if (isShowTrainerDetailsAtom && trainer?.subscriptionState != stateIsFinished) {
            setSelectDate(new Date(trainer?.subscriptionEnd as string));
        } else {
            setSelectDate(null);
        }
    }, [isShowTrainerDetailsAtom, trainer]);



    React.useEffect(function () {
        if (dateStart >= selectDate! && selectDate != null) {
            setSelectDate(null);
        }

        getDate(selectDate);
    }, [dateStart, selectDate]);


    const minEndDate = React.useMemo(() => {
        if (!dateStart) return;

        const d = new Date(dateStart);
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [dateStart]);



    return <div
        dir="ltr"
        className="mt-2"
    >
        <h4 className="font-bold mb-2 text-right">تاريخ نهاية الاشتراك</h4>

        <Calendar
            showIcon
            readOnlyInput
            value={selectDate}
            minDate={minEndDate}
            showOtherMonths={false}
            disabled={dateStart ? false : true}
            inputClassName="text-right input-date-in-calendar"
            dateFormat="yy/mm/dd"
            className={`w-full ${dateStart ? "opacity-100" : "opacity-55"}`}
            placeholder={!dateStart
                ? "اختر تاريخ بداية الاشتراك اولا"
                : "اليوم / الشهر / السنه"
            }
            onChange={(e) => setSelectDate(e.value as Date)}
        />
    </div>
}