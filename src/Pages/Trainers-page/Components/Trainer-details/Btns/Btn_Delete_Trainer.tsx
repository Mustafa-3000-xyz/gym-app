import { alert } from '@/Lib/functions';
import { deleteRowInTrainersTableById } from '@/Rtk/Slices/Db-slices/trainersSlice';
import { removeAllSessions } from '@/Rtk/Slices/UI-slices/sessionsCountSlice';
import { removeSubscriptionEnd } from '@/Rtk/Slices/UI-slices/subscriptionEndSlice';
import { removeSubscriptionStart } from '@/Rtk/Slices/UI-slices/subscriptionStartSlice';
import { removeTrainerDetails } from '@/Rtk/Slices/UI-slices/trainerDetailsSlice';
import Database from '@tauri-apps/plugin-sql';
import { Trash } from 'lucide-react'
import { useDispatch } from 'react-redux';
// ========================================================== //
export default function Btn_Delete_Trainer(
    { trainerId }: { trainerId: number }
) {
    const dispatch = useDispatch();



    function deleteTrainer() {
        alert({
            titleBeforeClickOnOk: "هل تريد حقا حذف ذلك المتدرب ؟",
            titleAfterClickOnOk: "ذلك المتدرب لم يعد موجود في الجدول",
            funRunWhenClickOnOk: function () {
                dispatch(deleteRowInTrainersTableById(trainerId as any) as any);
                dispatch(removeTrainerDetails() as any);
                dispatch(removeSubscriptionStart());
                dispatch(removeSubscriptionEnd());
                dispatch(removeAllSessions());

                removeTrainerInAttendanceRecord(trainerId);
            }
        });
    }

    async function removeTrainerInAttendanceRecord(trainerId: number) {
        const database = await Database.load("sqlite:app-gym-db.db");

        await database.execute(`
                UPDATE daysDetails 
                SET trainers = (
                    SELECT json_group_array(value) 
                    FROM json_each(daysDetails.trainers) 
                    WHERE value != ?
                )
                WHERE daysDetails.id IN (
                    SELECT daysDetails.id 
                    FROM daysDetails, json_each(daysDetails.trainers) 
                    WHERE json_each.value = ?
                )
        `, [trainerId, trainerId]);
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