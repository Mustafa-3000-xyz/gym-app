import React, { ChangeEvent, ReactNode } from "react";
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
    icon: ReactNode,
    isShowTheLink: boolean,
    onClick?: (e: React.MouseEvent)=> void,
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
    total: string | number,
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
    accountId: number,
    img: string,
    isShowCamera: boolean,
    accountType: "manager" | "captain",
}

export interface Add_Btn_Props {
    styleTheBgAndBorderBtn: string,
    thePaddingY?: string,
    title: string,
    icon: any,
    onClick: () => void,
}

export interface Account_Form_Props {
    name: string,
    age: number,
    password: string,
    dontChangeValues: boolean,
    accountType: "manager" | "captain"
    onGetName: (x: string) => void;
    onGetAge: (x: number) => void;
    onGetPassword: (x: string) => void;
}

export interface Title_And_Discription_For_Pages_Props {
    title: string,
    discription: string,
}

export interface Input_Search_Props {
    placeholder: string,
    ref?: HTMLInputElement,
    onGetValue: (x: string) => void
}

export interface Password_Inp_Props{
    password?: string,
    onWriteInInput?: (e: ChangeEvent<HTMLInputElement>) => void,
    onGetPassword: (x: string) => void
}