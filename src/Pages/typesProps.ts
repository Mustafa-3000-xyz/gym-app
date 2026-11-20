import React from "react"
import { attendanceDetails_Type, subscriptionStatusBox_Type, item_Type, trainer_Type, trainersTypeBox_Type, yearsProfitsAndExpenses_Type, monthsProfitsAndExpenses_Type, daysProfitsAndExpenses_Type } from "./types"
// ========================================================== //
export interface Btn_Subscription_Renewal_Props {
    trainer: trainer_Type,
    subscriptionStart: string | null,
    isInfoComplete: boolean,
}

export interface Permissions_Props {
    accountId?: number,
    permissionsList?: string[] | "fullAccess",
    onGetPermissionsList?: (x: string[]) => void,
}

export interface Filter_For_Attendance_Props {
    filterType: number | "allTrainers",
    dayDetails: attendanceDetails_Type[],
    onGetTrainers: (x: trainer_Type[]) => void
    onChangeFilterType: (x: number | "allTrainers") => void,
}

export interface Date_Box_Props {
    onGetDatesTotal: (x: number) => void,
    onGetDayDetails: (x: attendanceDetails_Type[]) => void,
    onChangeFilterType: (x: number | "allTrainers") => void
}

export interface Filter_For_Trainers_Props {
    onGetTrainers: (x: trainer_Type[]) => void,
    onGetSubscriptionStatusBox: (x: subscriptionStatusBox_Type) => void,
    onGetTrainersTypeBox: (x: trainersTypeBox_Type) => void,
}

export interface Info_Box_For_Profits_Expenses_Props {
    id: number,
    mainTitle: any,
    title: string,
    profitsTotal: number,
    expensesTotal: number,
    target: number,
    targetType: "year" | "month" | "day",
    className?: string,
    styleBoxWhenSelect?: string | null,
    monthNumber?: number,
    onGetBoxInfo: (x: {
        id: number,
        title: number | string,
        monthNumber?: number
    }) => void
}

export interface Layers_Date_Props {
    onGetYearInfo: (x: { id: null | number, title: null | number }) => void,
    onGetMonthInfo: (x: { id: null | number, title: null | string, monthNumber: null | number }) => void,
    onGetDayInfo: (x: { id: null | number, title: null | number }) => void,
}

export interface Table_For_Read_Profits_Expenses_Props {
    layersIds: {
        yearId: number,
        monthId: number,
        dayId: number,
    }
    countRowsInSlide: number,
}

export interface Add_Item_Props {
    yearId: number,
    monthId: number,
    dayInfo: {
        id: number,
        title: number
    }
    getProfitsTotalInYear: number,
    getProfitsTotalInMonth: number,
    getProfitsTotalInDay: number,
    getExpensesTotalInYear: number,
    getExpensesTotalInMonth: number,
    getExpensesTotalInDay: number,
    onIsEditing: (x: boolean) => void,
}

export interface Subscriptions_Menu_Props {
    onGetSubscriptionName: (x: string) => void,
    onGetSesions: (x: number) => void,
    onGetPrice: (x: number) => void
}

export interface Cover_Img_Props {
    accountId: number,
    coverImgSrc: string,
    isChangeCoverImg: boolean
}

export interface The_Setting_Props {
    title: string,
    discription?: string,
    typeSetting: {
        question?: {
            value: undefined | boolean,
            onGetValue: (x: boolean) => void
        },
        element?: any,
    }
}

export interface Item_Details_Props {
    yearId: number,
    monthId: number,
    dayId: number,
    profitsTotalInYear: number,
    profitsTotalInMonth: number,
    profitsTotalInDay: number,
    expensesTotalInYear: number,
    expensesTotalInMonth: number,
    expensesTotalInDay: number,
    mainItem: item_Type,
    onIsShowItemDetails: (x: boolean) => void
}

export interface Subscription_Info_Form_Props {
    subscriptionName?: string,
    price?: number,
    sessions?: number,
    subscriptionStart: string | null,
    subscriptionEnd: string | null,
    debt?: number,
    onGetSubscriptionName: (x: {
        value: string,
        isTrue: boolean
    }) => void,
    onGetPrice: (x: {
        value: number,
        isTrue: boolean
    }) => void,
    onGetSessions: (x: {
        value: number,
        isTrue: boolean
    }) => void,
    onGetDebt: (x: number) => void,
    onGetActiveSomeSessions?: (x: number) => void,
}

export interface Trainer_Info_Form_Props {
    trainerType?: "man" | "woman",
    firstName?: string,
    lastName?: string,
    phone?: number,
    address?: string,
    notes?: string,

    onGetTrainerType: (x: "man" | "woman") => void,
    onGetFirstName: (x: {
        value: string,
        isTrue: boolean
    }) => void,
    onGetLastName: (x: {
        value: string,
        isTrue: boolean
    }) => void,
    onGetPhone: (x: {
        value: number,
        isTrue: boolean
    }) => void,
    onGetAddress: (x: {
        value: string,
        isTrue: boolean
    }) => void,
    onGetNotes: (x: string) => void
}

export interface Date_Info_Form_Props {
    SubscriptionStart?: string,
    SubscriptionEnd?: string,
    sessions: number | null,
    subscriptionStatus?: string,
    onGetSubscriptionStart: (x: string | null) => void,
    onGetSubscriptionEnd: (x: string | null) => void
}

export interface Box_for_setting_Props {
    title: string,
    children: React.ReactNode,
    discription?: string,
}

export interface Sessions_Props {
    trainerId: number,
    sessionsCount: number,
    subscriptionStatus: string,
}


export interface Btn_Cancel_Subscription_Props {
    trainerId: number,
    subscriptionPrice: number,
    pay: number,
}

export interface Btn_Delete_Trainer_Props {
    trainerId: number,
    subscriptionPrice: number,
    pay: number,
}

export interface Years_Box_Props {
    allYears: yearsProfitsAndExpenses_Type[],
    onGetYearInfo: (x: { id: number, yearNumber: number }) => void,
}

export interface Months_Layers_Props {
    yearId: number | null,
    allMonths: monthsProfitsAndExpenses_Type[],
    onGetMonthInfo: (x: { id: number, monthName: string, monthNumber: number }) => void,
}

export interface Days_Layers_Props {
    monthInfo: {
        id: number | null,
        number: number | null,
    }
    allDays: daysProfitsAndExpenses_Type[],
    onGetDayInfo: (x: { id: number, dayNumber: number }) => void,
}