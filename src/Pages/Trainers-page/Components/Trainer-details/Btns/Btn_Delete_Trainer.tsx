import { alert } from '@/Lib/functions';
import { Btn_Delete_Trainer_Props } from "@/Pages/types";
import { deleteTrainerById } from '@/Rtk/Slices/trainersSlice';
import { Trash } from 'lucide-react'
import { useDispatch } from 'react-redux';
// ========================================================== //
export default function Btn_Delete_Trainer(
    { trainer, onWhenDeleteTrainer }: Btn_Delete_Trainer_Props
) {
    const dispatch = useDispatch();



    function deleteTrainer() {
        alert({
            titleBeforeClickOnOk: "هل تريد حقا حذف ذلك المتدرب ؟",
            titleAfterClickOnOk: "ذلك المتدرب لم يعد موجود في الجدول",
            showMessageAfterClickOnOk: true,
            funRunWhenClickOnOk: function () {
                dispatch(deleteTrainerById(trainer?.trainerId as any) as any)
                onWhenDeleteTrainer();
            }
        });
    }


    return <button
        onClick={deleteTrainer}
        className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-red-300/40 text-amber-700"
    >
        <span>
            <Trash size={23} />
        </span>

        <span>
            حذف المتدرب
        </span>
    </button>
}