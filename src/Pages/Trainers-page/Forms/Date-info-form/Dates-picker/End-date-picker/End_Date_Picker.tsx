import * as React from "react"
import { Button } from "@/Components/Shadcn/button"
import { Calendar } from "@/Components/Shadcn/calendar"
import { Field } from "@/Components/Shadcn/field"
import { format } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/Shadcn/popover"
import { End_Date_Picker_Props } from "@/Pages/Trainers-page/trainersTypes";
import { styleDate } from "@/lib/customs";
import { useAtomValue } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/isShowTrainerDetails_Atom";
import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
// ========================================================== //
export function End_Date_Picker(
    { dateStart, getDate }: End_Date_Picker_Props
) {
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);
    const trainer = useAtomValue(trainerDetails_Atom);

    const [selectDate, setSelectDate] = React.useState<Date | null>(null);
    const [openMenu, setOpenMenu] = React.useState(false);


    React.useEffect(function () {
        if (isShowTrainerDetailsAtom) {
            setSelectDate(new Date(trainer?.subscriptionEnd as string));
        } else {
            setSelectDate(null);
        }
    }, [isShowTrainerDetailsAtom]);


    React.useEffect(function () {
        if (dateStart >= selectDate!) {
            setSelectDate(null);
            getDate(null);
        } else {
            getDate(selectDate);
        }
    }, [dateStart, selectDate]);



    return <Field className="w-full">
        <Popover
            open={!dateStart ? false : openMenu}
            onOpenChange={(open) => setOpenMenu(open)}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className={`
                        justify-start border-slate-200
                        ${!dateStart ? "opacity-60 cursor-not-allowed"
                            : "opacity-100  cursor-pointer"}
                    `}
                >
                    {
                        !dateStart ? "قم اولا بختيار تاريخ بداية الاشتراك"
                            : selectDate ? format(selectDate as Date, styleDate)
                                : "اليوم / الشهر / السنه"
                    }
                </Button>
            </PopoverTrigger>

            <PopoverContent className="overflow-hidden bg-slate-100" align="end">
                <Calendar
                    className="w-full"
                    mode="single"
                    captionLayout="dropdown"
                    selected={selectDate as Date}
                    disabled={(date) => date <= dateStart}
                    onSelect={(date) => {
                        setSelectDate(date as Date);
                        setOpenMenu(false);
                    }}
                    fromYear={2026}
                    toYear={2040}
                />
            </PopoverContent>
        </Popover>
    </Field>
}