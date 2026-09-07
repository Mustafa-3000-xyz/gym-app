import React, { ChangeEvent, ReactNode } from "react";
import { TargetAndTransition, Transition } from "framer-motion";
import { trainer_Type } from "@/Pages/types";
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
    onClick?: (e: React.MouseEvent) => void,
}

export interface Animation_Props {
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
    className?: string,
    title: string,
    total: string | number,
}

export interface Popup_Form_Props {
    popupFormInfo?:{
        title: string,
        discription: string,
        icon?: any
    }
    children: ReactNode,
    isSave?: boolean,
    isShowBtn?: boolean,
    classNameForParent?: string,
    classNameForContainer?: string,
    typeBtn?: "save data" | "save change",
    clickOnCancel: () => void,
    clickOnSaveBtn: () => void,
}

export interface Account_Img_Props {
    accountId: number,
    img: string,
    isChangeTheImg: boolean,
    color: string,
}

export interface Add_Btn_Props {
    title: string,
    className?: string,
    onClick?: () => void,
}

export interface Account_Form_Props {
    name: string,
    age: number,
    password: string,
    accountType: "manager" | "captain"
    onGetName: (x: string | null) => void;
    onGetAge: (x: number | null) => void;
    onGetPassword: (x: string | null) => void;
}

export interface InputSearch_Props {
    placeholder: string,
    ref?: HTMLInputElement,
    onGetValue: (x: string) => void
}

export interface PasswordInp_Props {
    removeValue?: boolean,
    password?: string,
    onWriteInInput?: (e: ChangeEvent<HTMLInputElement>) => void,
}

export interface Inp_With_Label_Props {
    labelName?: string,
    placeholder?: string,
    inpType?: "password" | "text" | "number"
    inpValue?: any,
    isChangeValue?: boolean,
    className?: string,
    isRemoveSpaces?:boolean
    onWriteInInput?: (x: any) => void
}

export interface Toggle_Btn_Props {
    value: boolean,
    disabled?: boolean,
    onGetValue: (x: boolean) => void
}

export interface Drop_Menu_Props {
    messageForNotAddChildren?: string,
    classNameForMenu?: string,
    isShowTheMenu?: boolean,
    children?: ReactNode,
    onGetCurrentIsShowMenu?: (x: boolean) => void
}

export interface Search_Result_Props {
    searchInpRef: HTMLInputElement,
    arrayContainsTrainers: trainer_Type[],
    onIsShowSearchResult: (x: boolean) => void,
}

export interface Top_Content_For_The_Drop_Props {
    children: ReactNode,
    className?: string
}

export interface Bottom_Content_For_The_Drop_Props {
    children: ReactNode,
    className?: string
}

export interface Max_Min_Length_Props {
    isGreenFlag: boolean,
    maxLength: number,
    minLength: number
}

export interface Popup_Download_Version_Props {
    versionSize: number,
    downloaded: number
}

export interface Progress_Props {
    classNameForParent?: string,
    widthChild?: number,
    percentage?: number | null
}

export interface Table_For_Trainers_Props{
    trainersList: trainer_Type[],
    countRowsInSlide: number,
}