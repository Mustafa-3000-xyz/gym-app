import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import { format, parse } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Date_Picker_Props } from "@/Pages/Trainers-page/trainersTypes";
// ========================================================== //
export function Date_Picker(
    {
        subscriptionStart,
        subscriptionEnd,
        setSubscriptionEnd
    }: Date_Picker_Props
) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const beforeDates = parse(subscriptionStart, "yyyy/MM/dd", new Date());

    React.useEffect(function () {
        if (!date) return;

        const theDate = format(date, "yyyy/MM/dd");
        setSubscriptionEnd(theDate);
    }, [date]);


    return (
        <Field className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="justify-start font-normal cursor-pointer border-slate-200"
                    >
                        {subscriptionEnd ? subscriptionEnd : "اليوم / الشهر / السنه"}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="overflow-hidden bg-slate-100" align="end">
                    <Calendar
                        className="w-full"
                        mode="single"
                        captionLayout="dropdown"
                        selected={date}
                        defaultMonth={date}
                        disabled={(day) => day <= beforeDates}
                        fromYear={2026}
                        toYear={2040}
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}