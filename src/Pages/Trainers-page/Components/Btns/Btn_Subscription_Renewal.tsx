import { alert, checkThePermissionIsHere, normalAlert, theTodayDate } from '@/Lib/functions';
import { daysProfitsAndExpenses_Type, monthsProfitsAndExpenses_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
import { Btn_Subscription_Renewal_Props } from "@/Pages/typesProps";
import { updateSomePropertiesInRowInTrainersTable } from '@/Rtk/Slices/Db-slices/trainersSlice';
import { removeTrainerDetails } from '@/Rtk/Slices/UI-slices/trainerDetailsSlice';
import { RefreshCcw } from 'lucide-react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { maxTargetInDay, maxTargetInMonth, maxTargetInYear, monthsWithHisDays, RENEWAL_SUBSCRIPTION, renewalSubscription, statusIsActive } from '@/Lib/constants';
import { removeSubscriptionStart } from '@/Rtk/Slices/UI-slices/subscriptionStartSlice';
import { removeSubscriptionEnd } from '@/Rtk/Slices/UI-slices/subscriptionEndSlice';
import { removeAllSessions } from '@/Rtk/Slices/UI-slices/sessionsCountSlice';
import { store_Type } from '@/Rtk/types';
import Database from '@tauri-apps/plugin-sql';
import { useMemo } from 'react';
import { arithmeticOperatorsWithProfitsAndExpenses } from '@/Lib/functionsWithDb';
import { addRowInItemsTable } from '@/Rtk/Slices/Db-slices/itemsSlice';
import { addRowInDaysProfitsAndExpensesTable } from '@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice';
import { addRowInMonthsProfitsAndExpensesTable } from '@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice';
import { addRowInYearsProfitsAndExpensesTable } from '@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice';
// ========================================================== //
export default function Btn_Subscription_Renewal(
    { trainer, isInfoComplete }: Btn_Subscription_Renewal_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo
        }
    }, shallowEqual);

    const checkRenewalPermission = checkThePermissionIsHere({
        accountId: Number(state.logInInfo?.id),
        permissionType: RENEWAL_SUBSCRIPTION
    });

    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);




    function subscriptionRenewal() {
        if (!isInfoComplete) return;

        if (checkRenewalPermission) {
            alert({
                titleBeforeClickOnOk: "هل تريد تجديد الاشتراك ؟؟",
                titleAfterClickOnOk: `تم تجديد الاشتراك للمتدرب رقم : ${trainer?.id}`,
                funRunWhenClickOnOk: function () {
                    dispatch(updateSomePropertiesInRowInTrainersTable({
                        id: trainer?.id as any,
                        values: {
                            ...trainer,
                            subscriptionStatus: statusIsActive,
                            lastRenewalSubscription: todayDate.toISOString()
                        }
                    }) as any);

                    dispatch(removeSubscriptionStart());
                    dispatch(removeSubscriptionEnd());
                    dispatch(removeAllSessions());

                    subscriptionPriceIsProfit();
                }
            });
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحية لتجديد اشتراكات المتدربين",
                icon: "error"
            });
        }
    }

    async function subscriptionPriceIsProfit() {
        const database = await Database.load("sqlite:app-gym-db.db");
        const price = Number(trainer.price || 0);

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
                        value: (getYear.profitsTotal || 0) + price
                    },
                    month: {
                        monthId: Number(getMonth.id),
                        column: "profitsTotal",
                        value: (getMonth.profitsTotal || 0) + price
                    },
                    day: {
                        dayId: Number(getDay.id),
                        column: "profitsTotal",
                        value: (getDay.profitsTotal || 0) + price
                    }
                }
            });
            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDay.id),
                itemName: renewalSubscription,
                category: "profit",
                price: price
            }) as any);
        }
        else if (getYear && getMonth && !getDay) {
            const getDayId = await dispatch(addRowInDaysProfitsAndExpensesTable({
                linkWithMonth: Number(getMonth.id),
                dayNumber: todayDate.getDate(),
                profitsTotal: price,
                expensesTotal: 0,
                target: maxTargetInDay
            }) as any).unwrap() as daysProfitsAndExpenses_Type;


            arithmeticOperatorsWithProfitsAndExpenses({
                updateOneColumn: {
                    year: {
                        yearId: Number(getYear.id),
                        column: "profitsTotal",
                        value: (getYear.profitsTotal || 0) + price
                    },
                    month: {
                        monthId: Number(getMonth.id),
                        column: "profitsTotal",
                        value: (getMonth.profitsTotal || 0) + price
                    }
                }
            });
            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDayId.id),
                itemName: renewalSubscription,
                category: "profit",
                price: price
            }) as any);
        }
        else if (getYear && !getMonth && !getDay) {
            const monthName = monthsWithHisDays.find(ele => ele.monthNumber == todayDate.getMonth() + 1)?.month;
            const getMonthId = await dispatch(addRowInMonthsProfitsAndExpensesTable({
                linkWithYear: Number(getYear.id),
                monthName: monthName as string,
                monthNumber: todayDate.getMonth() + 1,
                profitsTotal: price,
                expensesTotal: 0,
                target: maxTargetInMonth
            }) as any).unwrap() as monthsProfitsAndExpenses_Type;

            const getDayId = await dispatch(addRowInDaysProfitsAndExpensesTable({
                linkWithMonth: Number(getMonthId.id),
                dayNumber: todayDate.getDate(),
                profitsTotal: price,
                expensesTotal: 0,
                target: maxTargetInDay
            }) as any).unwrap() as daysProfitsAndExpenses_Type;


            arithmeticOperatorsWithProfitsAndExpenses({
                updateOneColumn: {
                    year: {
                        yearId: Number(getYear.id),
                        column: "profitsTotal",
                        value: (getYear.profitsTotal || 0) + price
                    }
                }
            });
            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDayId.id),
                itemName: renewalSubscription,
                category: "profit",
                price: price
            }) as any);
        }
        else {
            const getYearId = await dispatch(addRowInYearsProfitsAndExpensesTable({
                yearNumber: Number(todayDate.getFullYear()),
                profitsTotal: price,
                expensesTotal: 0,
                target: maxTargetInYear
            }) as any).unwrap() as yearsProfitsAndExpenses_Type;

            const monthName = monthsWithHisDays.find(ele => ele.monthNumber == todayDate.getMonth() + 1)?.month;
            const getMonthId = await dispatch(addRowInMonthsProfitsAndExpensesTable({
                linkWithYear: Number(getYearId.id),
                monthName: monthName as string,
                monthNumber: todayDate.getMonth() + 1,
                profitsTotal: price,
                expensesTotal: 0,
                target: maxTargetInMonth
            }) as any).unwrap() as monthsProfitsAndExpenses_Type;

            const getDayId = await dispatch(addRowInDaysProfitsAndExpensesTable({
                linkWithMonth: Number(getMonthId.id),
                dayNumber: todayDate.getDate(),
                profitsTotal: price,
                expensesTotal: 0,
                target: maxTargetInDay
            }) as any).unwrap() as daysProfitsAndExpenses_Type;


            dispatch(addRowInItemsTable({
                linkWithDay: Number(getDayId.id),
                itemName: renewalSubscription,
                category: "profit",
                price: price
            }) as any);
        }

        dispatch(removeTrainerDetails() as any);
    }




    return <button
        type='button'
        className={`
            duration-300 
            bg-amber-300/40 text-amber-700 rounded-lg px-6 py-3 flex items-center gap-2 font-bold
            ${isInfoComplete ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}
        `}
        onClick={subscriptionRenewal}
    >
        <span>
            <RefreshCcw size={23} />
        </span>

        <span>
            تجديد الاشتراك
        </span>
    </button>
}