import { accounte } from "@/Pages/Accountes-page/types";
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

type updateOneColumnInAccount =
    | "name"
    | "age"
    | "password"
    | "type"
    | "permissions"
    | "img"


export interface store_Type {
    trainers: trainer[],
    accountes: accounte[]
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

export interface updatePropertyInAccount_Type {
    id: string | number,
    column: updateOneColumnInAccount,
    value: any
}

export interface updateSomePropertiesInAccount_Type {
    id: number,
    accounte: accounte
}