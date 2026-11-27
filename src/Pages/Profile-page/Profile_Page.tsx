import Account_Img from "@/Pages/Profile-page/Components/Account_Img";
import Box from "@/Global-components/Box/Box";
import { accountesPagePath, logInPagePath, profilePagePath } from "@/Lib/constants";
import { deleteRowInAccountsTableById, updateAnyPropertyInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { LogOut, Shell, Trash, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { accounte_Type } from "../types";
import Permissions from "../../Global-components/Permissions/Permissions";
import { customAlert, normalAlert } from "@/Lib/functions";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import { useNavigate, useParams } from "react-router-dom";
import { store_Type } from "@/Rtk/types";
import Cover_Img from "./Components/Cover_Img";
import { changeLogInInfo } from "@/Rtk/Slices/UI-slices/logInInfoSlice";
import Custom_Line from "@/Global-components/Custom-line/Custom_Line";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import Password_Inp from "@/Global-components/All-accountes/Password-inp/Password_Inp";
import Swal from "sweetalert2";
// ========================================================== //
export default function Profile_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            accounts: state.accounts,
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);



    const [passwordInp, setPasswordInp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const [permissionsList, setPermissionsList] = useState<string | string[]>("fullAccess");
    const [getColor, setGetColor] = useState<string | null>(null);
    const [getName, setGetName] = useState({
        value: "",
        isTrue: false
    });
    const [getAge, setGetAge] = useState({
        value: 0,
        isTrue: false
    });
    const [getPassword, setGetPassword] = useState({
        value: "",
        isTrue: false
    });


    const [accountDetails, setAccountDetails] = useState<accounte_Type | null>(null);


    const navigate = useNavigate();
    const { accountId } = useParams();


    const totalSessions = useMemo(function () {
        if (!accountDetails) return;


        const result = Math.trunc(Number(accountDetails?.numberOfActiveSessions));

        return isNaN(result) ? "00" : result;
    }, [accountDetails]);



    async function clickOnLogInBtn() {
        const { value: userInput } = await Swal.fire({
            title: "أكتب رقم السر الخاص بحساب المدير",
            input: "password",
            inputPlaceholder: "***",
            showCancelButton: true,
            confirmButtonText: "موافق",
            cancelButtonText: "إلغاء",

            inputValidator: (value) => {
                if (!value) {
                    return "من فضلك, اكتب كلمة السر";
                }
            }
        });



        if (userInput && userInput != getPassword.value) {
            normalAlert({
                title: "المعذره",
                text: "كلمة السر خاطئه",
                icon: "error"
            });
        }
        else if (userInput == getPassword.value) {
            normalAlert({
                title: "تهانينا",
                text: "تم تسجيل الدخول للحساب بنجاح",
                icon: "success",
            });


            dispatch(changeLogInInfo({
                id: accountId as any,
                type: accountDetails?.type as any,
                color: getColor
            }));

            navigate(profilePagePath.replace(":accountId", accountId as any));
        }
    }

    async function clickOnRemoveAccountBtn() {
        const { value: userInput } = await Swal.fire({
            title: "أكتب رقم السر الخاص بحساب المدير",
            input: "password",
            inputPlaceholder: "***",
            showCancelButton: true,
            confirmButtonText: "موافق",
            cancelButtonText: "إلغاء",

            inputValidator: (value) => {
                if (!value) {
                    return "من فضلك, اكتب كلمة السر";
                }
            }
        });

        if (userInput && userInput != getPassword?.value) {
            normalAlert({
                title: "المعذره",
                text: "كلمة السر خاطئه",
                icon: "error"
            });
        }
        else if (userInput == getPassword?.value) {
            normalAlert({
                title: "تهانينا",
                text: "تم  حذف الحساب بنجاح",
                icon: "success",
            });

            dispatch(deleteRowInAccountsTableById(Number(accountDetails?.id)) as any);
            navigate(accountesPagePath);
        }
    }

    function clickOnLogOutBtn() {
        customAlert({
            textBeforeSubmitAction: "هل تريد بالفعل تسجيل الخروج ؟؟",
            runFunctionAfterConfirm: function () {
                dispatch(changeLogInInfo(null));
                navigate(logInPagePath);
            }
        })
    }

    function saveDate() {
        const errorsMessagesList = [];

        if (!getName.isTrue) {
            errorsMessagesList.push("يجب اسم الحساب لا يقل عن ثلاثة حروف ولا يزيد عن خمسة عشر حرف")
        }

        if (!getAge.isTrue) {
            errorsMessagesList.push("يجب كتابة العمر")
        }

        if (!getPassword.isTrue) {
            errorsMessagesList.push("يجب الرقم السري لا يقل عن ثلاثة احرف ولا يزيد عن اثنين وخمسون حرف")
        }

        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات غير صالحه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });

            return;
        }


        if (
            getName.value == accountDetails?.name
            &&
            getAge.value == accountDetails.age
            &&
            getPassword.value == accountDetails.password
            &&
            getColor == accountDetails.color
        ) {
            normalAlert({
                title: "هممم",
                text: "لا يوجد اي بيانات تم تعديلها",
                icon: "info"
            })
        }
        else {
            customAlert({
                textBeforeSubmitAction: "هل تريد حفظ البيانات الجديده ؟",
                textAfterSubmitAction: "تم الحفظ بنجاح",
                runFunctionAfterConfirm() {
                    dispatch(updateAnyPropertyInRowInAccountsTable({
                        id: Number(accountDetails?.id),
                        values: {
                            name: getName.value,
                            age: getAge.value,
                            password: getPassword.value,
                            color: getColor as any,
                        }
                    }) as any);

                    dispatch(changeLogInInfo({
                        id: Number(accountDetails?.id),
                        type: accountDetails?.type,
                        color: getColor
                    }));
                }
            })
        }
    }

    function cancel() {
        if (
            getName.value != accountDetails?.name
            ||
            getAge.value != accountDetails.age
            ||
            getPassword.value != accountDetails.password
            ||
            getColor != accountDetails.color
        ) {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل الرجوع للبيانات القديمه ؟",
                runFunctionAfterConfirm: function () {
                    setGetName({
                        value: accountDetails?.name as any,
                        isTrue: true
                    });
                    setGetAge({
                        value: accountDetails?.age as any,
                        isTrue: true
                    });
                    setGetPassword({
                        value: accountDetails?.password as any,
                        isTrue: true
                    });

                    setGetColor(accountDetails?.color as any);
                    setPermissionsList(accountDetails?.permissions as any);
                }
            })
        }
        else {
            normalAlert({
                title: "هممم",
                text: "لا يوجد اي بيانات تم تعديلها",
                icon: "info"
            })
        }
    }



    // Get account
    useEffect(function () {
        if (state.accounts?.length == 0 || !accountId) return;


        const getAccount = state.accounts?.find(ele => ele.id == (Number(accountId)));

        setAccountDetails(getAccount as any);

        setGetName({
            value: getAccount?.name as any,
            isTrue: true
        });
        setGetAge({
            value: getAccount?.age as any,
            isTrue: true
        });
        setGetPassword({
            value: getAccount?.password as any,
            isTrue: true
        });

        setPermissionsList(getAccount?.permissions as any);
        setGetColor(getAccount?.color as any);
    }, [accountId, state.accounts]);





    if (!accountDetails) return null


    return <section className="mt-10">
        {/* Cover & img */}
        <div className="relative">
            {/* Cover */}
            <Cover_Img
                accountId={Number(accountDetails.id)}
                coverImgSrc={accountDetails?.coverImg as any}
                isChangeCoverImg={state.logInInfo?.id == accountDetails.id}
            />

            {/* Profile img */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                <Account_Img
                    accountId={accountDetails?.id as number}
                    img={accountDetails?.profileImg as string}
                    isChangeTheImg={state.logInInfo?.id == accountDetails.id}
                />
            </div>
        </div>

        {/* Name & age & id*/}
        <div className="my-10 text-center">
            <h3 className="font-bold text-2xl">
                {accountDetails?.name}
            </h3>

            <p className={`
                ${accountDetails?.type == "manager" ? "font-bold" : ""}
            `}
            >
                <span>
                    العمر ({Math.trunc(accountDetails?.age)})
                </span>

                <span> | </span>

                <span>
                    {accountDetails?.type == "manager" ? "المدير" : "كابتن في الجيم"}
                </span>
            </p>

            <p className="font-bold underline">
                رقم الحساب : {accountDetails.id}
            </p>
        </div>

        {/* Boxes */}
        <div className="grid grid-cols-3 gap-7">
            <Box
                icon={<Shell />}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                title="عدد الحصص المفعله"
                total={totalSessions as any}
            />

            <Box
                icon={<UsersRound />}
                styleIcon="bg-neutral-200 text-neutral-500"
                title="مجموع المتدربين"
                total={Number(accountDetails?.trainersTotal)}
            />

            <Box
                icon={<Trash />}
                styleIcon="bg-red-100 text-red-500"
                title="عدد المتدربين المحذوفين"
                total={
                    accountDetails?.numberOfDeletedTrainers ? accountDetails.numberOfDeletedTrainers : 0
                }
            />
        </div>

        {/* Permissions */}
        <div className="mt-6 flex gap-3">
            <Permissions
                accountId={accountDetails.id}
                permissionsList={
                    permissionsList === "fullAccess"
                        ? "fullAccess"
                        : typeof permissionsList == "string"
                            ? JSON.parse(permissionsList)
                            : permissionsList
                }
            />
        </div>

        <Custom_Line />

        {/* Account info */}
        <div className="relative p-5 mb-10">
            {
                state.logInInfo?.id != accountDetails.id as any &&
                <>
                    {/* Bg */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white blur-sm z-20"></div>

                    {
                        state.logInInfo?.type == "manager" ?
                            <div className="absolute z-50 w-full h-full flex justify-center items-center gap-5">
                                <Custom_Btn
                                    className="bg-emerald-500! border-emerald-600!"
                                    onClick={clickOnLogInBtn}
                                >
                                    <p className="font-bold">
                                        تسجيل الدخول للحساب
                                    </p>
                                </Custom_Btn>

                                <Custom_Btn onClick={clickOnRemoveAccountBtn}>
                                    <p className="font-bold">
                                        حذف الحساب
                                    </p>
                                </Custom_Btn>
                            </div>
                            :
                            <div className="absolute z-50 w-full h-full flex flex-col justify-center items-center gap-10">
                                <h3 className="text-center text-3xl font-bold select-none">
                                    قم بتسجيل الدخول لمعرفة المعلومات
                                </h3>

                                <Password_Inp
                                    account={{
                                        id: Number(accountDetails?.id),
                                        type: accountDetails?.type as any,
                                        color: accountDetails?.color as any,
                                        password: accountDetails?.password as any
                                    }}
                                    value={passwordInp}
                                    onWrite={setPasswordInp}
                                    onIsErrorPassword={setErrorMessage}
                                />

                                <p className="text-red-500 font-blold">
                                    {errorMessage}
                                </p>
                            </div>
                    }
                </>
            }


            <h2 className="text-3xl font-bold my-10 text-center">
                معلومات الحساب
            </h2>

            <Account_Form
                name={getName.value}
                age={getAge.value}
                password={getPassword.value}
                accountType={accountDetails.type}
                onGetName={setGetName}
                onGetAge={setGetAge}
                onGetPassword={setGetPassword}
            />

            {/* Colors */}
            <div className="flex gap-3 justify-center mt-10">
                {
                    state.logInInfo?.type == "manager" &&
                    <div
                        className={`
                                bg-black w-10 h-10 rounded-lg
                                ${getColor == "#000000" ? "border-5 border-amber-500" : "cursor-pointer"}
                            `}
                        onClick={() => setGetColor("#000000")}
                    ></div>
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

            {/* Btns and log out*/}
            <div className="flex justify-between my-5">
                <div className="flex gap-3">
                    <Custom_Btn
                        className="bg-emerald-500! border-emerald-600!"
                        onClick={saveDate}
                    >
                        حفظ التغيرات
                    </Custom_Btn>

                    <Custom_Btn onClick={cancel}>
                        إلغاء
                    </Custom_Btn>
                </div>

                {
                    state.logInInfo?.id == accountId as any ?
                        <Custom_Btn onClick={clickOnLogOutBtn}>
                            <LogOut />
                        </Custom_Btn>
                        :
                        null
                }
            </div>
        </div>
    </section>
}