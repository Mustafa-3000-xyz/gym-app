export interface trainer {
    trainerId?: number;
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
    id?: number | string,
    img: string,
    name: string,
    age: number | string,
    password: string,
    type: "manager" | "captain",
    totalForActiveSessions: number,
    permissions?: string[] | "fullAccess",
}

export interface activeSessionsList_Type {
    accountId: number,
    sessions: number[]
}

export interface Subscription_Info_Form_Props {
    onGetSubscriptionName: (x: string) => void,
    onGetSessionsCount: (x: number) => void,
    onGetPrice: (x: number) => void,
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
    onGetFirstName: (x: string) => void,
    onGetLastName: (x: string) => void,
    onGetPhone: (x: string) => void,
    onGetAddress: (x: string) => void,
}

export interface Btn_Slide_Props {
    index: number,
    currentSlide: number,
    onGetIndexBtn: (x: number) => void
}

export interface Btn_Filter_Props {
    trainersList: trainer[],
    onGetFilterResult: (x: trainer[]) => void,
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

export interface Search_Result_Props {
    searchInpRef: React.RefObject<HTMLInputElement | null>,
    searchResult: trainer[],
    onIsShowSearchResult: (x: boolean) => void,
    onGetSearchResult: (x: trainer[]) => void,
    onGetSearchValue: (x: string) => void,
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
    onGetSubscriptionState: (x: string) => void,
}

export interface Btn_Delete_Trainer_Props {
    trainer: trainer,
    closeWindow: () => void
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