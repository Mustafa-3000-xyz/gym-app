import Account_Img from "@/Pages/Profile-page/Components/Account-img/Account_Img";
import Box from "@/Global-components/Box/Box";
import { accountesPagePath, allPermissions, CHANGE_ACCOUNT_COLOR } from "@/Lib/constants";
import { deleteRowInAccountsTableById, updatePropertyInRowInAccountsTable, updateSomePropertiesInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { KeyRound, LogOut, Shell, Trash, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { accounte_Type } from "../types";
import Permissions from "../../Global-components/Permissions/Permissions";
import { alert, checkPermissionesInAccount } from "@/Lib/functions";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import { useNavigate, useParams } from "react-router-dom";
import { store_Type } from "@/Rtk/types";
import Cover_Img from "./Components/Cover-img/Cover_Img";
import { changeLogInInfo } from "@/Rtk/Slices/UI-slices/logInInfoSlice";
// ========================================================== //
export default function Profile_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            trainerDetails: state.trainerDetails,
            accounts: state.accounts,
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);

    const checkTheChangeColor = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: CHANGE_ACCOUNT_COLOR
    });

    const [theAccount, setTheAccount] = useState<accounte_Type | null>(null);
    const [permissionsList, setPermissionsList] = useState<string | string[]>("fullAccess");
    const [isShowEditingAccount, setIsShowEditingAccount] = useState(false);

    const [isSaveChange, setIsSaveChange] = useState(false);
    const [getName, setGetName] = useState<string | null>(null);
    const [getAge, setGetAge] = useState<number | null>(null);
    const [getColor, setGetColor] = useState<string | null>(null);
    const [getPassword, setGetPassword] = useState<string | null>(null);

    const navigate = useNavigate();
    const { accountId } = useParams();




    function clickOnLogOutBtn() {
        alert({
            textBeforeSubmit: "هل تريد بالفعل تسجيل الخروج ؟؟",
            runFunctionAfterSubmit: function () {
                dispatch(changeLogInInfo(null))
            }
        })
    }

    function clickOnRemoveAccountBtn() {
        alert({
            textBeforeSubmit: "هل تريد بالفعل حذف ذلك الحساب ؟؟",
            textAfterSubmit: "تم حذف الحساب بنجاح",
            runFunctionAfterSubmit: function () {
                dispatch(deleteRowInAccountsTableById(accountId as any) as any);
                navigate(accountesPagePath);
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

    function clickOnSaveChangesBtn() {
        if (!isSaveChange) return;

        dispatch(updateSomePropertiesInRowInAccountsTable({
            id: theAccount?.id as any,
            values: {
                name: getName as any,
                age: getAge as any,
                color: getColor as any,
                password: getPassword as any
            }
        }) as any)

        dispatch(changeLogInInfo({
            id: theAccount?.id as any,
            type: theAccount?.type as any,
            color: getColor
        }));

        setIsShowEditingAccount(false);
        setIsSaveChange(false);
    }



    // Update permissions
    useEffect(function () {
        if (
            permissionsList == "fullAccess"
            ||
            theAccount?.permissions == permissionsList
        ) return

        dispatch(updatePropertyInRowInAccountsTable({
            id: theAccount?.id as any,
            column: "permissions",
            value: permissionsList
        }) as any);
    }, [permissionsList]);

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

    // Get account
    useEffect(function () {
        const getAccount = state.accounts?.find(ele => ele.id == (Number(accountId)));

        setTheAccount(getAccount as accounte_Type);
        setGetColor(getAccount?.color as any);
    }, [accountId, state.accounts]);

    // Check values is changes or no
    useEffect(function () {
        if (!getName || !getAge || !getPassword) {
            setIsSaveChange(false);
            return;
        }


        if (
            getName != theAccount?.name
            ||
            getAge != theAccount?.age
            ||
            getColor != theAccount.color
            ||
            getPassword != theAccount?.password
        ) {
            setIsSaveChange(true);
        } else {
            setIsSaveChange(false);
        }
    }, [getName, getAge, getPassword, getColor]);






    if (!theAccount) return null


    return <section>
        {/* Cover & img */}
        <div className="relative">
            {/* Cover */}
            <Cover_Img
                accountId={Number(accountId)}
                coverImgSrc={theAccount.coverImg}
                isChangeCoverImg={state.logInInfo?.id == accountId}
            />

            {/* Profile img */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <Account_Img
                    accountId={theAccount?.id as number}
                    img={theAccount?.profileImg as string}
                    color={theAccount?.color as any}
                    isChangeTheImg={state.logInInfo?.id == accountId}
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
                total={Math.trunc(Math.abs(theAccount?.totalActiveSubscriptions) as any) as any}
            />

            <Box
                icon={<UsersRound />}
                styleIcon="bg-neutral-200 text-neutral-500"
                title="مجموع المتدربين"
                total={Number(theAccount.trainersTotal)}
            />

            <Box
                icon={<KeyRound />}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                title="عدد الصلاحيات للحساب"
                total={`
                    ${theAccount?.type == "manager" ? allPermissions.length : permissionsList?.length}
                    من اصل
                    ${allPermissions.length}
                `}
            />
        </div>

        {/* Permissions */}
        <div className="mt-6 flex gap-3">
            <Permissions
                permissionsList={permissionsList as any}
                onGetPermissionsList={setPermissionsList as any}
            />
        </div>

        {/* Delete account btn & logout btn */}
        <div className="flex gapp-2 justify-end mt-6">
            {
                state.logInInfo?.id == accountId ?
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
                    :
                    null
            }


            {
                state.logInInfo?.type == "manager" && theAccount?.type == "captain" ?
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
                    :
                    null
            }
        </div>

        {
            state.logInInfo?.id == accountId ?
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
                :
                null
        }


        {
            isShowEditingAccount ?
                <>
                    {/* Account form */}
                    <Account_Form
                        name={theAccount.name}
                        age={theAccount.age}
                        password={theAccount.password}
                        accountType={theAccount.type}
                        onGetName={setGetName}
                        onGetAge={setGetAge}
                        onGetPassword={setGetPassword}
                    />

                    {
                        checkTheChangeColor ?
                            <div className="flex gap-3 justify-center mt-10">
                                {
                                    state.logInInfo?.type == "manager" ?
                                        <div
                                            className={`
                                                bg-black w-10 h-10 rounded-lg
                                                ${getColor == "#000000" ? "border-5 border-amber-500" : "cursor-pointer"}
                                            `}
                                            onClick={() => setGetColor("#000000")}
                                        ></div>
                                        :
                                        null
                                }

                                <div
                                    className={`
                                        bg-purple-500 w-10 h-10 rounded-lg
                                        ${getColor == "#ad46ff" ? "border-5 border-amber-500" : "cursor-pointer"}
                                    `}
                                    onClick={() => setGetColor("#ad46ff")}
                                ></div>

                                <div
                                    className={`
                                        bg-[#3b82f6] w-10 h-10 rounded-lg
                                        ${getColor == "#3b82f6" ? "border-5 border-amber-500" : "cursor-pointer"}
                                    `}
                                    onClick={() => setGetColor("#3b82f6")}
                                ></div>

                                <div
                                    className={`
                                        bg-lime-700 w-10 h-10 rounded-lg 
                                        ${getColor == "#497d00" ? "border-5 border-amber-500" : "cursor-pointer"}
                                    `}
                                    onClick={() => setGetColor("#497d00")}
                                ></div>
                            </div>
                            :
                            null
                    }

                    <div className="flex justify-center my-5">
                        <button
                            className={`
                                w-2/3 duration-300
                                bg-(--thirdColor) text-white p-3 rounded-lg 
                                ${isSaveChange ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-45"}
                            `}
                            onClick={clickOnSaveChangesBtn}
                            disabled={!isSaveChange}
                        >
                            حفظ التغيرات
                        </button>
                    </div>
                </>
                :
                null
        }
    </section >
}