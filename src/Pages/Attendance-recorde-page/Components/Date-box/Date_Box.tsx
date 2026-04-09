import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
// ========================================================== //
export default function Date_Box() {
    const [position, setPosition] = useState(0);
    const [currentDate, setCurrentDate] = useState("");



    return <div className={`
        flex justify-between items-center px-3 h-full border border-slate-300 rounded-lg
        transition duration-300 cursor-pointer hover:bg-slate-300/25 
        has-[.arrow-btn:hover]:bg-transparent
    `}
    >
        <ArrowRight
            size={30}
            className={`
                arrow-btn 
                cursor-pointer transition-transform rounded-full p-1
                hover:bg-slate-300/25 hover:scale-110
            `}
        />

        {/* Dates */}
        <div className="select-none w-full flex justify-center">
            2026/5/3
        </div>

        <ArrowLeft
            size={30}
            className={`
                arrow-btn 
                cursor-pointer transition-transform rounded-full p-1
                hover:bg-slate-300/25 hover:scale-110
            `}
        />
    </div>
}