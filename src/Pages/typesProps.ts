import { attendanceDetails_Type, boxInfoInTrainersPage_Type, item_Type, trainer_Type } from "./types"
// ========================================================== //
export interface Subscription_Info_Form_Props {
    subscriptionStart: string | null,
    subscriptionEnd: string | null,
    onGetSubscriptionName: (x: string | null) => void,
    onGetPrice: (x: number | null) => void,
    onGetSessions: (x: number | null) => void,
    onGetActiveSomeSessions?: (x: number) => void
}

export interface Trainer_Info_Form_Props {
    onGetFirstName: (x: string | null) => void,
    onGetLastName: (x: string | null) => void,
    onGetPhone: (x: number | null) => void,
    onGetAddress: (x: string | null) => void,
    onGetTrainerType: (x: "man" | "women") => void
}

export interface Btn_Subscription_Renewal_Props {
    trainer: trainer_Type,
    subscriptionStart: string | null,
    isInfoComplete: boolean,
}

export interface Permissions_Props {
    permissionsList?: string[] | "fullAccess",
    onGetPermissionsList: (x: string[]) => void,
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
    onGetBoxInfo: (x: boxInfoInTrainersPage_Type) => void,
}

export interface Info_Box_For_Profits_Expenses_Props {
    id: number,
    mainTitle: any,
    title: string,
    profitsTotal: number,
    expensesTotal: number,
    target: number,
    targetType: "year" | "month" | "day",
    isHiddenTheWord?: boolean,
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
    yearId: number,
    monthId: number,
    countRowsInSlide: number,
    dayInfo: {
        id: null | number,
        title: null | number
    }
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

export interface Date_Info_Form_Props {
    sessions: number | null,
    onGetSubscriptionStart: (x: string | null) => void,
    onGetSubscriptionEnd: (x: string | null) => void
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