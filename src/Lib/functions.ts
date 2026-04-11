import { trainer } from "@/Pages/types";
import Swal from "sweetalert2";
import { alertSuccessType, alertType } from "./types";
import { stateIsActive, stateIsPending } from "./constants";
// ========================================================== //
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
    mainTitle, text = ""
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