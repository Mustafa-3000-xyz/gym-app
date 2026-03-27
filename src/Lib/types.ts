export interface alertSuccessType{
    mainTitle: string,
    text: string,
}

export interface alertType {
    titleBeforeClickOnOk: string,
    titleAfterClickOnOk?: string,
    funRunWhenClickOnOk: Function,
    showMessageAfterClickOnOk?: boolean
}

export interface allPermissions_Type{
    title: string,
    path: string,
}