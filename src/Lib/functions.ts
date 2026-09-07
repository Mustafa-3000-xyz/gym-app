import { accounte_Type } from "@/Pages/types";
import Swal from "sweetalert2";
import { alert_Type, checkThePermissionIsHere_Type, normalAlert_Type } from "./types";
import { updatePropertyInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import store from "@/Rtk/store";
import { updatePropertyInRowYearsInProfitsAndExpensesTable, updateSomePropertiesInRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { updatePropertyInRowInMonthsProfitsAndExpensesTable, updateSomePropertiesInRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { updatePropertyInRowInDaysProfitsAndExpensesTable, updateSomePropertiesInRowInDaysProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { arithmeticOperatorsWithProfitsAndExpenses_Type } from "@/Pages/types";
// ========================================================== //
export function normalAlert(
    {
        title,
        text = "",
        icon,
        runFunctionAfterSubmit
    }: normalAlert_Type
) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "تمام"
    }).then((result) => {
        if (result.isConfirmed || result.dismiss == "backdrop" || result.dismiss == "close" || result.dismiss == "timer" || result.dismiss == "esc") {
            runFunctionAfterSubmit?.();
        }
    });
}

export function alert({
    titleBeforeSubmit = "تحذير",
    titleAfterSubmit = "تمت العمليه",
    textBeforeSubmit,
    textAfterSubmit,
    iconStyleBeforeSubmit = "warning",
    runFunctionAfterSubmit,
    runFunctionAfterCancel
}: alert_Type) {
    Swal.fire({
        title: titleBeforeSubmit,
        text: textBeforeSubmit,
        icon: iconStyleBeforeSubmit,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم , انا متأكد",
        cancelButtonText: "إلغاء",
    }).then((result) => {
        if (result.isDismissed) {
            runFunctionAfterCancel?.();
        }

        if (result.isConfirmed && textAfterSubmit) {
            normalAlert({
                title: titleAfterSubmit,
                text: textAfterSubmit as string,
                icon: "success"
            });

            runFunctionAfterSubmit?.();
        }
        else if (result.isConfirmed) {
            runFunctionAfterSubmit?.();
        }
    });
}

export function theTodayDate(
    { startingInHalfNight }: { startingInHalfNight?: boolean }
) {
    const todayDate = new Date();

    if (startingInHalfNight) {
        todayDate.setHours(0, 0, 0, 0);
    }

    return todayDate;
}

export function incrementOrDecrementForTotalSessionsInAccount(
    accountId: number,
    sessionsCount: number,
    type: "increment" | "decrement",
) {
    const accounts = store.getState().accounts as accounte_Type[];
    const getAccount = accounts.find(ele => ele.id == accountId);


    switch (type) {
        case "increment":
            const result = Math.trunc(Math.abs(getAccount?.totalActiveSubscriptions as any)) + sessionsCount;

            store.dispatch(updatePropertyInRowInAccountsTable({
                id: accountId,
                column: "totalActiveSubscriptions",
                value: result
            }) as any);
            break;

        case "decrement":
            const result2 = Math.trunc(Math.abs(getAccount?.totalActiveSubscriptions as any)) - sessionsCount;

            store.dispatch(updatePropertyInRowInAccountsTable({
                id: accountId,
                column: "totalActiveSubscriptions",
                value: result2
            }) as any);
            break;
    }
}

// This function can check one permission or more in account
export function checkPermissionesInAccount(
    {
        accountId,
        permissionType,
    }: checkThePermissionIsHere_Type
) {
    const allAccounts = store.getState().accounts as accounte_Type[];
    const getPermissionsList = allAccounts.find(ele => ele.id == accountId)?.permissions;


    try {
        if (getPermissionsList == "fullAccess") {
            return true;
        }
        else if (permissionType) {
            return getPermissionsList?.includes(permissionType as any) && true;
        }
        else {
            return JSON.parse(getPermissionsList as any);
        }
    } catch (error) {

    }
}

export function arithmeticOperatorsWithProfitsAndExpenses(arithemtic: arithmeticOperatorsWithProfitsAndExpenses_Type) {
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

    // ================== //

    if (arithemtic.updateSomeColumns?.year.yearId) {
        store.dispatch(updateSomePropertiesInRowInYearsProfitsAndExpensesTable({
            id: Number(arithemtic.updateSomeColumns?.year.yearId),
            values: {
                profitsTotal: Number(arithemtic.updateSomeColumns?.year.profitsTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.year.profitsTotal),
                expensesTotal: Number(arithemtic.updateSomeColumns?.year.expensesTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.year.expensesTotal)
            }
        }) as any);
    }

    if (arithemtic.updateSomeColumns?.month.monthId) {
        store.dispatch(updateSomePropertiesInRowInMonthsProfitsAndExpensesTable({
            id: Number(arithemtic.updateSomeColumns?.month.monthId),
            values: {
                profitsTotal: Number(arithemtic.updateSomeColumns?.month.profitsTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.month.profitsTotal),
                expensesTotal: Number(arithemtic.updateSomeColumns?.month.expensesTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.month.expensesTotal)
            }
        }) as any);
    }

    if (arithemtic.updateSomeColumns?.day.dayId) {
        store.dispatch(updateSomePropertiesInRowInDaysProfitsAndExpensesTable({
            id: Number(arithemtic.updateSomeColumns?.day.dayId),
            values: {
                profitsTotal: Number(arithemtic.updateSomeColumns?.day.profitsTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.day.profitsTotal),
                expensesTotal: Number(arithemtic.updateSomeColumns?.day.expensesTotal) < 0 ? 0 : Number(arithemtic.updateSomeColumns?.day.expensesTotal)
            }
        }) as any);
    }
}