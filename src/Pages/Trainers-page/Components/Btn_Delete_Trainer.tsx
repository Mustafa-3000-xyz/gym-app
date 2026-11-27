import Custom_Btn from '@/Global-components/Custom-btn/Custom_Btn';
import { REMOVE_TRAINERS, trainerPagePath } from '@/Lib/constants';
import { addTrainerInTrash, customAlert, checkPermissionesInAccount, normalAlert } from '@/Lib/functions';
import { deleteRowsInActiveSessionsTableToLinkedTheTrainerById } from '@/Lib/functionsWithDb';
import { reports_Type } from '@/Pages/types';
import { Btn_Delete_Trainer_Props } from '@/Pages/typesProps';
import { addRowInReportsTable } from '@/Rtk/Slices/Db-slices/reportsSlice';
import { deleteRowInTrainersTableById } from '@/Rtk/Slices/Db-slices/trainersSlice';
import { changeStatusTheShowForSideBar } from '@/Rtk/Slices/UI-slices/sideBarSlice';
import { store_Type } from '@/Rtk/types';
import { Trash } from 'lucide-react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// ========================================================== //
export default function Btn_Delete_Trainer(
    {
        trainerId,
        subscriptionPrice,
        pay
    }: Btn_Delete_Trainer_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo
        }
    }, shallowEqual);


    const navigation = useNavigate();

    const checkDeletePermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: REMOVE_TRAINERS
    });




    function deleteTrainer() {
        if (checkDeletePermission) {
            customAlert({
                titleBeforeSubmit: "تحذير",
                textBeforeSubmitAction: `هل تود بالفعل حذف ذلك المتدرب ؟`,
                textAfterSubmitAction: "تم حذف المتدرب",
                runFunctionAfterConfirm: function () {
                    addTrainerInTrash(Number(state.logInInfo?.id), 1);
                    deleteRowsInActiveSessionsTableToLinkedTheTrainerById(trainerId);


                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "تم حذف متدرب",
                        description: `
                            حساب رقم ${state.logInInfo?.id} قام بحذف متدرب رقم ${trainerId} والذي يبلغ قيمة الاشتراك الخاصه به حوالي ${subscriptionPrice} وتم سداد ${pay}
                        `,
                        reportedBy: "بيمو"
                    } as reports_Type) as any);
                    dispatch(deleteRowInTrainersTableById(trainerId) as any);
                    dispatch(changeStatusTheShowForSideBar("show"));


                    navigation(trainerPagePath);
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




    return <Custom_Btn
        className={`
            overflow-hidden duration-200
            w-[70px] hover:w-[180px] hover:gap-3
            flex items-center gap-7 font-bold px-6 py-3 cursor-pointer rounded-lg
        `}
        onClick={deleteTrainer}
    >
        <span>
            <Trash size={23} />
        </span>

        <span className='shrink-0 mb-1.5'>
            حذف المتدرب
        </span>
    </Custom_Btn>
}