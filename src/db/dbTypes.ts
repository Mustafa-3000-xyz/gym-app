export type updateOneColumn =
    | "subscriptionState"
    | "activeSessionsList"
    | "firstName"
    | "lastName"
    | "phone"
    | "address"
    | "subscriptionName"
    | "sessionsCount"
    | "price"
    | "subscriptionStart"
    | "subscriptionEnd";


export type updateTrainerInfoPayload = Partial<{
    firstName: string;
    lastName: string;
    address: string;
    phone: string | number;
}>;