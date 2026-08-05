import { alert, checkPermissionesInAccount, normalAlert, theTodayDate } from "@/Lib/functions";
import { maxTargetInDay, maxTargetInMonth, maxTargetInYear, monthsWithHisDays, statusIsFinished, WITHDRAW_SUBSCRIPTION, withDrawSubscription } from "@/Lib/constants";
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
import { daysProfitsAndExpenses_Type, monthsProfitsAndExpenses_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
import { addRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { useMemo } from "react";
import { addRowInDaysProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { addRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { addRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
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


    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);




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

        const [getYear] = await database.select(`
            SELECT * from yearsProfitsAndExpenses WHERE yearNumber = ${todayDate.getFullYear()}
        `) as yearsProfitsAndExpenses_Type[];

        const [getMonth] = await database.select(`
            SELECT * from monthsProfitsAndExpenses WHERE linkWithYear = ${getYear ? getYear.id : -1} 
            AND monthNumber = ${todayDate.getMonth() + 1}
        `) as monthsProfitsAndExpenses_Type[];

        const [getDay] = await database.select(`
            SELECT * from daysProfitsAndExpenses WHERE linkWithMonth = ${getMonth ? getMonth.id : -1} 
            AND dayNumber = ${todayDate.getDate()}
        `) as daysProfitsAndExpenses_Type[];



        if (getYear && getMonth && getDay) {
            arithmeticOperatorsWithProfitsAndExpenses({
                updateOneColumn: {
                    year: {
                        yearId: Number(getYear.id),
                        column: "profitsTotal",
                        value: (getYear.profitsTotal || 0) - price
                    },
                    month: {
                        monthId: Number(getMonth.id),
                        column: "profitsTotal",
                        value: (getMonth.profitsTotal || 0) - price
                    },
                    day: {
                        dayId: Number(getDay.id),
                        column: "profitsTotal",
                        value: (getDay.profitsTotal || 0) - price
                    }
                }
            });

            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDay.id),
                linkedWithTrainer: Number(state.trainerDetails?.id),
                itemName: withDrawSubscription,
                price: price,
                category: "expense"
            }) as any);
        }
        else if (getYear && getMonth && !getDay) {
            // If the day is not exist, so add the subscription price in expenses total
            const getDayId = await dispatch(addRowInDaysProfitsAndExpensesTable({
                linkWithMonth: Number(getMonth.id),
                dayNumber: todayDate.getDate(),
                profitsTotal: 0,
                expensesTotal: price,
                target: maxTargetInDay
            }) as any).unwrap() as daysProfitsAndExpenses_Type;

            // Deposit subscription price in year and month specific expenses total, becasuse the day have expenses
            arithmeticOperatorsWithProfitsAndExpenses({
                updateOneColumn: {
                    year: {
                        yearId: Number(getYear.id),
                        column: "expensesTotal",
                        value: (getYear.expensesTotal || 0) + price
                    },
                    month: {
                        monthId: Number(getMonth.id),
                        column: "expensesTotal",
                        value: (getMonth.expensesTotal || 0) + price
                    }
                }
            });

            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDayId.id),
                linkedWithTrainer: Number(trainerId),
                itemName: withDrawSubscription,
                category: "expense",
                price: price
            }) as any);
        }
        else if (getYear && !getMonth && !getDay) {
            // If the day and month is not exist, so add the subscription price in expenses total for us
            const monthName = monthsWithHisDays.find(ele => ele.monthNumber == todayDate.getMonth() + 1)?.month;
            const getMonthId = await dispatch(addRowInMonthsProfitsAndExpensesTable({
                linkWithYear: Number(getYear.id),
                monthName: monthName as string,
                monthNumber: todayDate.getMonth() + 1,
                profitsTotal: 0,
                expensesTotal: price,
                target: maxTargetInMonth
            }) as any).unwrap() as monthsProfitsAndExpenses_Type;

            const getDayId = await dispatch(addRowInDaysProfitsAndExpensesTable({
                linkWithMonth: Number(getMonthId.id),
                dayNumber: todayDate.getDate(),
                profitsTotal: 0,
                expensesTotal: price,
                target: maxTargetInDay
            }) as any).unwrap() as daysProfitsAndExpenses_Type;

            // Deposit subscription price in year specific expenses total, becasuse the day and month hase expenses
            arithmeticOperatorsWithProfitsAndExpenses({
                updateOneColumn: {
                    year: {
                        yearId: Number(getYear.id),
                        column: "expensesTotal",
                        value: (getYear.expensesTotal || 0) + price
                    }
                }
            });

            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDayId.id),
                linkedWithTrainer: Number(trainerId),
                itemName: withDrawSubscription,
                category: "expense",
                price: price
            }) as any);
        }
        else {
            /*
                If the day and month and year is not exist, 
                so add the subscription price in expenses total for there
            */
            const getYearId = await dispatch(addRowInYearsProfitsAndExpensesTable({
                yearNumber: Number(todayDate.getFullYear()),
                profitsTotal: 0,
                expensesTotal: price,
                target: maxTargetInYear
            }) as any).unwrap() as yearsProfitsAndExpenses_Type;

            const monthName = monthsWithHisDays.find(ele => ele.monthNumber == todayDate.getMonth() + 1)?.month;
            const getMonthId = await dispatch(addRowInMonthsProfitsAndExpensesTable({
                linkWithYear: Number(getYearId.id),
                monthName: monthName as string,
                monthNumber: todayDate.getMonth() + 1,
                profitsTotal: 0,
                expensesTotal: price,
                target: maxTargetInMonth
            }) as any).unwrap() as monthsProfitsAndExpenses_Type;

            const getDayId = await dispatch(addRowInDaysProfitsAndExpensesTable({
                linkWithMonth: Number(getMonthId.id),
                dayNumber: todayDate.getDate(),
                profitsTotal: 0,
                expensesTotal: price,
                target: maxTargetInDay
            }) as any).unwrap() as daysProfitsAndExpenses_Type;

            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDayId.id),
                linkedWithTrainer: Number(trainerId),
                itemName: withDrawSubscription,
                category: "expense",
                price: price
            }) as any);
        }

        dispatch(removeTrainerDetails());
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