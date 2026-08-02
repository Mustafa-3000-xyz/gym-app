import { Plus } from "lucide-react";
import { Add_Btn_Props } from "../typesProps";
// ========================================================== //
export default function Add_Btn(
    {
        title,
        className,
        onClick
    }: Add_Btn_Props
) {
    return <div className="flex justify-center">
        <button
            onClick={onClick}
            className={`
                ${className} p-6
                whitespace-nowrap !bg-emerald-500 !border-emerald-600
                w-full flex gap-2 justify-center items-center transition-all !text-white rounded-lg border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
            `}
        >
            <p>
                <Plus size={20} strokeWidth={3} />
            </p>

            <h3 className="text-lg font-bold">
                {title}
            </h3>
        </button>
    </div>
}