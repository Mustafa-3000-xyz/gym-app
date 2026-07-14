import { alert, checkThePermissionIsHere, normalAlert } from "@/Lib/functions";
import { stateIsFinished, WITHDRAW_SUBSCRIPTION } from "@/Lib/constants";
import { updatePropertyInRowInTrainersTable, updateSomePropertiesInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { BanknoteX } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { removeSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { removeSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
import { removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { store_Type } from "@/Rtk/types";
// ========================================================== //
export default function Btn_Withdraw_Money(
    { id }: { id: number }
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo
        }
    }, shallowEqual);

    const checkWithDrawPermission = checkThePermissionIsHere({
        accountId: Number(state.logInInfo?.id),
        permissionType: WITHDRAW_SUBSCRIPTION
    });



    function finishedSubscriptionUsingBtn() {
        if (checkWithDrawPermission) {
            alert({
                titleBeforeClickOnOk: "هل تريد بالفعل سحب اشتراك ذلك المتدرب ؟؟",
                titleAfterClickOnOk: `تم سحب الاشتراك للمتدرب رقم : ${id}`,
                funRunWhenClickOnOk: function () {
                    dispatch(updatePropertyInRowInTrainersTable({
                        id: id as any,
                        column: "subscriptionState",
                        value: stateIsFinished
                    }) as any);

                    dispatch(removeTrainerDetails());
                    dispatch(removeSubscriptionStart());
                    dispatch(removeSubscriptionEnd());
                    dispatch(removeAllSessions());
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
        className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-amber-300/40 text-amber-700"
        onClick={finishedSubscriptionUsingBtn}
    >
        <span>
            <BanknoteX size={23} />
        </span>

        <span>
            سحب الاشتراك
        </span>
    </button>
}