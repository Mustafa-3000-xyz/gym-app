export interface alert_Type {
    titleBeforeSubmit?: string,
    titleAfterSubmit?: string,
    textBeforeSubmit: string,
    textAfterSubmit?: string,
    iconStyleBeforeSubmit?: "success" | "error" | "question" | "info" | "warning"
    runFunctionAfterSubmit?: () => void,
    runFunctionAfterCancel?: () => void
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