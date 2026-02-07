import { useEffect, useState } from "react";
import { End_Date_Picker } from "./Dates-picker/End-date-picker/End_Date_Picker";
import { format, differenceInDays } from "date-fns";
import { Date_Info_Props } from "@/Pages/Trainers-page/trainersTypes";
import { styleDate } from "@/lib/customs";
import Start_Date_Picker from "./Dates-picker/Start-date-picker/Start_Date_Picker";
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


        onGetSubscriptionStart(subscriptionStart as Date);
        onGetSubscriptionEnd(subscriptionEnd as Date);
        setTheDaysBetweenSubStartAndSubEnd(diff);
    }, [subscriptionStart, subscriptionEnd]);


    return <form className="flex justify-center items-center gap-2 px-3" >
        {/* Start subscription */}
        <div className="w-3/4">
            <h4>تاريخ بدأ الاشتراك</h4>

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
            <h4>تاريخ نهاية الاشتراك</h4>

            <End_Date_Picker
                dateStart={subscriptionStart as Date}
                getDate={(date) => setSubscriptionEnd(date as Date)}
            />
        </div>
    </form>
}