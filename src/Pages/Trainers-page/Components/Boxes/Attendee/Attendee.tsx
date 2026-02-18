import { Users } from "lucide-react";
// ========================================================== //
export default function Attendee() {
    return <div className={`bg-slate-100 rounded-lg h-40 p-5 select-none`}>
        <div>
            <div className="bg-neutral-200 p-3 rounded-lg text-neutral-500 w-fit mb-1">
                <Users size={30}/>
            </div>

            <h3 className=" opacity-65 text-lg">عدد الحضور اليوم</h3>
        </div>

        <div className=" text-2xl font-bold">
            <span className="me-2">240</span>
            <span>متدرب</span>
        </div>
    </div>
}