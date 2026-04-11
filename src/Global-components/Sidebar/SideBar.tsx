import { Archive, Book, IdCardLanyard, LogOut, Settings, Users, WalletMinimal } from "lucide-react";
import Sidebar_Links from "./Sidebar-links/Sidebar_Links";
import { useAtom, useSetAtom } from "jotai";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { getAllAccountes } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { accounte } from "@/Pages/types";
import { alert } from "@/Lib/functions";
import { accountesPagePath, attendanceRecordePagePath, expalinAppPagePath, profitsAndExpensesPagePath, settingsPagePath, trainerPagePath } from "@/Lib/constants";
import isShowAccountDetails_Atom from "@/Atoms/Is/isShowAccountDetails_Atom";
import accountDetails_Atom from "@/Atoms/Details/accountDetails_Atom";
import Account_Img from "../All-accountes/Account-img/Account_Img";
// ========================================================== //
export default function SideBar() {
    const [isLoginAtom, setIsLoginAtom] = useAtom(isLogin_Atom);
    const setAccountDetailsAtom = useSetAtom(accountDetails_Atom);
    const setIsShowAccountDetailsAtom = useSetAtom(isShowAccountDetails_Atom);

    const state = useSelector(state => state as store_Type);
    const dispatch = useDispatch();

    const [theAccount, setTheAccount] = useState<accounte | null>(null);



    function clickOnLogOutBtn(e: React.MouseEvent) {
        e.stopPropagation();

        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تسجيل الخروج لهذا الحساب ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                setIsLoginAtom(null);
            }
        });
    }

    function clickOnInfoBtn() {
        const getAccount = state.accountes.find(ele => ele.id == isLoginAtom.id);

        setIsShowAccountDetailsAtom(true);
        setAccountDetailsAtom(getAccount as accounte);
    }


    useEffect(function () {
        dispatch(getAllAccountes() as any);
    }, []);

    // This for return the permissions to array
    useEffect(function () {
        const result = state.accountes.find(ele => ele.id == isLoginAtom?.id);

        if (!result) {
            setTheAccount(null);
            return;
        }

        const obj = {
            ...result,
            permissions: result.permissions == "fullAccess" ? "fullAccess" : JSON.parse(result.permissions as any)
        } as accounte

        setTheAccount(obj);
    }, [state.accountes, isLoginAtom]);



    return <nav className={`
            transition-all duration-500
            sticky top-0 h-screen p-4 pb-0
            flex flex-col justify-between
            bg-white border-e border-black/20
            w-[75px] hover:w-[450px] group overflow-hidden
        `}
    >
        {/* Title */}
        <div className="mb-5 text-center" dir="ltr">
            <h1 className="font-bold text-[#FB6543] select-none">
                GYM APP
            </h1>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-2 select-none h-full">
            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(trainerPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="المتدربين"
                path={trainerPagePath}
                icon={<Users
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(accountesPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="الحسابات"
                path={accountesPagePath}
                icon={<IdCardLanyard
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(attendanceRecordePagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="سجل الحضور"
                path={attendanceRecordePagePath}
                icon={<Archive
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <Sidebar_Links
                isShowTheLink={theAccount?.permissions?.includes(profitsAndExpensesPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                linkName="الارباح والمصروفات"
                path={profitsAndExpensesPagePath}
                icon={<WalletMinimal
                    size={25}
                    strokeWidth={1.75}
                />}
            />

            <hr />

            <ul className="flex flex-col gap-2">
                <Sidebar_Links
                    isShowTheLink={theAccount?.permissions?.includes(settingsPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                    linkName="الاعدادات"
                    path={settingsPagePath}
                    icon={<Settings
                        size={25}
                        strokeWidth={1.75}
                    />}
                />

                <Sidebar_Links
                    isShowTheLink={theAccount?.permissions?.includes(expalinAppPagePath) as boolean || theAccount?.permissions == "fullAccess"}
                    linkName="شرح البرنامج"
                    path={expalinAppPagePath}
                    icon={<Book
                        size={25}
                        strokeWidth={1.75}
                    />}
                />
            </ul>
        </ul>

        {/* Account */}
        <div
            className={`
                flex items-center justify-between mb-5 select-none rounded-lg
                trainsition-all duration-300  group-hover:p-3 cursor-pointer
                ${isLoginAtom.type == "manager" ?
                    "group-hover:bg-(--managerColor) hover:bg-(--managerColor)/85 text-white"
                    :
                    "group-hover:bg-(--captainColor) hover:bg-(--captainColor)/85 text-white"
                }
            `}
            onClick={clickOnInfoBtn}
        >
            {/* Img & name & type */}
            <div className="flex items-center gap-3">
                <Account_Img
                    img={theAccount?.img as string}
                    isShowCamera={false}
                    accountType={theAccount?.type as any}
                    widthAndHeight={"w-10 h-10"}
                />


                <div className="mt-1">
                    <h3 className="hidden group-hover:block font-bold leading-2 whitespace-nowrap">{theAccount?.name}</h3>
                    <p className="hidden group-hover:block text-sm">
                        {
                            theAccount?.type == "manager" ? "المدير" : "الكابتن"
                        }
                    </p>
                </div>
            </div>

            <div className="hidden group-hover:flex gap-1">
                <LogOut
                    size={33}
                    strokeWidth={3}
                    className={`
                        cursor-pointer p-2 rounded-md bg-red-500 text-white
                        transition duration-300 hover:bg-red-600
                    `}
                    onClick={clickOnLogOutBtn}
                />
            </div>
        </div>
    </nav>
}