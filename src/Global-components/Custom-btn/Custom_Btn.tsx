import { Custom_Btn_Props } from "../typesProps";
// ========================================================== //
export default function Custom_Btn(
    { className, children, onClick }: Custom_Btn_Props
) {
    return <button
        className={`
            border-b-[4px] border-red-700 bg-red-500  text-white
            cursor-pointer transition-all px-6 py-2 rounded-lg
            active:translate-y-[2px] active:border-b-[2px] active:brightness-90 
            hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110
            ${className}
        `}
        onClick={onClick as any}
    >
        {children}
    </button>
}