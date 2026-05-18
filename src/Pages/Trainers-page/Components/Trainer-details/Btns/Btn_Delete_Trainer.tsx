import { alert } from '@/Lib/functions';
import { deleteRowInTrainersTableById } from '@/Rtk/Slices/trainersSlice';
import { removeTrainerDetails } from '@/Rtk/Slices/trainerDetailsSlice';
import { Trash } from 'lucide-react'
import { useDispatch } from 'react-redux';
// ========================================================== //
export default function Btn_Delete_Trainer(
    { trainerId }: {trainerId: number}
) {
    const dispatch = useDispatch();



    function deleteTrainer() {
        alert({
            titleBeforeClickOnOk: "هل تريد حقا حذف ذلك المتدرب ؟",
            titleAfterClickOnOk: "ذلك المتدرب لم يعد موجود في الجدول",
            showMessageAfterClickOnOk: true,
            funRunWhenClickOnOk: function () {
                dispatch(deleteRowInTrainersTableById(trainerId as any) as any)
                dispatch(removeTrainerDetails() as any);
            }
        });
    }


    return <button
        type='button'
        className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-red-300/40 text-amber-700"
        onClick={deleteTrainer}
    >
        <span>
            <Trash size={23} />
        </span>

        <span>
            حذف المتدرب
        </span>
    </button>
}