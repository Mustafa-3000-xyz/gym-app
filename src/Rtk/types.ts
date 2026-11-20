import { accounte_Type, activeSession_Type, attendanceDetails_Type, daysProfitsAndExpenses_Type, item_Type, monthsProfitsAndExpenses_Type, reports_Type, settings_Type, subscriptionsMenus_Type, trainer_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
// ========================================================== //
export interface store_Type {
    // Db
    trainers?: trainer_Type[],
    activeSessions?: activeSession_Type[],
    accounts?: accounte_Type[],
    subscriptionsMenus?: subscriptionsMenus_Type[],
    attendance: attendanceDetails_Type[],
    yearsProfitsAndExpenses: yearsProfitsAndExpenses_Type[],
    monthsProfitsAndExpenses: monthsProfitsAndExpenses_Type[],
    daysProfitsAndExpenses: daysProfitsAndExpenses_Type[],
    items: item_Type[],
    reports: reports_Type[],
    settings: settings_Type

    // Ui
    logInInfo?: logInInfoSlice_Type | null,
    sideBar?: "show" | "hidden"
}
// ============================ //
// UPDATE ANY PROPERTY //
// ============================ //
export interface updateAnyPropertyInRowInTrainersTable_Type {
    id: number,
    values: {
        trainerType?: "man" | "woman",
        firstName?: string,
        lastName?: string,
        phone?: string,
        address?: string,
        notes?: string,
        subscriptionName?: string,
        sessionsCount?: number,
        price?: number,
        subscriptionStart?: string,
        subscriptionEnd?: string,
        subscriptionStatus?: string,
        debt?: number,
    }
}

export interface updateAnyPropertyInAccount_Type {
    id: number,
    values: {
        name?: string,
        age?: string | number,
        password?: string,
        type?: "manager" | "captain",
        color?: string,
        profileImg?: string,
        coverImg?: string,
        permissions?: string[] | "fullAccess",
        numberOfActiveSessions?: number,
        loginDate?: Date | string,
        numberOfDeletedTrainers?: number,
        trainersTotal?: number
    }
}

export interface updateAnyPropertyInRowInSubscriptionsMenusTable_Type {
    id: number,
    values: {
        subscriptionName?: string,
        sessionsCount?: number,
        price?: number,
        isActive?: "true" | "false"
    }
}

export interface updateِAnyPropertyInRowInYearsProfitsAndExpensesTable_Type {
    id: number,
    values: {
        profitsTotal?: number,
        expensesTotal?: number,
        target?: number
    }
}

export interface updateAnyPropertyInRowInMonthsProfitsAndExpensesTable_Type {
    id: number,
    values: {
        profitsTotal?: number,
        expensesTotal?: number,
        target?: number
    }
}

export interface updateAnyPropertyInRowInDaysProfitsAndExpensesTable_Type {
    id: number,
    values: {
        profitsTotal?: number,
        expensesTotal?: number,
        target?: number
    }
}

export interface updateAnyPropertyInRowInItemsTable_Type {
    id: number,
    values: {
        itemName?: string,
        category?: string,
        price?: number
    }
}

export interface updateAnyPropertyInRowInReportsTable_Type {
    id: number,
    values: {
        title?: string,
        description?: string,
        reportedBy?: string,
    }
}

export interface updateAnyPropertyInRowInSettingsTable_Type {
    rowsInTrainerTable?: number,
    rowsInAttendanceTable?: number,
    rowsInItemsTable?: number,
    isDeleteSomeTrainersWhoNotRenwal?: boolean,
    isActiveMoreSessionInDay?: boolean
}
// ============================ //
// UPDATE PROPERTY //
// ============================ //
export interface updatePropertyInAttendance_Type {
    id: number,
    column: "trainers",
    value: number[]
}

export interface logInInfoSlice_Type {
    id: number,
    type: "manager" | "captain",
    color: string,
}