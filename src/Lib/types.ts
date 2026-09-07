export interface alertSuccess_Type {
    mainTitle: string,
    text?: string,
}

export interface alert_Type {
    titleBeforeSubmit?: string,
    titleAfterSubmit?: string,
    textBeforeSubmit: string,
    textAfterSubmit?: string,
    iconStyleBeforeSubmit?: "success" | "error" | "question" | "info" | "warning"
    runFunctionAfterSubmit?: () => void,
    runFunctionAfterCancel?: () => void
}

export interface allPermissions_Type {
    title: string,
    path: string,
}

export interface normalAlert_Type {
    title: string,
    text?: string,
    icon: "success" | "error" | "question" | "info",
    runFunctionAfterSubmit?: () => void
}

export interface checkThePermissionIsHere_Type {
    accountId: number,
    permissionType?: string,
}