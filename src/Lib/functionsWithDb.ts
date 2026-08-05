import { arithmeticOperatorsWithProfitsAndExpenses_Type } from "@/Pages/types";
import Database from "@tauri-apps/plugin-sql";
import store from "@/Rtk/store";
import { updatePropertyInRowYearsInProfitsAndExpensesTable, updateSomePropertiesInRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { updatePropertyInRowInMonthsProfitsAndExpensesTable, updateSomePropertiesInRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { updatePropertyInRowInDaysProfitsAndExpensesTable, updateSomePropertiesInRowInDaysProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
// ========================================================== //
export async function getAllAttendanceInSpecificDate(date: Date | string) {
    const database = await Database.load("sqlite:app-gym-db.db");

    return await database.select(
        "SELECT * FROM attendance WHERE date = ?",
        [date]
    );
}

export async function deleteRowsInActiveSessionsLinkedToTrainer(trainerId: number) {
    const database = await Database.load("sqlite:app-gym-db.db");

    const query = "DELETE FROM activeSessions WHERE linkWithTrainer = ?";
    const value = [trainerId];

    await database.execute(query, value);
}

export function arithmeticOperatorsWithProfitsAndExpenses(arithemtic: arithmeticOperatorsWithProfitsAndExpenses_Type) {
    // This for check if programer he want update one column in [year, month, day]
    if (
        arithemtic.updateOneColumn?.year?.yearId
        ||
        arithemtic.updateOneColumn?.month?.monthId
        ||
        arithemtic.updateOneColumn?.day?.dayId
    ) {
        if (arithemtic.updateOneColumn?.year?.yearId) {
            store.dispatch(updatePropertyInRowYearsInProfitsAndExpensesTable({
                id: arithemtic.updateOneColumn?.year.yearId,
                column: arithemtic.updateOneColumn?.year.column as any,
                value: Number(arithemtic.updateOneColumn?.year.value) < 0 ? 0 : Number(arithemtic.updateOneColumn?.year.value)
            }) as any);
        }

        if (arithemtic.updateOneColumn?.month?.monthId) {
            store.dispatch(updatePropertyInRowInMonthsProfitsAndExpensesTable({
                id: arithemtic.updateOneColumn?.month.monthId,
                column: arithemtic.updateOneColumn?.month.column as any,
                value: Number(arithemtic.updateOneColumn?.month.value) < 0 ? 0 : Number(arithemtic.updateOneColumn?.month.value)
            }) as any);
        }

        if (arithemtic.updateOneColumn?.day?.dayId) {
            store.dispatch(updatePropertyInRowInDaysProfitsAndExpensesTable({
                id: arithemtic.updateOneColumn?.day.dayId,
                column: arithemtic.updateOneColumn?.day.column as any,
                value: Number(arithemtic.updateOneColumn?.day.value) < 0 ? 0 : Number(arithemtic.updateOneColumn?.day.value)
            }) as any);
        }
    }


    else {
        store.dispatch(updateSomePropertiesInRowInYearsProfitsAndExpensesTable({
            id: Number(arithemtic.updateSomeColumns?.year.yearId),
            values: {
                profitsTotal: Number(arithemtic.updateSomeColumns?.year.profitsTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.year.profitsTotal),
                expensesTotal: Number(arithemtic.updateSomeColumns?.year.expensesTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.year.expensesTotal)
            }
        }) as any);

        store.dispatch(updateSomePropertiesInRowInMonthsProfitsAndExpensesTable({
            id: Number(arithemtic.updateSomeColumns?.month.monthId),
            values: {
                profitsTotal: Number(arithemtic.updateSomeColumns?.month.profitsTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.month.profitsTotal),
                expensesTotal: Number(arithemtic.updateSomeColumns?.month.expensesTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.month.expensesTotal)
            }
        }) as any);

        store.dispatch(updateSomePropertiesInRowInDaysProfitsAndExpensesTable({
            id: Number(arithemtic.updateSomeColumns?.day.dayId),
            values: {
                profitsTotal: Number(arithemtic.updateSomeColumns?.day.profitsTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.day.profitsTotal),
                expensesTotal: Number(arithemtic.updateSomeColumns?.day.expensesTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.day.expensesTotal)
            }
        }) as any);
    }
}