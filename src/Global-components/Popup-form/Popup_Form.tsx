import { X } from "lucide-react";
import Discription from "../Description/Discription";
import { Popup_Form_Props } from "../types";
import Animation from "../Animation/Animation";
// ========================================================== //
export default function Popup_Form(
    {
        titel,
        discription,
        children,
        isSave = false,
        isShowBtn = true,
        typeBtn = "save data",
        clickOnCancel,
        clickOnSaveBtn,
    }: Popup_Form_Props
) {
    return <div className="w-screen h-screen fixed bg-black/65 top-0 end-0 select-none z-50">
        <Animation
            className={`
                absolute top-1/2 end-1/2 -translate-x-1/2 -translate-y-1/2
                bg-slate-100 border border-slate-200 rounded-lg w-[80vw]
            `}
            initial={{
                scale: 0.5,
            }}
            animate={{
                scale: 1,
            }}
        >
            {/* Title & x */}
            <div className="px-5 flex justify-between items-center mb-5 bg-black/5 p-5 border-b border-b-slate-300">
                <div>
                    <h3 className=" font-bold text-lg">
                        {titel}
                    </h3>
                    <Discription discription={discription} />
                </div>

                <X size={23} onClick={clickOnCancel} className="cursor-pointer text-red-500" />
            </div>

            <form className="p-3">
                {children}
            </form>

            {/* Btn save and cancel */}
            <div className="bg-black/5 p-5 border-t border-t-slate-300 flex gap-3 mt-5">
                {
                    isShowBtn != false &&
                    <button
                        onClick={isSave ? clickOnSaveBtn : () => null}
                        className={`
                            transition duration-300 
                            ${!isSave ? "opacity-55 cursor-not-allowed" : "opacity-100 cursor-pointer"}
                            bg-(--thirdColor) text-white px-5 py-2 rounded-lg
                        `}
                    >
                        {typeBtn == "save data" ? " حفظ البيانات" : "حفظ التغيرات"}
                    </button>
                }

                <button
                    onClick={clickOnCancel}
                    className={`
                    transition duration-300 hover:bg-red-600 px-5 py-2
                    bg-red-500 text-white px-5 cursor-pointer rounded-lg
                `}
                >
                    إلغاء
                </button>
            </div>
        </Animation>
    </div>
}