import Account_Img from "@/Pages/Profile-page/Components/Account-img/Account_Img";
import Box from "@/Global-components/Box/Box";
import { allPermissions, trainerPagePath } from "@/Lib/constants";
import { deleteRowInAccountsTableById, updatePropertyInRowInAccountsTable, updateSomePropertiesInRowInAccountsTable } from "@/Rtk/Slices/accountsSlice";
import { BriefcaseBusiness, KeyRound, LogOut, Shell, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { accounte } from "../types";
import Permissions from "../../Global-components/Permissions/Permissions";
import { alert, logOutFromOldAccount } from "@/Lib/functions";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import { useNavigate, useParams } from "react-router-dom";
import { store_Type } from "@/Rtk/types";
import Cover_Img from "./Components/Cover-img/Cover_Img";
import { changeLogInInfo } from "@/Rtk/Slices/logInInfoSlice";
// ========================================================== //
export default function Profile_Page() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);

    const [theAccount, setTheAccount] = useState<accounte | null>(null);
    const [permissionsList, setPermissionsList] = useState<string | string[]>("fullAccess");
    const [isShowEditingAccount, setIsShowEditingAccount] = useState(false);

    const [isSaveChange, setIsSaveChange] = useState(false);
    const [getName, setGetName] = useState("");
    const [getAge, setGetAge] = useState(0);
    const [getPassword, setGetPassword] = useState("");

    const navigate = useNavigate();
    const { accountId } = useParams();



    function clickOnLogOutBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل تسجيل الخروج ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                dispatch(changeLogInInfo(null))
                logOutFromOldAccount(Number(state.logInInfo?.id));
            }
        })
    }

    function clickOnRemoveAccountBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل حذف ذلك الحساب ؟؟",
            titleAfterClickOnOk: "تم حذف الحساب بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(deleteRowInAccountsTableById(accountId as any) as any);
                navigate(trainerPagePath);
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
                name: getName,
                age: getAge,
                password: getPassword
            }
        }) as any)

        setIsShowEditingAccount(false);
        setIsSaveChange(false)
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

    useEffect(function () {
        const getAccount = state.accountes.find(ele => ele.id == (Number(accountId)));

        setTheAccount(getAccount as accounte);
    }, [accountId, state.accountes]);

    useEffect(function () {
        if (!getName || !getAge || !getPassword) {
            setIsSaveChange(false);
            return;
        }


        if (
            (getName != theAccount?.name)
            ||
            (getAge != theAccount?.age)
            ||
            (getPassword != theAccount?.password)
        ) {
            setIsSaveChange(true);
        } else {
            setIsSaveChange(false);
        }
    }, [getName, getAge, getPassword]);


    const houresTotal = useMemo(function () {
        if (theAccount?.loginDate) {
            const startDate = new Date(theAccount?.loginDate as any).getTime();
            const dateNow = new Date().getTime();
            const totalForHours = (startDate - dateNow) / (1000 * 60 * 60);

            return Math.trunc(totalForHours);
        }
        else {
            return theAccount?.workingHours;
        }
    }, [theAccount]);






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
                    accountType={theAccount?.type as any}
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
                total={Math.trunc(theAccount?.totalForActiveSessions as any) as any}
            />

            <Box
                icon={<BriefcaseBusiness />}
                styleIcon="bg-neutral-200 text-neutral-500"
                title="مجموع ساعات العمل"
                total={houresTotal as any}
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
                changePermissions={state.logInInfo?.type == "manager" && theAccount?.type == "captain" as any}
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
                <div className="select-none">
                    <Account_Form
                        name={theAccount.name}
                        age={theAccount.age}
                        password={theAccount.password}
                        accountType={theAccount.type}
                        onGetName={setGetName}
                        onGetAge={setGetAge}
                        onGetPassword={setGetPassword}
                    />


                    <div className="flex justify-center my-10">
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
                </div>
                :
                null
        }
    </section>
}