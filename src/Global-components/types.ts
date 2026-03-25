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
    styleBtn: string,
    children: ReactNode,
    isSaveData?: boolean,
    isShowBtn?: boolean,
    clickOnCancel: () => void,
    clickOnSaveDataBtn?: () => void,
    clickOnSaveChangeBtn?: () => void,
}