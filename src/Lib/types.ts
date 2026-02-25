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