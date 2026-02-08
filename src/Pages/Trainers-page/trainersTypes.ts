export interface trainer {
    trainerId: number;
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
}

export interface All_Trainers_Props {
    trainersList: trainer[],
    setIsShowTrainerDetails: (x: boolean) => void,
}

export interface Add_Trainer_Props {
    onIsShowAddTrainer: (x: boolean) => void,
    getAllTrainers: () => void
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

export interface Start_Date_Picker_Props {
    getDate: (x: Date | null) => void
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