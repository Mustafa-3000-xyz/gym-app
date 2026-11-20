import { Dumbbell } from "lucide-react";
// ========================================================== //
export default function Custom_Line() {
    return <div className="flex items-center gap-3 my-5">
        <div
            className="bg-black w-1/2 h-2"
        ></div>

        <Dumbbell size={30} />

        <div
            className="bg-black w-1/2 h-2"
        ></div>
    </div>
}