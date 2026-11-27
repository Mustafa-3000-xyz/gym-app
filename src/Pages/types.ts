export interface trainer_Type {
    id?: number,
    trainerType: "man" | "woman",
    firstName: string,
    lastName: string,
    phone: number,
    address: string,
    notes: string
    subscriptionName: string,
    sessionsCount: number,
    price: number,
    subscriptionStart: string,
    subscriptionEnd: string,
    subscriptionStatus: string,
    debt: number,
}

export interface activeSession_Type {
    id?: number,
    linkWithTrainer: number,
    accountId: number,
    sessionNumber: number,
    activationDate: Date | string
}

export interface accounte_Type {
    id?: number,
    name: string,
    age: number,
    password: string,
    type: "manager" | "captain",
    color: string,
    profileImg: string,
    coverImg: string,
    trainersTotal: number,
    numberOfActiveSessions: number,
    permissions: string[] | "fullAccess",
    numberOfDeletedTrainers: number,
}

export interface subscriptionsMenus_Type {
    id?: number,
    subscriptionName: string,
    sessionsCount: number,
    price: number
    isActive: "true" | "false"
}

export interface attendanceDetails_Type {
    id?: number,
    date: string, // yyyy/mm/dd
    accountId: number,
    trainers: number[],
}

export interface filter_Type {
    arrange: string,
    trainers: string,
    subscriptionType: string,
}

export interface sessionInActiveSeeionsTable {
    id?: number,
    linkWithTrainer: number,
    accountId: number,
    sessionNumber: number,
    activationDate: string
}

export interface sessionListForRead_Type {
    id?: number,
    accountId?: number,
    sessionNum: number,
    accountName: null | string | "removed",
    date: null | string,
    isUsingThisSession?: boolean
}

export interface subscriptionStatusBox_Type {
    type: "allSubscriptions" | "activeSubscriptions" | "pendingSubscriptions" | "finishedSubscriptions",
    total: number | number[],
    styleBgForIcon?: string,
    icon?: any,
}

export interface trainersTypeBox_Type {
    type: "allTrainers" | "men" | "women",
    total: number | number[],
    styleBgForIcon?: string,
    icon?: any,
}

export interface readSessions_Type {
    id?: number | null,
    sessionNumber: number,
    account: "removed" | accounte_Type | null,
    activationDate: string | null,
    usingThisSession: boolean
}

export interface yearsProfitsAndExpenses_Type {
    id?: number,
    yearNumber: number,
    profitsTotal: number,
    expensesTotal: number,
    target: number
}

export interface monthsProfitsAndExpenses_Type {
    id?: number,
    linkWithYear: number,
    monthName: string,
    monthNumber: number,
    profitsTotal: number,
    expensesTotal: number,
    target: number,
}

export interface daysProfitsAndExpenses_Type {
    id?: number,
    linkWithMonth: number,
    dayNumber: number,
    profitsTotal: number,
    expensesTotal: number,
    target: number,
}

export interface item_Type {
    id?: number,
    linkWithDay: number,
    additionTime: string,
    category: "profit" | "expense",
    itemName: string,
    price: number,
}

export interface reports_Type {
    id?: number,
    linkWithPerson: "bemo" | number,
    additionTime: string,
    title: string,
    description: string,
    reportedBy: string,
}

export interface settings_Type {
    rowsInTrainerTable: number,
    rowsInAttendanceTable: number,
    rowsInItemsTable: number,
    isDeleteSomeTrainersWhoNotRenwal: boolean | "true" | "false",
    isActiveMoreSessionInDay: boolean
}
// ==================================================================== //
export interface addYearsMonthesDaysAndItems_Type {
    year?: {
        profites?: number,
        expensess?: number,
    },
    month?: {
        profites?: number,
        expensess?: number,
    },
    day?: {
        profites?: number,
        expensess?: number,
    },
    item?: {
        id?: number,
        additionTime?: string,
        category?: "profit" | "expense",
        title?: string,
        price?: number,
    }
}

export interface editingProfitsOrExpensessInYearsMontesDaysAndItems_Type {
    year?: {
        id: number,
        profites?: number,
        expensess?: number,
    },
    month?: {
        id: number,
        profites?: number,
        expensess?: number,
    },
    day?: {
        id: number,
        profites?: number,
        expensess?: number,
    },
    item?: {
        id: number,
        additionTime?: string,
        category?: "profit" | "expense",
        title?: string,
        price?: number,
    }
}