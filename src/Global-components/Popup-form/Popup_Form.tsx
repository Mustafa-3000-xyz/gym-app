import { X } from "lucide-react";
import Discription from "../Description/Discription";
import { Popup_Form_Props } from "../typesProps";
import Animation from "../Animation/Animation";
// ========================================================== //
export default function Popup_Form(
    {
        popupFormInfo,
        children,
        isSave = false,
        isShowBtn = true,
        typeBtn = "save data",
        classNameForParent,
        classNameForContainer,
        clickOnCancel,
        clickOnSaveBtn,
    }: Popup_Form_Props
) {
    return <div className="w-screen h-screen fixed bg-black/65 top-0 end-0 select-none z-50 flex justify-center items-center">
        <Animation
            className={`
                bg-slate-200 border border-slate-200 rounded-lg
                w-[90vw] overflow-y-auto
                flex flex-col justify-between
                ${classNameForParent}
            `}
            initial={{
                scale: 0.5,
            }}
            animate={{
                scale: 1,
            }}
        >
            {/* Title & discription & icon & x */}
            <div className="p-5 flex justify-between items-center bg-black/5 border-b border-b-slate-300">
                <div className="flex items-center gap-3">
                    {
                        popupFormInfo?.icon
                    }

                    <div>
                        <h3 className=" font-bold text-lg">
                            {popupFormInfo?.title}
                        </h3>
                        <Discription discription={popupFormInfo?.discription ?? ""} />
                    </div>
                </div>



                <X size={23} onClick={clickOnCancel} className="cursor-pointer text-red-500" />
            </div>

            <div className={`p-5 ${classNameForContainer}`}>
                {children}
            </div>

            {/* Btn save and cancel */}
            <div className="bg-black/5 border-t border-t-slate-300 flex gap-3 p-5">
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