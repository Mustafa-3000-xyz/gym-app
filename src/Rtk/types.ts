import { accounte_Type, attendanceDetails_Type, daysProfitsAndExpenses_Type, item_Type, monthsProfitsAndExpenses_Type, subscriptionsMenus_Type, trainer_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
// ========================================================== //
export interface store_Type {
    // Db
    trainers?: trainer_Type[],
    accountes?: accounte_Type[],
    subscriptionsMenus?: subscriptionsMenus_Type[],
    attendance: attendanceDetails_Type[],
    yearsProfitsAndExpenses: yearsProfitsAndExpenses_Type[],
    monthsProfitsAndExpenses: monthsProfitsAndExpenses_Type[],
    daysProfitsAndExpenses: daysProfitsAndExpenses_Type[],
    items: item_Type[],

    // Ui
    trainerDetails?: trainer_Type | null,
    logInInfo?: logInInfoSlice_Type | null,
    sessionsCount?: number,
    subscriptionStart?: string | null,
    subscriptionEnd?: string | null,
    sideBar?: boolean
}

// ============================ //
// UPDATE SOME PROPERTIES //
// ============================ //
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
        subscriptionStatus?: string,
        lastRenewalSubscription?: Date | string
    }
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

export interface updateSomePropertiesInSubscriptionsMenu_Type {
    id: number,
    values: {
        subscriptionName?: string,
        sessionsCount?: number,
        price?: number,
        isActive?: "true" | "false"
    }
}

export interface updateSomePropertiesInRowInItemsTable_Type {
    id: number,
    values: {
        itemName?: string,
        category?: "profit" | "expense",
        price?: number,
    }
}

export interface updateSomePropertiesInRowInYearsProfitsAndExpensesTable_Type {
    id: number,
    values: {
        profitsTotal: number,
        expensesTotal: number
    }
}

export interface updateSomePropertiesInRowInMonthsProfitsAndExpensesTable_Type {
    id: number,
    values: {
        profitsTotal: number,
        expensesTotal: number
    }
}

export interface updateSomePropertiesInRowInDaysProfitsAndExpensesTable_Type {
    id: number,
    values: {
        profitsTotal: number,
        expensesTotal: number
    }
}

// ============================ //
// UPDATE PROPERTY //
// ============================ //
export interface updatePropertyInTrainer_Type {
    id: string | number,
    column: "firstName" | "lastName" | "phone" | "address" | "subscriptionName" |
    "sessionsCount" | "price" | "subscriptionStart" | "subscriptionEnd" | "subscriptionStatus" |"lastRenewalSubscription",
    value: any
}

export interface updatePropertyInAccount_Type {
    id: string | number,
    column: | "name" | "age" | "password" | "type" | "permissions" | "profileImg" | "coverImg" |
    "totalActiveSubscriptions" | "workingHours" | "loginDate",
    value: any
}

export interface updatePropertyInSubscriptionsMenu_Type {
    id: string | number,
    column: | "subscriptionName" | "sessionsCount" | "price" | "isActive",
    value: any
}

export interface updatePropertyInAttendance_Type {
    id: number,
    column: "trainers",
    value: number[]
}

export interface updatePropertyInRowYearsProfetsAndExpensesTable_Type {
    id: number,
    column: "target" | "profitsTotal" | "expensesTotal",
    value: number
}

export interface updatePropertyInRowInMonthsProfetsAndExpensesTable_Type {
    id: number,
    column: "target" | "profitsTotal" | "expensesTotal",
    value: number
}

export interface updatePropertyInRowInDaysProfetsAndExpensesTable_Type {
    id: number,
    column: "target" | "profitsTotal" | "expensesTotal",
    value: number
}

// ============================ //
// ANOTHER TYPES //
// ============================ //
export interface logInInfoSlice_Type {
    id: number,
    type: "manager" | "captain",
}