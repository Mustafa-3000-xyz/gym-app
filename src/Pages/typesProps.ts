import { attendanceDetails_Type, boxInfoInTrainersPage_Type, filter_Type, trainer_Type } from "./types"

export interface Subscription_Info_Form_Props {
    onGetSubscriptionName: (x: string | null) => void,
    onGetPrice: (x: number | null) => void,
    onGetActiveSomeSessions?: (x: number) => void
}

export interface Date_Info_Props {
    onGetSubscriptionStart: (x: Date) => void,
    onGetSubscriptionEnd: (x: Date) => void,
}

export interface End_Date_Picker_Props {
    dateStart: Date,
    getDate: (x: Date | null) => void
}

export interface Trainer_Info_Form_Props {
    onGetFirstName: (x: string | null) => void,
    onGetLastName: (x: string | null) => void,
    onGetPhone: (x: number | null) => void,
    onGetAddress: (x: string | null) => void,
}

export interface Btn_Slide_Props {
    index: number,
    currentSlide: number,
    onGetIndexBtn: (x: number) => void
}

export interface Btn_Filter_Props {
    trainersList: trainer_Type[],
    onGetFilter: (x: filter_Type) => void,
    onGetTrainerListAfterFilter: (x: trainer_Type[]) => void,
}

export interface Menu_Props {
    btnFilterEle: HTMLButtonElement | null,
    filterObj: filter_Type,
    onIsShowMenu: (x: boolean) => void
    onGetFilterResult: (x: filter_Type) => void
}

export interface Btn_Save_Change_Props {
    id: string | number,
    trainerState: any,
    isChangeInfo: boolean,
    closeWindow: () => void
}

export interface Btn_Subscription_Renewal_Props {
    trainer: trainer_Type,
    isInfoComplete: boolean,
}

export interface Btn_Finished_Subscription_Props {
    id: string | number,
    onGetSubscriptionState: (x: string) => void,
}

export interface Data_Inputs_Props {
    onIsShowEndMessage: (x: boolean) => void,
    onGetManagerInfo: (x: any) => void,
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
    targetType: "السنوي" | "الشهري" | "اليومي",
    isHiddenTheWord?: boolean,
    className?: string,
    styleBoxWhenSelect?: string | null,
    monthNumber?: number,
    onGetBoxInfo: (x: { id: number, title: number | string, monthNumber?: number }) => void
}

export interface Layers_Date_Props {
    onGetYearInfo: (x: { id: null | number, title: null | number }) => void,
    onGetMonthInfo: (x: { id: null | number, title: null | string, monthNumber: null | number }) => void,
    onGetDayInfo: (x: { id: null | number, title: null | number }) => void,
}

export interface Table_For_Read_Profits_Expenses_Props {
    yearId: number,
    monthId: number,
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
    onGetPrice: (x: number) => void
}

export interface Cover_Img_Props {
    accountId: number,
    coverImgSrc: string,
    isChangeCoverImg: boolean
}