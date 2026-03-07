import { ReactNode } from "react";
import { TargetAndTransition } from "framer-motion";
// ========================================================== //
export interface Not_Found_Props{
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
}