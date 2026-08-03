export interface alertSuccess_Type {
    mainTitle: string,
    text?: string,
}

export interface alert_Type {
    titleBeforeClickOnOk: string,
    titleAfterClickOnOk?: string,
    funRunWhenClickOnOk: Function,
}

export interface allPermissions_Type {
    title: string,
    path: string,
}

export interface normalAlert_Type {
    title: string,
    text?: string,
    toast?: boolean,
    icon: "success" | "error" | "question" | "info",
}

export interface checkThePermissionIsHere_Type {
    accountId: number,
    permissionType?: string,
}