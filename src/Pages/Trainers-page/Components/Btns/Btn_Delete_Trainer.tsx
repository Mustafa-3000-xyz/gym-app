import { REMOVE_TRAINERS } from '@/Lib/constants';
import { alert, checkPermissionesInAccount, normalAlert } from '@/Lib/functions';
import { getAllRowsInAttendanceTable } from '@/Rtk/Slices/Db-slices/attendanceSlice';
import { deleteRowInTrainersTableById } from '@/Rtk/Slices/Db-slices/trainersSlice';
import { removeAllSessions } from '@/Rtk/Slices/UI-slices/sessionsCountSlice';
import { removeSubscriptionEnd } from '@/Rtk/Slices/UI-slices/subscriptionEndSlice';
import { removeSubscriptionStart } from '@/Rtk/Slices/UI-slices/subscriptionStartSlice';
import { removeTrainerDetails } from '@/Rtk/Slices/UI-slices/trainerDetailsSlice';
import { store_Type } from '@/Rtk/types';
import Database from '@tauri-apps/plugin-sql';
import { Trash } from 'lucide-react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
// ========================================================== //
export default function Btn_Delete_Trainer(
    { id }: { id: number }
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo
        }
    }, shallowEqual);

    const checkDeletePermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: REMOVE_TRAINERS
    });



    function deleteTrainer() {
        if (checkDeletePermission) {
            alert({
                titleBeforeClickOnOk: "هل تريد حقا حذف ذلك المتدرب ؟",
                titleAfterClickOnOk: "ذلك المتدرب لم يعد موجود في الجدول",
                funRunWhenClickOnOk: function () {
                    dispatch(deleteRowInTrainersTableById(id as any) as any);
                    dispatch(removeTrainerDetails() as any);
                    dispatch(removeSubscriptionStart());
                    dispatch(removeSubscriptionEnd());
                    dispatch(removeAllSessions());

                    removeTrainerInAttendanceRecord(id);
                }
            });
        }
        else{
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحية لحذف المتدربين",
                icon: "error"
            });
        }
    }

    async function removeTrainerInAttendanceRecord(id: number) {
        const database = await Database.load("sqlite:app-gym-db.db");

        await database.execute("BEGIN TRANSACTION;");

        try {
            await database.execute(`
                UPDATE attendance 
                SET trainers = (
                    SELECT json_group_array(value) 
                    FROM json_each(attendance.trainers) 
                    WHERE value != ?
                )
                WHERE attendance.id IN (
                    SELECT attendance.id 
                    FROM attendance, json_each(attendance.trainers) 
                    WHERE json_each.value = ?
                )
            `, [id, id]);

            await database.execute(`
                DELETE FROM attendance 
                WHERE trainers = '[]' OR json_array_length(trainers) = 0;
            `);

            await database.execute("COMMIT;");
            dispatch(getAllRowsInAttendanceTable() as any);
        } catch (error) {
            await database.execute("ROLLBACK;");
            console.error(error);
        }
    }



    return <button
        type='button'
        className="flex items-center gap-2 font-bold px-6 py-3  cursor-pointer rounded-lg bg-red-300/40 text-amber-700"
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