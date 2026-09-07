import { CANCEL_SUBSCRIPTION, statusIsFinished } from "@/Lib/constants";
import { alert, checkPermissionesInAccount, normalAlert } from "@/Lib/functions";
import { deleteAllRowsInActiveSessionsTableToLinkedTheTrainer } from "@/Rtk/Slices/Db-slices/activeSessionsSlice";
import { updatePropertyInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { store_Type } from "@/Rtk/types";
import { BanknoteX } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// ========================================================== //
export default function Btn_Cancel_Subscription(
    { trainerId }: { trainerId: number }
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            trainerDetails: state.trainerDetails
        }
    }, shallowEqual);


    const checkCancelSubscriptionPermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: CANCEL_SUBSCRIPTION
    });


    function finishedSubscriptionUsingBtn() {
        if (checkCancelSubscriptionPermission) {
            alert({
                textBeforeSubmit: "هل تريد بالفعل الغاء اشتراك ذلك المتدرب ؟؟",
                textAfterSubmit: `تم الغاء الاشتراك للمتدرب رقم : ${trainerId}`,
                runFunctionAfterSubmit: async function () {
                    dispatch(updatePropertyInRowInTrainersTable({
                        id: trainerId as any,
                        column: "subscriptionStatus",
                        value: statusIsFinished
                    }) as any);

                    dispatch(removeTrainerDetails());
                    dispatch(deleteAllRowsInActiveSessionsTableToLinkedTheTrainer(trainerId) as any);
                }
            });
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحية لسحب اشتراكات المتدربين",
                icon: "error"
            });
        }
    }




    return <button
        type='button'
        className={`
            overflow-hidden
            duration-300 w-[70px] hover:w-[180px] hover:gap-3
            flex items-center gap-7 font-bold px-6 py-3 cursor-pointer rounded-lg bg-amber-300/40 text-amber-700
        `}
        onClick={finishedSubscriptionUsingBtn}
    >
        <BanknoteX
            size={23}
            className="shrink-0"
        />

        <span className="shrink-0 mb-1.5">
            الغاء الاشتراك
        </span>
    </button>
}
