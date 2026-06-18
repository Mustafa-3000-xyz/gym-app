import React, { ChangeEvent, ReactNode } from "react";
import { TargetAndTransition, Transition } from "framer-motion";
import { accounte, trainer } from "@/Pages/types";
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
    title: string,
    total: string | number,
}

export interface Popup_Form_Props {
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
    isChangeTheImg: boolean,
    accountType: "manager" | "captain",
}

export interface Add_Btn_Props {
    styleBtn?: string,
    paddingY?: string,
    title: string,
    onClick?: () => void,
}

export interface Account_Form_Props {
    name: string,
    age: number,
    password: string,
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

export interface Password_Inp_Props {
    removeValue?: boolean,
    password?: string,
    onWriteInInput?: (e: ChangeEvent<HTMLInputElement>) => void,
}

export interface Inp_With_Label_Props {
    valueOrDefaultValue?: "value" | "default value"
    labelName: string,
    inpType?: "password" | "text" | "number"
    inpValue?: string | number,
    isChangeValue?: boolean,
    onWriteInInput: (x: ChangeEvent<HTMLInputElement>) => void
}

export interface Toggle_Btn_Props {
    value: boolean,
    onGetValue: (x: boolean) => void
}

export interface Drop_Menu_Props {
    messageForNotAddChildren?: string,
    classNameForMenu?: string,
    isShowTheMenu?: boolean,
    children?: ReactNode,
    onGetCurrentIsShowMenu?: (x: boolean) => void
}

export interface Account_Card_Props {
    account: accounte,
    isShowAccountCard: boolean
}

export interface Search_Result_Props {
    searchInpRef: HTMLInputElement,
    arrayContainsTrainers: trainer[],
    onIsShowSearchResult: (x: boolean) => void,
}