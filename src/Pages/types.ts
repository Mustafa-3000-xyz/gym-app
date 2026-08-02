export interface trainer_Type {
    id?: number;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    subscriptionName: string;
    sessionsCount: number;
    price: number;
    subscriptionStart: string;
    subscriptionEnd: string;
    subscriptionStatus: string;
    lastRenewalSubscription: string;
}

export interface activeSession_Type {
    id?: number,
    linkWithTrainer: number,
    accountId: number,
    sessionNumber: number,
    activationDate: Date | string,
}

export interface accounte_Type {
    id?: number,
    name: string,
    age: number,
    password: string,
    type: "manager" | "captain",
    profileImg: string,
    coverImg: string,
    loginDate: Date | string,
    workingHours: number,
    totalActiveSubscriptions: number,
    permissions?: string[] | "fullAccess",
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
    date: Date | string,
    accountId: number,
    trainers: number[],
}

export interface filter_Type {
    arrange: string,
    subscriptionType: string,
}

export interface sessionListForRead_Type {
    account: accounte_Type | "removed",
    session: number,
    date?: null | any,
    isActive: boolean
}

export interface boxInfoInTrainersPage_Type {
    name: string,
    styleBgForIcon: string,
    icon: any,
    total: number,
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
    target: number
}

export interface daysProfitsAndExpenses_Type {
    id?: number,
    linkWithMonth: number,
    dayNumber: number,
    profitsTotal: number,
    expensesTotal: number,
    target: number
}

export interface item_Type {
    id?: number,
    linkWithDay: number,
    itemName: string,
    category: "profit" | "expense",
    price: number
}

export interface arithmeticOperatorsIds_Type {
    yearId: number,
    monthId: number,
    dayId: number
}

export interface arithmeticOperatorsWithOneColumn_Type {
    year: any,
    month: any,
    day: any
}

export interface arithmeticOperatorsWithSomeColumns_Type {
    year: {
        profitsTotal?: any,
        expensesTotal?: any
    },
    month: {
        profitsTotal?: any,
        expensesTotal?: any
    },
    day: {
        profitsTotal?: any,
        expensesTotal?: any
    }
}

export interface arithmeticOperatorsWithProfitsAndExpenses_Type {
    updateOneColumn?: {
        year?: {
            yearId: number,
            column: "profitsTotal" | "expensesTotal",
            value: number,
        },
        month?: {
            monthId: number,
            column: "profitsTotal" | "expensesTotal",
            value: number,
        },
        day?: {
            dayId: number
            column: "profitsTotal" | "expensesTotal",
            value: number,
        },
    }

    updateSomeColumns?: {
        year: {
            yearId: number,
            profitsTotal: number,
            expensesTotal: number
        },
        month: {
            monthId: number,
            profitsTotal: number,
            expensesTotal: number
        },
        day: {
            dayId: number
            profitsTotal: number,
            expensesTotal: number
        }
    }
}