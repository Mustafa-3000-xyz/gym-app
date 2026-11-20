import Database from "@tauri-apps/plugin-sql";
import { activeSession_Type, addYearsMonthesDaysAndItems_Type, attendanceDetails_Type, daysProfitsAndExpenses_Type, monthsProfitsAndExpenses_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
import store from "@/Rtk/store";
import { addRowInYearsProfitsAndExpensesTable, updateِAnyPropertyInRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { listOfMonthes  } from "./constants";
import { addRowInMonthsProfitsAndExpensesTable, updateAnyPropertyInRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { addRowInDaysProfitsAndExpensesTable, updateAnyPropertyInRowInDaysProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { addRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { addRowInAttendanceTable, deleteRowInAttendanceTableById, updatePropertyInRowInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
// ========================================================== //
export async function systemForAddYearsMonthesDaysAndItems(
    date: Date, arithemtic: addYearsMonthesDaysAndItems_Type
) {
    if (!date) return;

    const db = await Database.load("sqlite:gym-app.db");

    const [getYear] = await db.select(`
        SELECT * from yearsProfitsAndExpenses WHERE yearNumber = ${date.getFullYear()}
    `) as yearsProfitsAndExpenses_Type[];

    const [getMonth] = await db.select(`
        SELECT * from monthsProfitsAndExpenses WHERE linkWithYear = ${getYear ? getYear.id : -1} 
        AND monthNumber = ${date.getMonth() + 1}
    `) as monthsProfitsAndExpenses_Type[];

    const [getDay] = await db.select(`
        SELECT * from daysProfitsAndExpenses WHERE linkWithMonth = ${getMonth ? getMonth.id : -1} 
        AND dayNumber = ${date.getDate()}
    `) as daysProfitsAndExpenses_Type[];



    // ================== //
    if (!getYear && !getMonth && !getDay) {
        const Themonth = listOfMonthes.find(ele => ele.monthNumber == date.getMonth() + 1);

        const year = await store.dispatch(addRowInYearsProfitsAndExpensesTable({
            yearNumber: Number(date.getFullYear()),
            target: 3000,
            profitsTotal: Number(arithemtic.year?.profites) || 0,
            expensesTotal: Number(arithemtic.year?.expensess) || 0,
        }) as any).unwrap() as yearsProfitsAndExpenses_Type;

        const month = await store.dispatch(addRowInMonthsProfitsAndExpensesTable({
            linkWithYear: Number(year.id),
            monthName: Themonth?.month as string,
            monthNumber: Number(Themonth?.monthNumber),
            target: 3000,
            profitsTotal: Number(arithemtic.month?.profites) || 0,
            expensesTotal: Number(arithemtic.month?.expensess) || 0,
        }) as any).unwrap() as monthsProfitsAndExpenses_Type;

        const day = await store.dispatch(addRowInDaysProfitsAndExpensesTable({
            linkWithMonth: Number(month.id),
            dayNumber: Number(date.getDate()),
            target: 3000,
            profitsTotal: Number(arithemtic.day?.profites) || 0,
            expensesTotal: Number(arithemtic.day?.expensess) || 0,
        }) as any).unwrap() as daysProfitsAndExpenses_Type;


        store.dispatch(addRowInItemsTable({
            linkWithDay: Number(day.id),
            additionTime: arithemtic.item?.additionTime as string,
            itemName: arithemtic.item?.title as string,
            category: arithemtic.item?.category as "profit",
            price: Number(arithemtic.item?.price),
        }) as any);
    }

    else if (getYear && !getMonth && !getDay) {
        const Themonth = listOfMonthes.find(ele => ele.monthNumber == date.getMonth() + 1);

        const month = await store.dispatch(addRowInMonthsProfitsAndExpensesTable({
            linkWithYear: Number(getYear.id),
            monthName: Themonth?.month as string,
            monthNumber: Number(Themonth?.monthNumber),
            target: 3000,
            profitsTotal: arithemtic.month?.profites || 0,
            expensesTotal: arithemtic.month?.expensess || 0,
        }) as any).unwrap() as monthsProfitsAndExpenses_Type;

        const day = await store.dispatch(addRowInDaysProfitsAndExpensesTable({
            linkWithMonth: Number(month.id),
            dayNumber: Number(date.getDate()),
            target: 3000,
            profitsTotal: arithemtic.day?.profites || 0,
            expensesTotal: arithemtic.day?.expensess || 0,
        }) as any).unwrap() as daysProfitsAndExpenses_Type;



        store.dispatch(updateِAnyPropertyInRowInYearsProfitsAndExpensesTable({
            id: Number(getYear.id),
            values: {
                ...(
                    arithemtic.year?.profites ?
                        { profitsTotal: Number(arithemtic.year?.profites) + Number(getYear.profitsTotal) }
                        :
                        { expensesTotal: Number(arithemtic.year?.expensess) + Number(getYear.expensesTotal) }
                )
            }
        }));

        store.dispatch(addRowInItemsTable({
            linkWithDay: Number(day),
            additionTime: arithemtic.item?.additionTime as string,
            category: arithemtic.item?.category as any,
            itemName: arithemtic.item?.title as string,
            price: Number(arithemtic.item?.price),
        }) as any);
    }

    else if (getYear && getMonth && !getDay) {
        const day = await store.dispatch(addRowInDaysProfitsAndExpensesTable({
            linkWithMonth: Number(getMonth.id),
            dayNumber: Number(date.getDate()),
            target: 3000,
            profitsTotal: arithemtic.day?.profites || 0,
            expensesTotal: arithemtic.day?.expensess || 0,
        }) as any).unwrap() as daysProfitsAndExpenses_Type;



        store.dispatch(updateِAnyPropertyInRowInYearsProfitsAndExpensesTable({
            id: Number(getYear.id),
            values: {
                ...(
                    arithemtic.year?.profites ?
                        { profitsTotal: Number(arithemtic.year?.profites) + Number(getYear.profitsTotal) }
                        :
                        { expensesTotal: Number(arithemtic.year?.expensess) + Number(getYear.expensesTotal) }
                )
            }
        }));

        store.dispatch(updateAnyPropertyInRowInMonthsProfitsAndExpensesTable({
            id: Number(getMonth.id),
            values: {
                ...(
                    arithemtic.month?.profites ?
                        { profitsTotal: Number(arithemtic.month?.profites) + Number(getMonth.profitsTotal) }
                        :
                        { expensesTotal: Number(arithemtic.month?.expensess) + Number(getMonth.expensesTotal) }
                )
            }
        }));

        store.dispatch(addRowInItemsTable({
            linkWithDay: Number(day.id),
            additionTime: arithemtic.item?.additionTime as string,
            itemName: arithemtic.item?.title as string,
            category: arithemtic.item?.category as any,
            price: Number(arithemtic.item?.price),
        }) as any);
    }

    else {
        store.dispatch(updateِAnyPropertyInRowInYearsProfitsAndExpensesTable({
            id: Number(getYear.id),
            values: {
                ...(
                    arithemtic.year?.profites ?
                        { profitsTotal: Number(arithemtic.year?.profites) + Number(getYear.profitsTotal) }
                        :
                        { expensesTotal: Number(arithemtic.year?.expensess) + Number(getYear.expensesTotal) }
                )
            }
        }));

        store.dispatch(updateAnyPropertyInRowInMonthsProfitsAndExpensesTable({
            id: Number(getMonth.id),
            values: {
                ...(
                    arithemtic.month?.profites ?
                        { profitsTotal: Number(arithemtic.month?.profites) + Number(getMonth.profitsTotal) }
                        :
                        { expensesTotal: Number(arithemtic.month?.expensess) + Number(getMonth.expensesTotal) }
                )
            }
        }));

        store.dispatch(updateAnyPropertyInRowInDaysProfitsAndExpensesTable({
            id: Number(getDay.id),
            values: {
                ...(
                    arithemtic.day?.profites ?
                        { profitsTotal: Number(arithemtic.day?.profites) + Number(getDay.profitsTotal) }
                        :
                        { expensesTotal: Number(arithemtic.day?.expensess) + Number(getDay.expensesTotal) }
                )
            }
        }));

        store.dispatch(addRowInItemsTable({
            linkWithDay: Number(getDay.id),
            additionTime: arithemtic.item?.additionTime as string,
            itemName: arithemtic.item?.title as string,
            category: arithemtic.item?.category as any,
            price: Number(arithemtic.item?.price),
        }) as any);
    }
}

export async function systemForAttendance(
    trainerId: number,
    accountId: number,
    attendDate: string | null,
    dateForRemoveTrainer: string | null
) {
    const db = await Database.load("sqlite:gym-app.db");
    const rows = await db.select("SELECT * FROM attendance WHERE date = ?", [attendDate]) as attendanceDetails_Type[];


    const searchAccount = rows.find(ele => ele.accountId == accountId);
    const searchTrainer = rows.find(function (ele) {
        const convertToList = (JSON.parse(ele.trainers as any)) as number[];
        const getTrainer = convertToList.find(id => id == trainerId);

        return getTrainer;
    });




    // Create row
    if (attendDate && !searchTrainer && !searchAccount) {
        store.dispatch(addRowInAttendanceTable({
            date: attendDate,
            accountId: accountId,
            trainers: [trainerId]
        }) as any);
    }
    // Editing row
    else if (attendDate && !searchTrainer && searchAccount) {
        store.dispatch(updatePropertyInRowInAttendanceTable({
            id: Number(searchAccount?.id),
            column: "trainers",
            value: [...JSON.parse(searchAccount.trainers as any), trainerId]
        }) as any);
    }
    // Remove from attendance or remove row
    else if (dateForRemoveTrainer) {
        const [row] = await db.select(
            "SELECT * FROM attendance WHERE date = ? AND accountId = ?;",
            [dateForRemoveTrainer, accountId]
        ) as attendanceDetails_Type[];


        const removeTrainer = (JSON.parse(row.trainers as any) as number[]).filter(id => id != trainerId);


        removeTrainer.length == 0 ?
            store.dispatch(deleteRowInAttendanceTableById(Number(row?.id)) as any)
            :
            store.dispatch(updatePropertyInRowInAttendanceTable({
                id: Number(row?.id),
                column: "trainers",
                value: removeTrainer
            }) as any);
    }
}

export async function getAllAttendanceInSpecificDate(date: string) {
    const db = await Database.load("sqlite:gym-app.db");


    return await db.select(
        "SELECT * FROM attendance WHERE date = ?",
        [date]
    );
}

export async function addRowInActiveSessionsTable(data: activeSession_Type) {
    const db = await Database.load("sqlite:gym-app.db");


    const query = `
        INSERT INTO activeSessions (
            linkWithTrainer, accountId, sessionNumber, activationDate
        ) VALUES(?, ?, ?, ?)
    `;

    const values = [
        data.linkWithTrainer,
        data.accountId,
        data.sessionNumber,
        data.activationDate
    ]

    const createRow = await db.execute(query, values);


    return {
        id: createRow.lastInsertId,
        ...data
    }
}

export async function deleteRowInActiveSessionsTableById(sessionId: number) {
    const db = await Database.load("sqlite:gym-app.db");

    await db.execute("DELETE FROM activeSessions WHERE id = ?", [sessionId]);

    return sessionId;
}

export async function deleteRowsInActiveSessionsTableToLinkedTheTrainerById(trainerId: number) {
    const db = await Database.load("sqlite:gym-app.db");

    await db.execute("DELETE FROM activeSessions WHERE linkWithTrainer = ?", [trainerId]);

    return trainerId;
}

export async function deleteAllRowsInActiveSessionsTable() {
    const db = await Database.load("sqlite:gym-app.db");

    await db.execute(`DELETE FROM activeSessions;`);

    return [];
}