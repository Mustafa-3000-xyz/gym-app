import { ListFilter } from "lucide-react";
import { trainer } from "../../trainersTypes";
// ========================================================== //
export default function Btn_Filter(
    { trainersList }: { trainersList: trainer[] }
) {
    return <button
        disabled={trainersList.length <= 1 ? true : false}
        className={`
                ${trainersList.length <= 1  ? "opacity-35 cursor-not-allowed"
                : "opacity-100 cursor-pointer"}
                transition duration-500 hover:bg-slate-200
                flex items-center gap-2 bg-slate-100 p-3 px-4 border border-slate-300 rounded-lg
        `}
    >
        <ListFilter size={23} />

        <span className=" font-medium">
            فلتر
        </span>
    </button>
}