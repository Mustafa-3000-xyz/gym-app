import { Button } from "@/Components/Shadcn/button"
import { Calendar } from "@/Components/Shadcn/calendar"
import { Field } from "@/Components/Shadcn/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/Shadcn/popover";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { styleDate } from "@/lib/customs";
// ========================================================== //
export default function Start_Date_Picker(
    {getDate}: {getDate: (x: Date) => void}
) {
    const [selectDate, setSelectDate] = useState<Date | null>(null);
    const [formatDate, setFormatDate] = useState<string | null>(null);
    const [openMenu, setOpenMenu] = useState(false);
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);


    useEffect(function () {
        if (!selectDate) return;
        const result = format(selectDate, styleDate);

        getDate(selectDate as Date);
        setFormatDate(result);
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
                        formatDate ? formatDate : "اليوم / الشهر / السنه"
                    }
                </Button>
            </PopoverTrigger>

            <PopoverContent className="overflow-hidden bg-slate-100" align="end">
                <Calendar
                    className="w-full"
                    mode="single"
                    captionLayout="dropdown"
                    selected={selectDate as Date}
                    disabled={(date) => date < dateNow}
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
