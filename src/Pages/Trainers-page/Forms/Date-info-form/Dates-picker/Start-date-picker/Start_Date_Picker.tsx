import { Button } from "@/Components/Shadcn/button"
import { Calendar } from "@/Components/Shadcn/calendar"
import { Field } from "@/Components/Shadcn/field"
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { styleDate } from "@/lib/customs";
import { Start_Date_Picker_Props } from "@/Pages/Trainers-page/trainersTypes";
import { useAtomValue } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/isShowTrainerDetails_Atom";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/Shadcn/popover";
import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
// ========================================================== //
export default function Start_Date_Picker(
    { getDate }: Start_Date_Picker_Props
) {
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);
    const trainer = useAtomValue(trainerDetails_Atom);

    const [selectDate, setSelectDate] = useState<Date | null>(null);
    const [openMenu, setOpenMenu] = useState(false);
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);

    // Check if the isShowTrainerDetailsAtom is true, so the manager he want see trainer details
    useEffect(function () {
        if (isShowTrainerDetailsAtom) {
            setSelectDate(new Date(trainer?.subscriptionStart as string));
        } else {
            setSelectDate(null);
        }
    }, [isShowTrainerDetailsAtom]);


    useEffect(function () {
        getDate(selectDate);
    }, [selectDate]);

    return <Field className="w-full">
        <Popover open={openMenu} onOpenChange={(open) => setOpenMenu(open)}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className="justify-start cursor-pointer border-slate-200"
                >
                    {
                        isShowTrainerDetailsAtom ? format(selectDate as Date, styleDate)
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
                    disabled={(date) => date < dateNow}
                    selected={selectDate as Date}
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