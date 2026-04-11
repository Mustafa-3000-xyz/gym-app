import { Add_Btn_Props } from "../types";
// ========================================================== //
export default function Add_Btn(
    {
        styleTheBgAndBorderBtn,
        thePaddingY = "py-6",
        title,
        icon,
        onClick
    }: Add_Btn_Props
) {
    return <div className="flex justify-center">
        <button
            onClick={onClick}
            className={`
                ${styleTheBgAndBorderBtn} px-6 ${thePaddingY}
                whitespace-nowrap
                w-full flex gap-2 justify-center items-center transition-all  text-white rounded-lg border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
            `}
        >
            <p>
                {icon}
            </p>

            <h3 className="text-lg font-bold">
                {title}
            </h3>
        </button>
    </div>
}