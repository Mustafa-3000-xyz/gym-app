import React from 'react';

export interface trainer {
    trainerId: string;
    subscriptionState: string;
    activeSessionsList: number[];
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


export interface attendanceToday {
    theDay: Date,
    attendanceAndCaptainsList: attendanceAndCaptain[]
}

export interface attendanceAndCaptain {
    captainId: string,
    attendanceList: number[] | string[]
}

export interface All_Trainers_Props {
    trainersList: trainer[],
    setIsShowTrainerDetails: (x: boolean) => void,
}

export interface Subscription_Info_Form_Props {
    onGetSubscriptionName: (x: string) => void,
    onGetSessionsCount: (x: number | string) => void,
    onGetPrice: (x: number | string) => void,
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

export interface Show_Traine_Details_Props {
    onIsShowTrainerDetails: (x: boolean) => void,
    getAllTrainers: () => void
}

export interface Btn_Slide_Props {
    index: number,
    currentSlide: number,
    onGetIndexBtn: (x: number) => void
}

export interface Search_Trainer_Props {
    trainersList: trainer[],
    onIsShowTrainerDetails: (x: boolean) => void
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
    onIsShowTrainerDetails: (x: boolean) => void,
    onIsShowSearchResult: (x: boolean) => void,
    onGetSearchResult: (x: trainer[]) => void,
    onGetSearchValue: (x: string) => void,
}

export interface Btn_Save_Change_Props {
    isChangeInfo: boolean,
    onUpdateInfo: () => void
}

export interface Btn_Subscription_Renewal_Props {
    isInfoComplete: boolean,
    onSubscriptionRenewal: () => void
}