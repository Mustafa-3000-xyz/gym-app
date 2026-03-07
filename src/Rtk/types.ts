import { trainer } from "@/Pages/Trainers-page/types";
// ========================================================== //
type updateOneColumnInTrainer =
    | "subscriptionState"
    | "activeSessionsList"
    | "firstName"
    | "lastName"
    | "phone"
    | "address"
    | "subscriptionName"
    | "sessionsCount"
    | "price"
    | "subscriptionStart"
    | "subscriptionEnd";

// type updateOneColumnInDays =
//     | "theDay"
//     | "attendanceAndCaptainsList"


export interface store_Type{
    trainers: trainer[]
}

export interface updatePropertyInTrainer_Type {
    trainerId: string | number,
    column: updateOneColumnInTrainer,
    value: any
}

export interface updateSomePropertiesInTrainer_Type {
    trainerId: number,
    trainer: trainer
}