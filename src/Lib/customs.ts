import { trainer } from "@/Pages/types";
import Swal from "sweetalert2";
import { alertSuccessType, alertType, allPermissions_Type } from "./types";
// ========================================================== //
export const styleDate = "yyyy/MM/dd";

// These for subscription state
export const stateIsActive = "active";
export const stateIsPending = "pending";
export const stateIsFinished = "finished";

// These for filter
export const fromOldToNew = "fromOldToNew";
export const fromNewToOld = "fromNewToOld";
export const allSubscriptions = "allSubscriptions";
export const activeSubscriptions = "activeSubscriptions";
export const pendingSubscriptions = "pendingSubscriptions";
export const finishedSubscriptions = "finishedSubscriptions";


export const allPermissions = [
    {
        title: "صفحة المتدربين",
        path: "trainer-page"
    },
    {
        title: "صفحة الحسابات",
        path: "accountes-page"
    },

    {
        title: "صفحة سجل الحضور",
        path: "attendance-recorde-page"
    },
    {
        title: "صفحة الارباح والمصروفات",
        path: "profits-and-expenses-page"
    },

    {
        title: "صفحة الاعدادات",
        path: "settings-page"
    },
    {
        title: "صفحة شرح البرنامج",
        path: "explain-app-page"
    }
] as allPermissions_Type[];


/*
    This function his jop is take trainer and return style subscription state,
    please look in [Search_Result] file or [All_Trainers] file
*/
export function styleForSubscriptionState(trainer: trainer) {
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


export function alertSuccess({
    mainTitle, text
}: alertSuccessType) {
    Swal.fire({
        title: mainTitle,
        text: text,
        icon: "success",
        confirmButtonText: "تمام"
    });
}

export function alert({
    titleBeforeClickOnOk,
    titleAfterClickOnOk,
    funRunWhenClickOnOk,
    showMessageAfterClickOnOk = true
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
            if (showMessageAfterClickOnOk) {
                alertSuccess({
                    mainTitle: "تمت العمليه",
                    text: titleAfterClickOnOk as string,
                });
            }

            funRunWhenClickOnOk();
        }
    });
}