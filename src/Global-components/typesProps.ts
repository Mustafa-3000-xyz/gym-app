import React, { ReactNode } from "react";
import { TargetAndTransition, Transition } from "framer-motion";
import { trainer_Type } from "@/Pages/types";
// ========================================================== //
export interface Not_Found_Props {
    srcImg: string,
    title?: string,
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
    title: string,
    children: ReactNode,
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
    onGetName: (x: {
        value: string,
        isTrue: boolean
    }) => void;
    onGetAge: (x: {
        value: number,
        isTrue: boolean
    }) => void;
    onGetPassword: (x: {
        value: string,
        isTrue: boolean
    }) => void;
}

export interface Inp_With_Label_Props {
    labelName?: string,
    placeholder?: string,
    inpType?: "password" | "text" | "number"
    inpValue?: any,
    isChangeValue?: boolean,
    className?: string,
    isRemoveSpaces?: boolean
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

export interface Table_For_Trainers_Props {
    trainersList: trainer_Type[],
    countRowsInSlide: number,
}

export interface Password_Inp_Props {
    account: {
        id: number,
        type: "manager" | "captain",
        color: string,
        password: string,
    }
    value: any,
    onWrite: (x: string) => void,
    onIsErrorPassword: (x: string) => void
}


export interface Custom_Btn_Props {
    className?: string,
    children: React.ReactNode,
    onClick?: (x: Function) => void,
}