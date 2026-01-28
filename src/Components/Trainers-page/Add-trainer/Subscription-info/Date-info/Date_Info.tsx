import { useEffect, useState } from "react";
import { Date_Picker } from "./Date-picker/Date_Picker";
import { format, parse, differenceInDays } from "date-fns";
// ========================================================== //
interface Date_Info_Props {
    setGetSubscriptionStart: (x: string) => void,
    setGetSubscriptionEnd: (x: string) => void,
}

export default function Date_Info(
    { setGetSubscriptionStart, setGetSubscriptionEnd}: Date_Info_Props
) {
    const [subscriptionStart, setSubscriptionStart] = useState("");
    const [subscriptionEnd, setSubscriptionEnd] = useState("");
    const [theDaysBetweenSubStartAndSubEnd, setTheDaysBetweenSubStartAndSubEnd] = useState(0);

    // This for get today date
    useEffect(function () {
        const date = new Date();
        const formatted = format(date, "yyyy/MM/dd");
        setSubscriptionStart(formatted);
    }, []);

    // This for get days between subscriptionStart and subscriptionEnd
    useEffect(function () {
        if (!subscriptionStart || !subscriptionEnd) return;
        const startDate = parse(subscriptionStart, "yyyy/MM/dd", new Date());
        const endDate = parse(subscriptionEnd, "yyyy/MM/dd", new Date());
        const diff = differenceInDays(endDate, startDate);

        setTheDaysBetweenSubStartAndSubEnd(diff);
        setGetSubscriptionStart(subscriptionStart);
        setGetSubscriptionEnd(subscriptionEnd);
    }, [subscriptionStart, subscriptionEnd]);


    return <div className="flex justify-center items-center gap-2 px-3" >
        {/* Start subscription */}
        <div className="w-3/4">
            <h4>تاريخ بدأ الاشتراك</h4>

            <p className="w-full bg-slate-100 border border-slate-200 p-2 rounded-lg opacity-70 cursor-not-allowed">
                {subscriptionStart}
            </p>
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

            <Date_Picker
                subscriptionStart={subscriptionStart}
                subscriptionEnd={subscriptionEnd}
                setSubscriptionEnd={setSubscriptionEnd}
            />
        </div>
    </div >
}