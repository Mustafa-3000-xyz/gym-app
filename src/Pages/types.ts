export interface trainer {
    id?: number;
    subscriptionState: string;
    activeSessionsList: activeSessionsList_Type[] | [];
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    subscriptionName: string;
    sessionsCount: number;
    price: number;
    subscriptionStart: string;
    subscriptionEnd: string;
    dateAdded: string;
}

export interface accounte {
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

export interface subscriptionsMenus {
    id?: number,
    subscriptionName: string,
    sessionsCount: number,
    price: number
    isActive: "true" | "false"
}

export interface attendanceDetails {
    id?: number,
    date: Date | string,
    accountId: number,
    trainers: number[],
}

export interface activeSessionsList_Type {
    accountId: number,
    sessionNumber: number,
    activationDate: Date | string,
}

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
    trainersList: trainer[],
    onGetFilter: (x: filter) => void,
    onGetTrainerListAfterFilter: (x: trainer[]) => void,
}

export interface Menu_Props {
    btnFilterEle: HTMLButtonElement | null,
    filterObj: filter,
    onIsShowMenu: (x: boolean) => void
    onGetFilterResult: (x: filter) => void
}

export interface filter {
    arrange: string,
    subscriptionType: string,
}

export interface Btn_Save_Change_Props {
    id: string | number,
    trainerState: any,
    isChangeInfo: boolean,
    closeWindow: () => void
}

export interface Btn_Subscription_Renewal_Props {
    trainer: trainer,
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
    changePermissions: boolean,
    onGetPermissionsList: (x: string[]) => void,
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

export interface sessionListForRead {
    account: accounte | "removed",
    session: number,
    date?: null | any,
    isActive: boolean
}

export interface box_Info_In_Trainers_Page {
    name: string,
    styleBgForIcon: string,
    icon: any,
    total: number,
}

export interface Filter_For_Attendance_Props {
    filterType: number | "allTrainers",
    dayDetails: attendanceDetails[],
    onGetTrainers: (x: trainer[]) => void
    onChangeFilterType: (x: number | "allTrainers") => void,
}

export interface Date_Box_Props {
    onGetDatesTotal: (x: number) => void,
    onGetDayDetails: (x: attendanceDetails[]) => void,
    onChangeFilterType: (x: number | "allTrainers") => void
}

export interface Filter_For_Trainers_Props {
    onGetTrainers: (x: trainer[]) => void,
    onGetBoxInfo: (x: box_Info_In_Trainers_Page) => void,
}