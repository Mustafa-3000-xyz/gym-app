import { accounte, activeSessionsList_Type, subscriptionsMenus, trainer } from "@/Pages/types";
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
    | "workingHours"
    | "loginDate"
    | "logOutDate"

type updateOneColumnInSubscriptionsMenu =
    | "subscriptionName"
    | "sessionsCount"
    | "trainersTotal"
    | "price"
    | "isActive"



export interface store_Type {
    trainers: trainer[],
    accountes: accounte[],
    subscriptionsMenus: subscriptionsMenus[],
    trainerDetails: trainer | null,
    logInInfo: logInInfoSlice_Type | null
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
        workingHours?: number,
        loginDate?: Date | string,
        logOutDate?: Date | string
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
        permissions?: string[] | "fullAccess",
        totalForActiveSessions?: number,
        workingHours?: number,
        loginDate?: Date | string,
        logOutDate?: Date | string
    }
}

export interface updatePropertyInSubscriptionsMenu_Type {
    id: string | number,
    column: updateOneColumnInSubscriptionsMenu,
    value: any
}

export interface updateSomePropertiesInSubscriptionsMenu_Type {
    id: number,
    values: {
        subscriptionName?: string,
        sessionsCount?: number,
        trainersTotal?: number,
        price?: number,
        isActive?: "true" | "false"
    }
}

export interface logInInfoSlice_Type{
    id: number,
    type: "manager" | "captain",
}

export interface updatePropertyInDaysDetails_Type{
    id: number,
    column: "trainers",
    value: number[]
}