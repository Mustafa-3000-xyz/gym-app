import { stateIsActive } from "@/Lib/customs";
import { trainer } from "@/Pages/Trainers-page/types";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
// ========================================================== //
export default function Active_Subscriptions(
    { trainersList }: { trainersList: trainer[] }
) {
    const [activeSubscriptionsTotle, setActiveSubscriptionsTotle] = useState(0);


    useEffect(function () {
        setActiveSubscriptionsTotle(0);

        trainersList.forEach(ele => {
            if (ele.subscriptionState == stateIsActive) {
                setActiveSubscriptionsTotle(prev => prev + 1);
            }
        });
    }, [trainersList]);



    return <div className={`bg-slate-100 rounded-lg h-40 p-5 select-none`}>
        <div>
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-500 w-fit mb-1">
                <ShieldCheck size={30} />
            </div>

            <h3 className=" opacity-65 text-lg">مجموع الاشتراكات المفعله</h3>
        </div>

        <div className="text-2xl font-bold">
            <span className="me-2">
                {
                    activeSubscriptionsTotle >= 3 && activeSubscriptionsTotle
                }
            </span>

            <span>
                {
                    activeSubscriptionsTotle == 0 ? "لا يوجد" :
                        activeSubscriptionsTotle == 1 ? "اشتراك" :
                            activeSubscriptionsTotle == 2 ? "اشتراكين" : "اشتراكات"
                }
            </span>
        </div>
    </div>
}