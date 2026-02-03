export interface trainer {
    trainerId: number;
    isSubscriptionActive: boolean;
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

export interface Add_Trainer_Props {
    setIsShowAddTrainer: (x: boolean) => void,
    getAllTrainers: () => void
}

export interface Trainer_Info_Form_Props {
    setGetFirstName: (x: string) => void,
    setGetLastName: (x: string) => void,
    setGetPhone: (x: number) => void,
    setGetAddress: (x: string) => void,
}

export interface All_Trainers_Props {
    trainersList: trainer[],
    setGetTrainerDetails: (x: trainer) => void,
    setIsShowTrainerDetails: (x: boolean) => void,
}

export interface Show_Traine_Details_Props {
    trainer: trainer,
    setIsShowTrainerDetails: (x: boolean) => void,
    getAllTrainers: ()=> void 
}

export interface Subscription_Info_Form_Props {
    subscriptionName: string,
    sessionsCount: number,
    price: number,
    setSubscriptionName: (x: string) => void,
    setSessionsCount: (x: number) => void,
    setPrice: (x: number) => void,
}

export interface Date_Info_Props {
    setGetSubscriptionStart: (x: string) => void,
    setGetSubscriptionEnd: (x: string) => void,
}

export interface Date_Picker_Props {
    subscriptionEnd: string,
    subscriptionStart: string,
    setSubscriptionEnd: (x: string) => void
}