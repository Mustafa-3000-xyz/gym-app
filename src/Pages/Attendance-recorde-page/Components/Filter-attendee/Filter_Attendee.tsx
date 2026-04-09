import { ArrowDownWideNarrow } from "lucide-react";
// ========================================================== //
export default function Filter_Attendee() {
    return <button className={`
        transition duration-300
        h-full w-full flex justify-center items-center gap-2 bg-slate-200 rounded-lg
        cursor-pointer hover:bg-slate-300/60
    `}
    >
        <ArrowDownWideNarrow />

        <p className="font-bold">
            كل المتدربين
        </p>
    </button>
} 