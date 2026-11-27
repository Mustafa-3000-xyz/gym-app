export interface alert_Type {
    titleBeforeSubmit?: string,
    titleAfterSubmit?: string,
    textBeforeSubmitAction: string,
    textAfterSubmitAction?: string | undefined,
    isShowDeniedBtn?: boolean,
    iconStyleBeforeSubmit?: "success" | "error" | "question" | "info" | "warning"
    runFunctionAfterConfirm?: () => void,
    runFunctionAfterDenied?: () => void,
    runFunctionAfterClickOnCancel?: () => void,
}

export interface normalAlert_Type {
    title: string,
    text?: string,
    icon: "success" | "error" | "question" | "info",
    runFunctionAfterConfirm?: () => void
}

export interface checkThePermissionIsHere_Type {
    accountId: number,
    permissionType?: string,
}