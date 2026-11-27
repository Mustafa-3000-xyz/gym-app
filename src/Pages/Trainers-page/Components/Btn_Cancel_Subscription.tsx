import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { CANCEL_SUBSCRIPTION, statusIsFinished, trainerPagePath } from "@/Lib/constants";
import { customAlert, checkPermissionesInAccount, normalAlert } from "@/Lib/functions";
import { systemForAddYearsMonthesDaysAndItems, deleteRowsInActiveSessionsTableToLinkedTheTrainerById } from "@/Lib/functionsWithDb";
import { reports_Type } from "@/Pages/types";
import { Btn_Cancel_Subscription_Props } from "@/Pages/typesProps";
import { addRowInReportsTable } from "@/Rtk/Slices/Db-slices/reportsSlice";
import { updateAnyPropertyInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { changeStatusTheShowForSideBar } from "@/Rtk/Slices/UI-slices/sideBarSlice";
import { store_Type } from "@/Rtk/types";
import { BanknoteX } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// ========================================================== //
export default function Btn_Cancel_Subscription(
    {
        trainerId,
        subscriptionPrice,
        pay
    }: Btn_Cancel_Subscription_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);


    const navigation = useNavigate();

    const checkCancelSubscriptionPermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: CANCEL_SUBSCRIPTION
    });




    async function systemForProfitesAndExpenses() {
        await systemForAddYearsMonthesDaysAndItems(
            new Date(),
            {
                year: {
                    expensess: pay
                },
                month: {
                    expensess: pay
                },
                day: {
                    expensess: pay
                },
                item: {
                    category: "expense",
                    additionTime: new Date().toISOString(),
                    title: "سحب اشتراك لمتدرب",
                    price: pay,
                }
            }
        );
    }

    function finishedSubscriptionUsingBtn() {
        if (checkCancelSubscriptionPermission) {
            customAlert({
                titleBeforeSubmit: "قبل إلغاء الإشتراك",
                textAfterSubmitAction: `تم إلغاء اشتراك المتدرب بنجاح`,
                textBeforeSubmitAction: "هل تود إضافة باند مصروف يحتوي على سعر الاشتراك النهائي ؟",
                isShowDeniedBtn: true,
                runFunctionAfterConfirm: async function () {
                    systemForProfitesAndExpenses();
                    await deleteRowsInActiveSessionsTableToLinkedTheTrainerById(trainerId);


                    dispatch(updateAnyPropertyInRowInTrainersTable({
                        id: trainerId as any,
                        values: {
                            subscriptionStatus: statusIsFinished
                        } as any
                    }) as any);

                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "سحب اشتراك لمتدرب مع اضافة باند مصروف",
                        description: `
                            حساب رقم ${state.logInInfo?.id} قام بسحب اشتراك لمتدرب رقم ${trainerId} والذي يبلغ قيمة الاشتراك الخاصه به حوالي ${subscriptionPrice} وتم سداد ${pay}
                        `,
                        reportedBy: "بيمو"
                    } as reports_Type) as any);
                    dispatch(changeStatusTheShowForSideBar("show"));
                    navigation(trainerPagePath);
                },
                runFunctionAfterDenied: async function () {
                    await deleteRowsInActiveSessionsTableToLinkedTheTrainerById(trainerId);

                    dispatch(updateAnyPropertyInRowInTrainersTable({
                        id: trainerId as any,
                        values: {
                            subscriptionStatus: statusIsFinished
                        } as any
                    }) as any);

                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "إلغاء اشتراك لمتدرب",
                        description: `
                            حساب رقم ${state.logInInfo?.id} قام بإلغاء اشتراك لمتدرب رقم ${trainerId}
                        `,
                        reportedBy: "بيمو"
                    } as reports_Type) as any);

                    dispatch(changeStatusTheShowForSideBar("show"));
                    navigation(trainerPagePath);
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




    return <Custom_Btn
        className={`
            overflow-hidden duration-200
            w-[70px] hover:w-[180px] hover:gap-3
            bg-amber-300/40! text-amber-700! border-amber-400!
            flex items-center gap-7 font-bold px-6 py-3 cursor-pointer rounded-lg
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
    </Custom_Btn>
}