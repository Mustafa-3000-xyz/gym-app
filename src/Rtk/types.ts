import { accounte, activeSessionsList_Type, trainer } from "@/Pages/types";
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
    | "subscriptionEnd"

type updateOneColumnInAccount =
    | "name"
    | "age"
    | "password"
    | "type"
    | "permissions"
    | "profileImg"
    | "coverImg"
    | "totalForActiveSessions"


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
    values: {
        firstName?: string,
        lastName?: string,
        phone?: string,
        address?: string,
        subscriptionName?: string,
        sessionsCount?: number,
        price?: number,
        subscriptionStart?: string,
        subscriptionEnd?: string,
        subscriptionState?: string,
        activeSessionsList?: activeSessionsList_Type[],
    }
}

export interface updatePropertyInAccount_Type {
    id: string | number,
    column: updateOneColumnInAccount,
    value: any
}

export interface updateSomePropertiesInAccount_Type {
    id: number,
    values: {
        name?: string,
        age?: string | number,
        password?: string,
        type?: "manager" | "captain",
        profileImg?: string,
        coverImg?: string,
        workingHours?: number,
        permissions?: string[] | "fullAccess",
        totalForActiveSessions?: number
    }
}