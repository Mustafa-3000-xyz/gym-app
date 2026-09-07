import { REMOVE_TRAINERS } from '@/Lib/constants';
import { alert, checkPermissionesInAccount, normalAlert } from '@/Lib/functions';
import { deleteAllRowsInActiveSessionsTableToLinkedTheTrainer } from '@/Rtk/Slices/Db-slices/activeSessionsSlice';
import { getAllRowsInAttendanceTable } from '@/Rtk/Slices/Db-slices/attendanceSlice';
import { deleteRowInTrainersTableById } from '@/Rtk/Slices/Db-slices/trainersSlice';
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
                textBeforeSubmit: "هل تريد حقا حذف ذلك المتدرب ؟",
                textAfterSubmit: "ذلك المتدرب لم يعد موجود في الجدول",
                runFunctionAfterSubmit: function () {
                    dispatch(deleteRowInTrainersTableById(id as any) as any);
                    dispatch(removeTrainerDetails() as any);

                    dispatch(deleteAllRowsInActiveSessionsTableToLinkedTheTrainer(id) as any);
                    removeTrainerInAttendanceRecord(id);
                }
            });
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحية لحذف المتدربين",
                icon: "error"
            });
        }
    }

    async function removeTrainerInAttendanceRecord(trainerId: number) {
        const database = await Database.load("sqlite:gym-app.db");

        try {
            await database.execute(`
                UPDATE attendance SET trainers = (
                SELECT json_group_array(value) 
                    FROM json_each(attendance.trainers) 
                    WHERE value != ? AND value != ?
                )
                WHERE attendance.trainers LIKE ?;
            `, [trainerId, trainerId.toString(), `%${trainerId}%`]);

            await database.execute(`
                DELETE FROM attendance 
                WHERE trainers IS NULL 
                OR trainers = '[]' 
                OR json_array_length(trainers) = 0;
            `);
            dispatch(getAllRowsInAttendanceTable() as any);
        } catch (error) {
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