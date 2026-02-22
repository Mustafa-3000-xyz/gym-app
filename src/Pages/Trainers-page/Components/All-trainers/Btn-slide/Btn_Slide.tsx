import { Btn_Slide_Props } from "@/Pages/Trainers-page/types";
// ========================================================== //
export default function Btn_Slide(
    { index, currentSlide, onGetIndexBtn }: Btn_Slide_Props
) {
    return <button
        key={index}
        onClick={() => onGetIndexBtn(index)}
        className={`
            ${index == currentSlide ? "bg-blue-100 text-blue-500" : "bg-slate-100"}
            px-4 py-1 cursor-pointer rounded-md border border-slate-300
        `}
    >
        {index + 1}
    </button>
}