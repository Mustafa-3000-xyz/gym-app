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
// ========================================================== //
export function End_Date_Picker(
    { subscriptionStart, getDate }: End_Date_Picker_Props
) {
    const [selectDate, setSelectDate] = React.useState<Date | null>(null);
    const [formatDate, setFormatDate] = React.useState<string | null>(null);
    const [openMenu, setOpenMenu] = React.useState(false);



    // When the date end small than date start, so return the selectDate and formatDate to default value
    React.useEffect(function () {
        if (!selectDate) return;

        if (subscriptionStart >= selectDate) {
            setSelectDate(null);
            setFormatDate(null);
            getDate(null);
        } else {
            const result = format(selectDate, styleDate);

            setFormatDate(result);
            getDate(selectDate);
        }
    }, [subscriptionStart, selectDate]);


    return <Field className="w-full">
        <Popover
            open={!subscriptionStart ? false : openMenu}
            onOpenChange={(open) => setOpenMenu(open)}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id="date"
                    className={`
                        justify-start border-slate-200
                        ${!subscriptionStart ? "opacity-60 cursor-not-allowed"
                            : "opacity-100  cursor-pointer"}
                    `}
                >
                    {
                        !subscriptionStart ?
                            "قم اولا بختيار تاريخ بداية الاشتراك"
                            :
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
                    disabled={(date) => date <= subscriptionStart}
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