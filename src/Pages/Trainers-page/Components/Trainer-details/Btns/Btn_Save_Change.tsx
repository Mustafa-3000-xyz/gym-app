import { alert } from "@/Lib/customs";
import { Btn_Save_Change_Props } from "@/Pages/Trainers-page/types";
import { updateSomePropertiesInTrainer } from "@/Rtk/Slices/trainersSlice";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Btn_Save_Change(
    {
        id,
        trainerState,
        isChangeInfo,
        closeWindow
    }: Btn_Save_Change_Props
) {
    const dispatch = useDispatch();



    function updateInfo() {
        if (!isChangeInfo) return;

        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تعديل البيانات , في حالة تعديل عدد الحصص سوف يتم اعاده الحصص من الاول",
            titleAfterClickOnOk: `تم تحديث المتدرب رقم : ${id}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: id as any,
                    trainer: trainerState as any
                }) as any);

                closeWindow();
            }
        });
    }



    return <button
        onClick={updateInfo}
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