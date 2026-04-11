import { useEffect, useState } from "react";
import { End_Date_Picker } from "./Dates-picker/End_Date_Picker";
import { format, differenceInDays } from "date-fns";
import { Date_Info_Props } from "@/Pages/types";
import { styleDate } from "@/Lib/constants";
import Start_Date_Picker from "./Dates-picker/Start_Date_Picker";
// ========================================================== //
export default function Date_Info_Form(
    { onGetSubscriptionStart, onGetSubscriptionEnd }: Date_Info_Props
) {
    const [subscriptionStart, setSubscriptionStart] = useState<Date | null>(null);
    const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
    const [theDaysBetweenSubStartAndSubEnd, setTheDaysBetweenSubStartAndSubEnd] = useState(0);



    // This for get days between subscriptionStart and subscriptionEnd
    useEffect(function () {
        const startDate = format(subscriptionStart as Date, styleDate);
        const endDate = format(subscriptionEnd as Date, styleDate);
        const diff = differenceInDays(endDate, startDate);

        if (subscriptionStart && subscriptionEnd) {
            setTheDaysBetweenSubStartAndSubEnd(diff);
        } else {
            setTheDaysBetweenSubStartAndSubEnd(0);
        }

        onGetSubscriptionStart(subscriptionStart as Date);
        onGetSubscriptionEnd(subscriptionEnd as Date);
    }, [subscriptionStart, subscriptionEnd]);



    return <form className="flex justify-center items-center gap-2">
        {/* Start subscription */}
        <div className="w-3/4">
            <Start_Date_Picker
                getDate={(date) => setSubscriptionStart(date as Date)}
            />
        </div>

        {/* Days */}
        <div className="mt-5 px-3 flex gap-1">
            <span className=" leading-7">
                {
                    theDaysBetweenSubStartAndSubEnd > 0 ?
                        theDaysBetweenSubStartAndSubEnd : 0
                }
            </span>

            <span>
                يوم
            </span>
        </div>

        {/* End subscription */}
        <div className="w-3/4">
            <End_Date_Picker
                dateStart={subscriptionStart as Date}
                getDate={(date) => setSubscriptionEnd(date as Date)}
            />
        </div>
    </form>
}