import { ReactNode } from "react";
import { TargetAndTransition, Transition } from "framer-motion";
// ========================================================== //
export interface Not_Found_Props {
    srcImg: string,
    title: string,
    className?: string,
}

export interface Sidebar_Linsk_Props {
    linkName: string,
    path: string,
    icon: ReactNode
}

export interface Popup_Animation_Props {
    children: ReactNode;
    className?: string;
    ref?: any;
    initial?: TargetAndTransition;
    animate?: TargetAndTransition;
    transition?: Transition;
}

export interface Box_Props {
    icon: any,
    styleIcon: string,
    title: string,
    total: number,
}

export interface Popup_Props {
    titel: string,
    discription: string,
    children: ReactNode,
    isSave?: boolean,
    isShowBtn?: boolean,
    typeBtn?: "save data" | "save change",
    clickOnCancel: () => void,
    clickOnSaveBtn: () => void,
}

export interface Account_Img_Props {
    img: string,
    isShowCamera: boolean,
    accountType: "manager" | "captain",
    whenClickOnCameraCloseAccountDetails?: boolean,
    onGetImg?: (x: string) => void
}

export interface Add_Btn_Props {
    styleTheBgAndBorderBtn: string,
    thePaddingY?: string,
    title: string,
    icon: any,
    onClick: () => void,
}