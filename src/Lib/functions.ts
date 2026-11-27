import { accounte_Type } from "@/Pages/types";
import Swal from "sweetalert2";
import { alert_Type, checkThePermissionIsHere_Type, normalAlert_Type } from "./types";
import { updateAnyPropertyInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import store from "@/Rtk/store";
// ========================================================== //
export function normalAlert(
    {
        title,
        text = "",
        icon,
        runFunctionAfterConfirm
    }: normalAlert_Type
) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "تمام"
    }).then((result) => {
        if (result.isConfirmed || result.dismiss == "backdrop" || result.dismiss == "close" || result.dismiss == "timer" || result.dismiss == "esc") {
            runFunctionAfterConfirm?.();
        }
    });
}

export function customAlert({
    titleBeforeSubmit = "تحذير",
    titleAfterSubmit = "تمت العمليه",
    textBeforeSubmitAction,
    textAfterSubmitAction = undefined,
    isShowDeniedBtn = false,
    iconStyleBeforeSubmit = "warning",
    runFunctionAfterConfirm,
    runFunctionAfterDenied,
    runFunctionAfterClickOnCancel
}: alert_Type) {
    Swal.fire({
        title: titleBeforeSubmit,
        text: textBeforeSubmitAction,
        icon: iconStyleBeforeSubmit,
        showCancelButton: true,
        showDenyButton: isShowDeniedBtn,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "نعم",
        denyButtonText: "لا",
        cancelButtonText: "إلغاء",
    }).then((result) => {
        // This for cancel btn
        if (result.isDismissed) {
            runFunctionAfterClickOnCancel?.();
        }

        // This for yes btn with message
        if (result.isConfirmed && textAfterSubmitAction) {
            normalAlert({
                title: titleAfterSubmit,
                text: textAfterSubmitAction as string,
                icon: "success"
            });

            runFunctionAfterConfirm?.();
        }
        else if (result.isConfirmed) {
            runFunctionAfterConfirm?.();
        }

        // This for no btn with message
        if (result.isDenied && textAfterSubmitAction) {
            normalAlert({
                title: titleAfterSubmit,
                text: textAfterSubmitAction as string,
                icon: "success"
            });

            runFunctionAfterDenied?.();
        }
        else if (result.isDenied) {
            runFunctionAfterDenied?.();
        }
    });
}

export function incrementOrDecrementForTotalSessionsInAccount(
    accountId: number,
    sessionsCount: number,
    type: "increment" | "decrement",
) {
    const accounts = store.getState().accounts as accounte_Type[];
    const getAccount = accounts.find(ele => ele.id == accountId);


    if (type == "increment") {
        const result = Math.trunc(Number(getAccount?.numberOfActiveSessions)) + sessionsCount;

        store.dispatch(updateAnyPropertyInRowInAccountsTable({
            id: accountId,
            values: {
                numberOfActiveSessions: result
            }
        }) as any);
    }
    else {
        const result = Math.trunc(Math.abs(getAccount?.numberOfActiveSessions as any)) - sessionsCount;

        store.dispatch(updateAnyPropertyInRowInAccountsTable({
            id: accountId,
            values: {
                numberOfActiveSessions: result
            }
        }) as any);
    }
}

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

export async function addTrainerInTrash(accountId: number, count: number) {
    const accounts = store.getState().accounts as accounte_Type[];
    const getAccount = accounts.find(ele => ele.id == accountId);

    const result = Math.trunc(Number(getAccount?.numberOfDeletedTrainers)) + count;


    store.dispatch(updateAnyPropertyInRowInAccountsTable({
        id: Number(accountId),
        values: {
            numberOfDeletedTrainers: result
        }
    }) as any);
}