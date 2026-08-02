import { Presentation, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { addRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import Trainer_Info_Form from "../Forms/Trainer_Info_Form";
import Subscription_Info_Form from "../Forms/Subscription_Info_Form";
import { alert, incrementOrDecrementForTotalSessionsInAccount, theTodayDate } from "@/Lib/functions";
import { addNewTrainer, maxTargetInDay, maxTargetInMonth, maxTargetInYear, monthsWithHisDays, statusIsActive, statusIsFinished, statusIsPending } from "@/Lib/constants";
import Date_Info_Form from "../Forms/Date_Info_Form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { daysProfitsAndExpenses_Type, monthsProfitsAndExpenses_Type, trainer_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { store_Type } from "@/Rtk/types";
import { removeSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { removeSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
import { removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { addDays } from "date-fns";
import Database from "@tauri-apps/plugin-sql";
import { addRowInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
import { addRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { arithmeticOperatorsWithProfitsAndExpenses } from "@/Lib/functionsWithDb";
import { addRowInDaysProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { addRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { addRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
// ========================================================== //
export default function Add_Trainer(
    { onIsShowAddTrainer }: { onIsShowAddTrainer: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            subscriptionStart: state.subscriptionStart,
            subscriptionEnd: state.subscriptionEnd,
            logInInfo: state.logInInfo,
            sessionsCount: state.sessionsCount
        }
    }, shallowEqual);


    // Get trainer_Type info
    const [getFirstName, setGetFirstName] = useState<string | null>(null);
    const [getLastName, setGetLastName] = useState<string | null>(null);
    const [getPhone, setGetPhone] = useState<number | null>(0);
    const [getAddress, setGetAddress] = useState<string | null>(null);

    // Get subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState<string | null>(null);
    const [getPrice, setGetPrice] = useState<number | null>(null);
    const [getActiveSomeSessions, setGetActiveSomeSessions] = useState<number>(0);

    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);




    async function activeSomeSessions(trainerId: number) {
        if (!getActiveSomeSessions || !trainerId) return;

        const database = await Database.load("sqlite:app-gym-db.db");
        let dateNow: any = new Date(state.subscriptionStart as string).toISOString();


        for (let i = 0; i < getActiveSomeSessions; i++) {
            const query = `
                INSERT INTO activeSessions(
                    linkWithTrainer, accountId, sessionNumber, activationDate
                ) VALUES (?, ?, ?, ?)
            `;

            const values = [
                trainerId,
                state.logInInfo?.id,
                i,
                dateNow
            ];

            dispatch(addRowInAttendanceTable({
                date: dateNow,
                accountId: Number(state.logInInfo?.id),
                trainers: [trainerId]
            }) as any);

            await database.execute(query, values);
            dateNow = new Date(addDays(dateNow, 1)).toISOString();
        }


        incrementOrDecrementForTotalSessionsInAccount(Number(state.logInInfo?.id), getActiveSomeSessions, "increment");
    }

    async function saveTrainerInfo() {
        if (!isAllInfoComplete) return;
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إضافة ذلك المتدرب ؟",
            titleAfterClickOnOk: "تمت إضافة المتدرب بنجاح",
            funRunWhenClickOnOk: async function () {
                dispatch(removeSubscriptionStart());
                dispatch(removeSubscriptionEnd());
                dispatch(removeAllSessions());

                const getTraineInfos = await dispatch(
                    addRowInTrainersTable({
                        firstName: getFirstName,
                        lastName: getLastName,
                        phone: String(getPhone),
                        address: getAddress,
                        subscriptionName: getSubscriptionName,
                        sessionsCount: Number(state.sessionsCount),
                        price: Number(getPrice),
                        subscriptionStart: state.subscriptionStart,
                        subscriptionEnd: state.subscriptionEnd,
                        subscriptionStatus: statusTheSubscription,
                        lastRenewalSubscription: new Date().toISOString()
                    } as trainer_Type) as any
                ).unwrap();


                onIsShowAddTrainer(false);
                subscriptionPriceIsProfit();
                await activeSomeSessions(getTraineInfos.id);
            }
        })

    }

    async function subscriptionPriceIsProfit() {
        const database = await Database.load("sqlite:app-gym-db.db");
        const price = Number(getPrice || 0);

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
                itemName: addNewTrainer,
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
                itemName: addNewTrainer,
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
                itemName: addNewTrainer,
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
                itemName: addNewTrainer,
                category: "profit",
                price: price
            }) as any);
        }
    }

    function clickOnCancel() {
        onIsShowAddTrainer(false);
        dispatch(removeSubscriptionStart());
        dispatch(removeSubscriptionEnd());
        dispatch(removeAllSessions());
    }





    // This check the trainer_Type info is compolete or no
    const isAllInfoComplete = useMemo(function () {
        if (
            getFirstName != null &&
            getLastName != null &&
            getPhone != null &&
            getAddress != null &&
            getSubscriptionName != null &&
            state.sessionsCount != null &&
            getPrice != null &&
            state.subscriptionStart != null &&
            state.subscriptionEnd != null
        ) {
            return true
        } else {
            return false;
        }
    }, [getFirstName, getLastName, getPhone, getAddress, getSubscriptionName, state.sessionsCount,
        getPrice, state.subscriptionStart, state.subscriptionEnd
    ]);

    const statusTheSubscription = useMemo(() => {
        if (
            todayDate.getTime() >= new Date(state.subscriptionStart as any).getTime()
            &&
            todayDate.getTime() <= new Date(state.subscriptionEnd as any).getTime()
        ) {
            return statusIsActive;
        }
        else if (
            todayDate.getTime() < new Date(state.subscriptionStart as any).getTime()
        ) {
            return statusIsPending;
        }
        else {
            return statusIsFinished;
        }
    }, [state.subscriptionStart, state.subscriptionEnd, todayDate]);




    return <Popup_Form
        titel="إضافة متدرب"
        discription="الان, يمكنك إضافة متدرب جديد"
        classNameForParent="h-[84vh] flex flex-col justify-between"
        isSave={isAllInfoComplete}
        clickOnCancel={clickOnCancel}
        clickOnSaveBtn={saveTrainerInfo}
    >
        {/* Trainer info */}
        <div>
            <div className="flex items-center gap-2 text-(--thirdColor) font-bold mb-2">
                <UserRound size={23} />
                <p className="leading-none pt-0.5">المعلومات الشخصيه</p>
            </div>

            <Trainer_Info_Form
                onGetFirstName={setGetFirstName}
                onGetLastName={setGetLastName}
                onGetPhone={setGetPhone}
                onGetAddress={setGetAddress}
            />
        </div>

        {/* Subscription info */}
        <div>
            <div className="flex items-center gap-2 text-(--thirdColor) font-bold mb-5">
                <Presentation size={23} />
                <p className="leading-none pt-0.5">تفاصيل الاشتراك</p>
            </div>

            <Subscription_Info_Form
                onGetSubscriptionName={setGetSubscriptionName}
                onGetPrice={setGetPrice}
                onGetActiveSomeSessions={setGetActiveSomeSessions}
            />
        </div>

        <Date_Info_Form />
    </Popup_Form >
}