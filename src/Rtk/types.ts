import { accounte, attendanceDetails, subscriptionsMenus, trainer } from "@/Pages/types";
// ========================================================== //
type updateOneColumnInTrainer =
    | "subscriptionState"
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
    | "totalActiveSubscriptions"
    | "workingHours"
    | "loginDate"

type updateOneColumnInSubscriptionsMenu =
    | "subscriptionName"
    | "sessionsCount"
    | "price"
    | "isActive"


export interface updatePropertyInTrainer_Type {
    id: string | number,
    column: updateOneColumnInTrainer,
    value: any
}

export interface updateSomePropertiesInTrainer_Type {
    id: number,
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
        workingHours?: number,
        loginDate?: Date | string,
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
        totalActiveSubscriptions?: number,
        workingHours?: number,
        loginDate?: Date | string,
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
        price?: number,
        isActive?: "true" | "false"
    }
}

export interface updatePropertyInAttendance_Type {
    id: number,
    column: "trainers",
    value: number[]
}



export interface store_Type {
    // Db
    trainers?: trainer[],
    accountes?: accounte[],
    subscriptionsMenus?: subscriptionsMenus[],
    attendance: attendanceDetails[],

    // Ui
    trainerDetails?: trainer | null,
    logInInfo?: logInInfoSlice_Type | null,
    sessionsCount?: number,
    subscriptionStart?: string | null,
    subscriptionEnd?: string | null
}

export interface logInInfoSlice_Type {
    id: number,
    type: "manager" | "captain",
}