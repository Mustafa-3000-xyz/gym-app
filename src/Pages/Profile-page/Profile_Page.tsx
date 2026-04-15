import Account_Img from "@/Pages/Profile-page/Components/Account_Img";
import Box from "@/Global-components/Box/Box";
import { allPermissions } from "@/Lib/constants";
import { deleteAccountById, getAllAccounts, updatePropertyInAccount } from "@/Rtk/Slices/accountsSlice";
import { useAtom } from "jotai"
import { BriefcaseBusiness, ImageOff, KeyRound, LogOut, Shell, Trash } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { accounte } from "../types";
import { store_Type } from "@/Rtk/types";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import Permissions from "../../Global-components/Permissions/Permissions";
import accountDetails_Atom from "@/Atoms/Details/accountDetails_Atom";
import { alert } from "@/Lib/functions";
import Account_Form from "@/Global-components/Account-form/Account_Form";
// ========================================================== //
export default function Profile_Page() {
    const state = useSelector(state => state as store_Type);
    const [isLoginAtom, setIsLoginAtom] = useAtom(isLogin_Atom);
    const [accountDetailsAtom, setAccountDetailsAtom] = useAtom(accountDetails_Atom);
    const dispatch = useDispatch();

    const [theAccount, setTheAccount] = useState<accounte | null>(accountDetailsAtom ?? null);
    const [permissionsList, setPermissionsList] = useState<string | string[]>("fullAccess");
    const [isShowEditingAccount, setIsShowEditingAccount] = useState(false);
    const inpRef = useRef<HTMLInputElement | null>(null);




    function clickOnCover() {
        if (accountDetailsAtom) return;

        inpRef.current?.click()
    }

    function selectCoverImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;

            dispatch(updatePropertyInAccount({
                id: theAccount?.id as any,
                column: "coverImg",
                value: base64
            }) as any);
        };
    }

    function clickOnLogOutBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل تسجيل الخروج ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                setIsLoginAtom(null);
            }
        })
    }

    function clickOnRemoveAccountBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل حذف ذلك الحساب ؟؟",
            titleAfterClickOnOk: "تم حذف الحساب بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(deleteAccountById(accountDetailsAtom?.id as any) as any);
                setAccountDetailsAtom(null);
            }
        })
    }

    function clickOnEditingAccountBtn() {
        if (isShowEditingAccount) {
            setIsShowEditingAccount(false);
        }
        else {
            setIsShowEditingAccount(true);
        }
    }

    function clickOnRemoveCoverImgBtn(e: ChangeEvent<HTMLButtonElement>) {
        e.stopPropagation();

        dispatch(updatePropertyInAccount({
            id: theAccount?.id as any,
            column: "coverImg",
            value: ""
        }) as any);
    }

    function clickOnRemoveProfileImgBtn() {
        dispatch(updatePropertyInAccount({
            id: theAccount?.id as any,
            column: "profileImg",
            value: ""
        }) as any);
    }

    function clickOnSaveChangesBtn(){
        console.log("D");
    }




    useEffect(function () {
        if (accountDetailsAtom) return;

        dispatch(getAllAccounts() as any);
    }, []);

    // Check permissions value
    useEffect(function () {
        if (!theAccount?.permissions) return;

        if (theAccount.permissions == "fullAccess") {
            setPermissionsList("fullAccess")
        }
        else {
            setPermissionsList(JSON.parse(theAccount.permissions as any))
        }
    }, [theAccount?.permissions]);

    // Update permissions
    useEffect(function () {
        if (
            permissionsList == "fullAccess"
            ||
            theAccount?.permissions == permissionsList
        ) return

        dispatch(updatePropertyInAccount({
            id: theAccount?.id as any,
            column: "permissions",
            value: permissionsList
        }) as any);
    }, [permissionsList]);

    /* Get the account i'm using if the accountDetailsAtom is null,
        else i show the accountDetailsAtom value */
    useEffect(function () {
        if (accountDetailsAtom) return;

        const getAccount = state.accountes.find(ele => ele.id == isLoginAtom.id);
        setTheAccount(getAccount ?? null);
    }, [state.accountes]);




    if (!theAccount) return null

    return <section>
        {/* Cover & img */}
        <div className="relative">
            {/* Cover */}
            <div
                className={`
                    transition duration-300
                    w-full h-96 relative group
                    ${accountDetailsAtom ? "hover:opacity-100 cursor-not-allowed" : "cursor-pointer hover:opacity-80"}
                `}
                onClick={clickOnCover}
            >
                <img
                    className="rounded-lg w-full h-full object-cover"
                    src={theAccount?.coverImg != "" ? theAccount?.coverImg : "background_for_account.jpg"}
                    alt="background_for_account"
                />

                {
                    !accountDetailsAtom && theAccount?.coverImg != "" ?
                        <button
                            className={`
                                transition duration-300
                                absolute top-0 end-0 m-3 bg-red-500 p-2 rounded-lg text-white
                                opacity-0 group-hover:opacity-100 cursor-cell
                            `}
                            onClick={clickOnRemoveCoverImgBtn as any}
                        >
                            <Trash size={15} />
                        </button>
                        :
                        null
                }
            </div>

            {/* Profile img */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <Account_Img
                    accountId={theAccount?.id as number}
                    img={theAccount?.profileImg as string}
                    accountType={theAccount?.type as any}
                    isShowCamera={!accountDetailsAtom}
                />
            </div>
        </div>

        {/* Name & age & age */}
        <div className="my-10 text-center">
            <h3 className="font-bold text-2xl">
                {theAccount?.name}
            </h3>

            <p className={`
                ${theAccount?.type == "manager" ? "font-bold" : ""}
            `}
            >
                <span>
                    العمر ({Math.trunc(theAccount?.age as any)})
                </span>

                <span> | </span>

                <span>
                    {theAccount?.type == "manager" ? "المدير" : "كابتن في الجيم"}
                </span>
            </p>
        </div>

        {/* Boxes */}
        <div className="grid grid-cols-3 gap-7">
            <Box
                icon={<Shell />}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                title="عدد الحصص المفعله"
                total={Math.trunc(theAccount?.totalForActiveSessions as any) as any}
            />

            <Box
                icon={<BriefcaseBusiness />}
                styleIcon="bg-neutral-200 text-neutral-500"
                title="عدد ساعات العمل"
                total={345345}
            />

            <Box
                icon={<KeyRound />}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                title="عدد الصلاحيات للحساب"
                total={`
                    ${theAccount?.type == "manager" ? allPermissions.length
                        : permissionsList?.length}
                    من اصل
                    ${allPermissions.length}
                `}
            />
        </div>

        {/* Permissions */}
        <div className="mt-6 flex gap-3">
            <Permissions
                permissionsList={permissionsList as any}
                changePermissions={isLoginAtom.type == "manager" && accountDetailsAtom?.type == "captain"}
                onGetPermissionsList={setPermissionsList as any}
            />
        </div>

        {/* Delete account btn & logout btn & remove profile img */}
        <div className="flex gapp-2 justify-end mt-6">
            {
                !accountDetailsAtom && theAccount.profileImg != "" &&
                <button
                    className={`
                        transition duration-300
                        bg-red-500 text-white p-3 rounded-lg mx-3
                        cursor-pointer
                        hover:bg-red-600
                    `}
                    onClick={clickOnRemoveProfileImgBtn}
                >
                    <ImageOff />
                </button>
            }

            {
                !accountDetailsAtom &&
                <button
                    className={`
                        transition duration-300
                        bg-red-500 text-white px-3 py-2 rounded-lg cursor-pointer
                        hover:bg-red-600
                    `}
                    onClick={clickOnLogOutBtn}
                >
                    <LogOut />
                </button>
            }


            {
                isLoginAtom.type == "manager" && accountDetailsAtom?.type == "captain" &&
                <button
                    className={`
                        transition duration-300
                        bg-red-500 text-white px-3 py-2 rounded-lg cursor-pointer
                        hover:bg-red-600
                    `}
                    onClick={clickOnRemoveAccountBtn}
                >
                    <Trash />
                </button>
            }
        </div>

        {
            !accountDetailsAtom &&
            <div className="text-center w-full">
                <button
                    className="my-6 cursor-pointer underline text-blue-500"
                    onClick={clickOnEditingAccountBtn}
                >
                    {
                        isShowEditingAccount ?
                            "إلغاء تعديل الحساب"
                            :
                            " تعديل الحساب"
                    }
                </button>
            </div>
        }


        {
            isShowEditingAccount ?
                <div className="select-none">
                    <Account_Form
                        name={theAccount.name}
                        age={theAccount.age}
                        password={theAccount.password}
                        accountType={theAccount.type}
                        dontChangeValues={false}
                        onGetName={() => null}
                        onGetAge={() => null}
                        onGetPassword={() => null}
                    />


                    <div className="flex justify-center my-10">
                        <button
                            className={`
                                w-2/3
                                bg-(--thirdColor) text-white p-3 rounded-lg 
                                cursor-not-allowed opacity-45
                            `}
                            onClick={clickOnSaveChangesBtn}
                        >
                            حفظ التغيرات
                        </button>
                    </div>
                </div>
                : null
        }


        <input
            ref={inpRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => selectCoverImg(e)}
        />
    </section>
}