import { trainer } from "@/Pages/Trainers-page/types";
import Swal from "sweetalert2";
import { alertType } from "./types";
// ========================================================== //

// This for style date
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
                Swal.fire({
                    title: "تمت العمليه",
                    text: titleAfterClickOnOk,
                    icon: "success",
                    confirmButtonText: "تمام"
                });
            }

            funRunWhenClickOnOk();
        }
    });
}