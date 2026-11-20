import { Popup_Form_Props } from "../typesProps";
import { motion } from "framer-motion";
import Custom_Btn from "../Custom-btn/Custom_Btn";
// ========================================================== //
export default function Popup_Component(
    {
        title,
        children,
        typeBtn = "save data",
        classNameForParent,
        classNameForContainer,
        clickOnCancel,
        clickOnSaveBtn,
    }: Popup_Form_Props
) {
    return <div className="w-screen h-screen fixed bg-black/65 top-0 end-0 select-none z-50 flex justify-center items-center">
        <motion.div
            className={`
                bg-slate-200 border border-slate-200
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
            {/* Title */}
            <div className="text-center p-5 mb-5">
                <h3 className=" font-bold text-3xl">
                    {title}
                </h3>
            </div>

            {/* Content */}
            <div className={`p-5 ${classNameForContainer}`}>
                {children}
            </div>

            {/* Btn save and cancel */}
            <div className="flex gap-3 p-5">
                <Custom_Btn
                    onClick={clickOnSaveBtn}
                    className="bg-emerald-500! border-emerald-600!"
                >
                    {typeBtn == "save data" ? " حفظ البيانات" : "حفظ التغيرات"}
                </Custom_Btn>

                <Custom_Btn onClick={clickOnCancel} >
                    الرجوع
                </Custom_Btn>
            </div>
        </motion.div>
    </div>
}