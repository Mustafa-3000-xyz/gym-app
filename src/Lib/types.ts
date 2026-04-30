export interface alertSuccessType {
    mainTitle: string,
    text?: string,
}

export interface alertType {
    titleBeforeClickOnOk: string,
    titleAfterClickOnOk?: string,
    funRunWhenClickOnOk: Function,
    showMessageAfterClickOnOk?: boolean
}

export interface allPermissions_Type {
    title: string,
    path: string,
}

export interface normalAlert_Type {
    title: string,
    text?: string,
    icon: "success" | "error" | "question" | "info"
}