import { CircleUserRound, Presentation, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { addRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import Trainer_Info_Form from "../Forms/Trainer_Info_Form";
import Subscription_Info_Form from "../Forms/Subscription_Info_Form";
import { alert, arithmeticOperatorsWithProfitsAndExpenses, incrementOrDecrementForTotalSessionsInAccount } from "@/Lib/functions";
import { addNewTrainer, maxTargetInDay, maxTargetInMonth, maxTargetInYear, monthsWithHisDays, statusIsActive, statusIsFinished, statusIsPending } from "@/Lib/constants";
import Date_Info_Form from "../Forms/Date_Info_Form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { attendanceDetails_Type, daysProfitsAndExpenses_Type, monthsProfitsAndExpenses_Type, trainer_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { store_Type } from "@/Rtk/types";
import { addDays } from "date-fns";
import Database from "@tauri-apps/plugin-sql";
import { addRowInAttendanceTable, updatePropertyInRowInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
import { addRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { getAllAttendanceInSpecificDate } from "@/Lib/functionsWithDb";
import { addRowInDaysProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { addRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { addRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { addRowInActiveSessionsTableAndLinkedTheTrainer } from "@/Rtk/Slices/Db-slices/activeSessionsSlice";
import { updatePropertyInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
// ========================================================== //
export default function Add_Trainer(
    { onIsShowAddTrainer }: { onIsShowAddTrainer: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            accounts: state.accounts
        }
    }, shallowEqual);


    // Get trainer_Type info
    const [getFirstName, setGetFirstName] = useState<string | null>(null);
    const [getLastName, setGetLastName] = useState<string | null>(null);
    const [getPhone, setGetPhone] = useState<number | null>(0);
    const [getAddress, setGetAddress] = useState<string | null>(null);
    const [getTrainerType, setGetTrainerType] = useState<"man" | "women">("man");

    // Get subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState<string | null>(null);
    const [getPrice, setGetPrice] = useState<number | null>(null);
    const [getSessions, setGetSessions] = useState<number | null>(null);
    const [getActiveSomeSessions, setGetActiveSomeSessions] = useState<number>(0);


    const [getSubscriptionStart, setGetSubscriptionStart] = useState<string | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<string | null>(null);



    const todayDate = useMemo(() => new Date(), []);

    const statusTheSubscription = useMemo(() => {
        if (
            todayDate.getTime() >= new Date(getSubscriptionStart as any).getTime()
            &&
            todayDate.getTime() < new Date(getSubscriptionEnd as any).getTime()
        ) {
            return statusIsActive;
        }
        else if (todayDate.getTime() < new Date(getSubscriptionStart as any).getTime()) {
            return statusIsPending;
        }
        else {
            return statusIsFinished;
        }
    }, [getSubscriptionStart, getSubscriptionEnd, todayDate]);

    // This check the trainer info is compolete or no
    const isAllInfoComplete = useMemo(function () {
        if (
            getFirstName != null &&
            getLastName != null &&
            getPhone != null &&
            getAddress != null &&
            getSubscriptionName != null &&
            getSessions != null &&
            getPrice != null &&
            getSubscriptionStart != null &&
            getSubscriptionEnd != null
        ) {
            return true
        } else {
            return false;
        }
    }, [getFirstName, getLastName, getPhone, getAddress, getSubscriptionName, getSessions,
        getPrice, getSubscriptionStart, getSubscriptionEnd
    ]);




    async function activeSomeSessions(trainerId: number) {
        if (!getActiveSomeSessions || !trainerId) return;

        let dateNow: any = new Date(getSubscriptionStart as any).toISOString();


        for (let i = 0; i < getActiveSomeSessions; i++) {
            const getAllAttendanceDetails = await getAllAttendanceInSpecificDate(dateNow) as attendanceDetails_Type[];
            const findTrainer = getAllAttendanceDetails.find(ele => ele.trainers.includes(trainerId as any));
            const findAccount = getAllAttendanceDetails.find(ele => ele.accountId == state.logInInfo?.id);

            /*
                If the account not exsist in today date and the trainer not exsist in today date,
                create new row
            */
            if (!findAccount && !findTrainer) {
                const getAccountId = await dispatch(addRowInAttendanceTable({
                    date: dateNow,
                    accountId: Number(state.logInInfo?.id),
                    trainers: [Number(trainerId)]
                }) as any).unwrap() as attendanceDetails_Type;

                dispatch(addRowInActiveSessionsTableAndLinkedTheTrainer({
                    linkWithTrainer: trainerId,
                    accountId: Number(getAccountId.accountId),
                    sessionNumber: i,
                    activationDate: dateNow
                }) as any);
            }

            /*
                If the account is exsist in today date and the trainer not exsist in today date,
                add this trainer in trainers array
            */
            else if (findAccount && !findTrainer) {
                dispatch(updatePropertyInRowInAttendanceTable({
                    id: Number(findAccount.id),
                    column: "trainers",
                    value: [...JSON.parse(findAccount.trainers as any), Number(trainerId)]
                }) as any);

                dispatch(addRowInActiveSessionsTableAndLinkedTheTrainer({
                    linkWithTrainer: trainerId,
                    accountId: Number(findAccount.accountId),
                    sessionNumber: i,
                    activationDate: dateNow
                }) as any);
            }


            dateNow = new Date(addDays(dateNow, 1)).toISOString();
        }


        incrementOrDecrementForTotalSessionsInAccount(Number(state.logInInfo?.id), getActiveSomeSessions, "increment");
    }

    async function saveTrainerInfo() {
        if (!isAllInfoComplete) return;



        alert({
            textBeforeSubmit: "هل تريد بالفعل إضافة ذلك المتدرب ؟",
            textAfterSubmit: "تمت إضافة المتدرب بنجاح",
            runFunctionAfterSubmit: async function () {
                dispatch(updatePropertyInRowInAccountsTable({
                    id: Number(state.logInInfo?.id),
                    column: "trainersTotal",
                    value: Number(state.accounts?.find(ele => ele.id == state.logInInfo?.id)?.trainersTotal) + 1
                }) as any);

                const getTraineInfos = await dispatch(
                    addRowInTrainersTable({
                        firstName: getFirstName,
                        lastName: getLastName,
                        phone: String(getPhone),
                        address: getAddress,
                        trainerType: getTrainerType,
                        subscriptionName: getSubscriptionName,
                        sessionsCount: getSessions,
                        price: Number(getPrice),
                        subscriptionStart: getSubscriptionStart,
                        subscriptionEnd: getSubscriptionEnd,
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
        const database = await Database.load("sqlite:gym-app.db");
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




    return <Popup_Form
        popupFormInfo={{
            title: "إضافة متدرب",
            discription: "الان, يمكنك إضافة متدرب جديد",
            icon: <CircleUserRound
                size={43}
                strokeWidth={1.7}
                className={`
                    ${
                        !getSubscriptionStart || !getSubscriptionEnd ? "!text-black" : ""
                    }
                    
                    ${statusTheSubscription == statusIsActive ?
                        "text-emerald-500"
                        :
                        statusTheSubscription == statusIsPending ? "text-amber-500" : "text-red-500"
                    }
                `}
            />
        }}
        classNameForParent="h-[92vh] w-[93vw] flex flex-col justify-between"
        isSave={isAllInfoComplete}
        clickOnCancel={() => onIsShowAddTrainer(false)}
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
                onGetTrainerType={setGetTrainerType}
            />
        </div>

        {/* Subscription info */}
        <div>
            <div className="flex items-center gap-2 text-(--thirdColor) font-bold mb-5">
                <Presentation size={23} />
                <p className="leading-none pt-0.5">تفاصيل الاشتراك</p>
            </div>

            <Subscription_Info_Form
                subscriptionStart={getSubscriptionStart}
                subscriptionEnd={getSubscriptionEnd}
                onGetSubscriptionName={setGetSubscriptionName}
                onGetPrice={setGetPrice}
                onGetSessions={setGetSessions}
                onGetActiveSomeSessions={setGetActiveSomeSessions}
            />
        </div>

        <Date_Info_Form
            sessions={getSessions}
            onGetSubscriptionStart={setGetSubscriptionStart}
            onGetSubscriptionEnd={setGetSubscriptionEnd}
        />
    </Popup_Form >
}