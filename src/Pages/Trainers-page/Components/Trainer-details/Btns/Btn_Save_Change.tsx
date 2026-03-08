import { Btn_Save_Change_Props } from "@/Pages/Trainers-page/types";
// ========================================================== //
export default function Btn_Save_Change(
    {isChangeInfo, onUpdateInfo}: Btn_Save_Change_Props
) {
    
    return <button
        onClick={onUpdateInfo}
        className={`
            transition duration-300 
            bg-[#385E97] text-white px-5 py-2 rounded-lg
            hover:bg-[#285E97]
            ${isChangeInfo ?
            "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}
        `}
    >
        حفظ التغيرات
    </button>
}