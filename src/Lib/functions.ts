import { accounte, trainer } from "@/Pages/types";
import Swal from "sweetalert2";
import { alertType, checkThePermissionIsHere_Type, normalAlert_Type } from "./types";
import { stateIsActive, stateIsPending } from "./constants";
import store from "@/Rtk/store";
import { updatePropertyInRowInAccountsTable, updateSomePropertiesInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
export function styleForSubscriptionState(trainer: trainer) {
    /*
        This function his jop is take trainer and return style subscription state,
        please look in [Search_Result] file or [All_Trainers] file
    */

    const styleObj = {
        style: "",
        title: ""
    }


    if (trainer.subscriptionState == stateIsActive) {
        styleObj.style = "bg-emerald-100 text-emerald-500";
        styleObj.title = "مفعل";
    }
    else if (trainer.subscriptionState == stateIsPending) {
        styleObj.style = "bg-amber-100 text-amber-500";
        styleObj.title = "معلق";
    }
    else {
        styleObj.style = "bg-red-100 text-red-500";
        styleObj.title = "منتهي";
    }


    return styleObj;
}

export function normalAlert(
    {
        title,
        text = "",
        icon
    }: normalAlert_Type
) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "تمام"
    } as any);
}

export function alert({
    titleBeforeClickOnOk,
    titleAfterClickOnOk,
    funRunWhenClickOnOk,
}: alertType): void {
    Swal.fire({
        title: "!! تحذير",
        text: titleBeforeClickOnOk,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم , انا متأكد",
        cancelButtonText: "إلغاء",
    }).then((result) => {
        if (result.isConfirmed) {
            if (titleAfterClickOnOk) {
                normalAlert({
                    title: "تمت العمليه",
                    text: titleAfterClickOnOk as string,
                    icon: "success"
                });
            }

            funRunWhenClickOnOk();
        }
    });
}

export function logOutFromOldAccount(oldAccountId: number) {
    const state = store.getState().accountes as accounte[];
    const theAccount = state.find(ele => ele.id == oldAccountId);


    if (!theAccount) return;

    const loginTime = new Date(theAccount?.loginDate as any).getTime();
    const logOutTime = new Date().getTime();

    const convertToHours = (logOutTime - loginTime) / (1000 * 60 * 60);
    const totalForHours = (theAccount?.workingHours || 0) + convertToHours;


    store.dispatch(updateSomePropertiesInRowInAccountsTable({
        id: oldAccountId,
        values: {
            loginDate: "",
            workingHours: Math.trunc(totalForHours)
        }
    }) as any);
}

export function theTodayDate(
    { startingIn12Houre }: { startingIn12Houre?: boolean }
) {
    const todayDate = new Date();

    if (startingIn12Houre) {
        todayDate.setHours(0, 0, 0, 0);
    }

    return todayDate;
}

export function incrementOrDecrementForTotalSessionsInAccount(
    accountId: number,
    sessionsCount: number,
    type: "increment" | "decrement",
) {
    const accountes = store.getState().accountes as accounte[];
    const getAccount = accountes.find(ele => ele.id == accountId);


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

export function checkThePermissionIsHere(
    {
        accountId,
        permissionType,
        isGetAllPermissions
    }: checkThePermissionIsHere_Type
) {
    const allAccounts = store.getState().accountes as accounte[];
    const getPermissionsList = allAccounts.find(ele => ele.id == accountId)?.permissions;

    try {
        if (isGetAllPermissions) {
            return getPermissionsList == "fullAccess" ? "fullAccess" : JSON.parse(getPermissionsList as any);
        }

        if (getPermissionsList == "fullAccess") {
            return true;
        }
        else {
            return getPermissionsList?.includes(permissionType as any) ? true : false;
        }
    }
    catch (err) {
        console.log(err);
    }
}

export async function getAllAttendanceInSpecificDate(date: Date | string) {
    const database = await Database.load("sqlite:app-gym-db.db");

    return await database.select(
        "SELECT * FROM attendance WHERE date = ?",
        [date]
    );
}