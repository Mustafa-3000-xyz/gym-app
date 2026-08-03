import { alert, checkPermissionesInAccount, normalAlert } from "@/Lib/functions";
import { addNewTrainer, statusIsFinished, WITHDRAW_SUBSCRIPTION, withDrawSubscription } from "@/Lib/constants";
import { updatePropertyInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { BanknoteX } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { removeSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { removeSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
import { removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { store_Type } from "@/Rtk/types";
import { arithmeticOperatorsWithProfitsAndExpenses, deleteRowsInActiveSessionsLinkedToTrainer } from "@/Lib/functionsWithDb";
import Database from "@tauri-apps/plugin-sql";
import { daysProfitsAndExpenses_Type, item_Type, monthsProfitsAndExpenses_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
import { updateSomePropertiesInRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
// ========================================================== //
export default function Btn_Withdraw_Money(
    { trainerId }: { trainerId: number }
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            trainerDetails: state.trainerDetails
        }
    }, shallowEqual);

    const checkWithDrawPermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: WITHDRAW_SUBSCRIPTION
    });



    function finishedSubscriptionUsingBtn() {
        if (checkWithDrawPermission) {
            alert({
                titleBeforeClickOnOk: "هل تريد بالفعل سحب اشتراك ذلك المتدرب ؟؟",
                titleAfterClickOnOk: `تم سحب الاشتراك للمتدرب رقم : ${trainerId}`,
                funRunWhenClickOnOk: async function () {
                    subscriptionPriceIsExpense();

                    dispatch(updatePropertyInRowInTrainersTable({
                        id: trainerId as any,
                        column: "subscriptionStatus",
                        value: statusIsFinished
                    }) as any);

                    dispatch(removeSubscriptionStart());
                    dispatch(removeSubscriptionEnd());
                    dispatch(removeAllSessions());

                    await deleteRowsInActiveSessionsLinkedToTrainer(trainerId);
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

    async function subscriptionPriceIsExpense() {
        const database = await Database.load("sqlite:app-gym-db.db");
        const price = Number(state.trainerDetails?.price || 0);
        const date = new Date(state.trainerDetails?.lastRenewalSubscription as string);


        const [getYear] = await database.select(`
            SELECT * from yearsProfitsAndExpenses 
            WHERE yearNumber = ${date.getFullYear()}
        `) as yearsProfitsAndExpenses_Type[];

        const [getMonth] = await database.select(`
            SELECT * from monthsProfitsAndExpenses 
            WHERE linkWithYear = ${getYear.id} 
            AND monthNumber = ${date.getMonth() + 1}
        `) as monthsProfitsAndExpenses_Type[];

        const [getDay] = await database.select(`
            SELECT * from daysProfitsAndExpenses 
            WHERE linkWithMonth = ${getMonth.id} 
            AND dayNumber = ${date.getDate()}
        `) as daysProfitsAndExpenses_Type[];

        const getItem = await database.select(`
            SELECT * from items WHERE linkWithDay = ${getDay.id} 
            AND itemName = '${addNewTrainer}' AND price = ${price}
        `) as item_Type[];

        const theItem = getItem[0];


        arithmeticOperatorsWithProfitsAndExpenses({
            updateSomeColumns: {
                year: {
                    yearId: Number(getYear.id),
                    profitsTotal: (getYear.profitsTotal || 0) - price,
                    expensesTotal: (getYear.expensesTotal || 0) + price
                },
                month: {
                    monthId: Number(getMonth.id),
                    profitsTotal: (getMonth.profitsTotal || 0) - price,
                    expensesTotal: (getMonth.expensesTotal || 0) + price
                },
                day: {
                    dayId: Number(getDay.id),
                    profitsTotal: (getDay.profitsTotal || 0) - price,
                    expensesTotal: (getDay.expensesTotal || 0) + price
                }
            }
        });

        dispatch(removeTrainerDetails());
        dispatch(updateSomePropertiesInRowInItemsTable({
            id: Number(theItem.id),
            values: {
                itemName: withDrawSubscription,
                category: "expense",
                price: price
            }
        }) as any);
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