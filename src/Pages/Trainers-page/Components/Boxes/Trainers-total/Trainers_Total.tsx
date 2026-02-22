import { trainer } from "@/Pages/Trainers-page/types";
import { BicepsFlexed } from "lucide-react";
// ========================================================== //
export default function Trainers_Total(
    { trainersList }: { trainersList: trainer[] }
) {
    return <div className={`bg-slate-100 rounded-lg h-40 p-5 select-none`}>
        <div>
            <div className="bg-blue-100 p-3 rounded-lg text-blue-500 w-fit mb-1">
                <BicepsFlexed size={30} />
            </div>

            <h3 className=" opacity-65 text-lg">مجموع المتدربين</h3>
        </div>

        <div className="text-2xl font-bold flex gap-1">
            <span>
                {
                    trainersList.length == 0 ||
                        trainersList.length == 1 || trainersList.length == 2 ?
                        null : trainersList.length
                }
            </span>

            <span>
                {
                    trainersList.length == 0 ? "لا يوجد" : trainersList.length == 1 ?
                        "متدرب" : "متدربين"
                }
            </span>
        </div>
    </div>
}