import { Box_Props } from "../types";
// ========================================================== //
export default function Box(
    {icon, styleIcon, title, total}: Box_Props
) {
    return <div className="bg-slate-100 rounded-lg h-40 p-5 select-none">
        <div>
            <div className={`${styleIcon} p-3 rounded-lg w-fit mb-1`}>
                {icon}
            </div>

            <h3 className=" opacity-65 text-lg">
                {title}
            </h3>
        </div>

        <div className="text-2xl font-bold flex gap-1">
            {total}
        </div>
    </div>
}