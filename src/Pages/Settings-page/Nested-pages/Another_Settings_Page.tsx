import { Save, Trash, X } from "lucide-react";
import Box_for_setting from "../Components/Box_for_setting";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { addTrainerInTrash, customAlert, normalAlert } from "@/Lib/functions";
import { store_Type } from "@/Rtk/types";
import { deleteAllRowsInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { deleteAllRowsInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
import { deleteAllRowsInSubscriptionsMenusTable } from "@/Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import { deleteAllRowsInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { changeLogInInfo } from "@/Rtk/Slices/UI-slices/logInInfoSlice";
import { useNavigate } from "react-router-dom";
import { logInPagePath } from "@/Lib/constants";
import { getAllRowsInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { updateAnyPropertyInRowInSettingsTable } from "@/Rtk/Slices/Db-slices/settingsSlice";
import Custom_Line from "@/Global-components/Custom-line/Custom_Line";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { addRowInReportsTable } from "@/Rtk/Slices/Db-slices/reportsSlice";
import { reports_Type } from "@/Pages/types";
import { deleteAllRowsInActiveSessionsTable } from "@/Lib/functionsWithDb";
import Toggle_Btn from "@/Global-components/Toggle-btn/Toggle_Btn";
// ========================================================== //
export default function Another_Settings_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInfo: state.logInInfo,
            trainers: state.trainers,
            subscriptionsMenus: state.subscriptionsMenus,
            accounts: state.accounts,
            years: state.yearsProfitsAndExpenses,
            settings: state.settings
        }
    }, shallowEqual);


    const [isChangeInfo, setIsChangeInfo] = useState(false);
    const [isActiveMoreSessionInDay, setIsActiveMoreSessionInDay] = useState(JSON.parse(state.settings.isActiveMoreSessionInDay as any));
    const [isDeleteSomeTrainersWhoNotRenwal, setIsDeleteSomeTrainersWhoNotRenwal] = useState(JSON.parse(state.settings.isDeleteSomeTrainersWhoNotRenwal as any));

    const navigate = useNavigate();



    function saveChanges() {
        customAlert({
            iconStyleBeforeSubmit: "info",
            titleBeforeSubmit: "تنويه",
            textBeforeSubmitAction: "هل تريد حفظ التغيرات ؟",
            textAfterSubmitAction: "تم الحفظ بنجاح",
            runFunctionAfterConfirm: function () {
                setIsChangeInfo(false);

                dispatch(updateAnyPropertyInRowInSettingsTable({
                    isActiveMoreSessionInDay: JSON.stringify(isActiveMoreSessionInDay),
                    isDeleteSomeTrainersWhoNotRenwal: JSON.stringify(isDeleteSomeTrainersWhoNotRenwal)
                } as any) as any);
            }
        })
    }

    function cancelChanges() {
        if (!isChangeInfo) return;


        customAlert({
            textBeforeSubmitAction: "هل تريد بالفعل إلغاء التغيرات",
            runFunctionAfterConfirm() {
                setIsChangeInfo(false);
                setIsActiveMoreSessionInDay(JSON.parse(state.settings.isActiveMoreSessionInDay as any))
                setIsDeleteSomeTrainersWhoNotRenwal(JSON.parse(state.settings.isDeleteSomeTrainersWhoNotRenwal as any));
            },
        })
    }

    function deleteAllTrainers() {
        if (state.trainers?.length == 0) {
            normalAlert({
                icon: "info",
                title: "تمهل",
                text: "لا يوجد بيانات للحذف"
            })
        }
        else {
            customAlert({
                titleBeforeSubmit: "تمهل",
                textBeforeSubmitAction: "هل تريد بالفعل مسح كل المتدربين ؟؟",
                textAfterSubmitAction: "تم الحذف بنجاح",
                runFunctionAfterConfirm() {
                    deleteAllRowsInActiveSessionsTable();
                    addTrainerInTrash(Number(state.logInfo?.id), Number(state.trainers?.length));

                    dispatch(deleteAllRowsInTrainersTable() as any);
                    dispatch(deleteAllRowsInAttendanceTable() as any);

                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "حذف كل المتدربين",
                        description: `حساب رقم ${state.logInfo?.id} قام بحذف كل المتدربين`,
                        reportedBy: "بيمو"
                    } as reports_Type) as any);
                },
            })
        }
    }

    function deleteAllSubscriptionsMenu() {
        if (state.subscriptionsMenus?.length == 0) {
            normalAlert({
                icon: "info",
                title: "تمهل",
                text: "لا يوجد بيانات للحذف"
            })
        }
        else {
            customAlert({
                titleBeforeSubmit: "تمهل يا رجل",
                textBeforeSubmitAction: "هل تريد بالفعل مسح كل قوائم الاشتراكات ؟؟",
                textAfterSubmitAction: "تم الحذف بنجاح",
                runFunctionAfterConfirm() {
                    dispatch(deleteAllRowsInSubscriptionsMenusTable() as any);

                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "حذف كل قوائم الاشتراكات",
                        description: `حساب رقم ${state.logInfo?.id} قام بحذف كل قوائم الاشتراك`,
                        reportedBy: "بيمو",
                    } as reports_Type) as any);
                },
            })
        }
    }

    function deleteAllAccounts() {
        if (Number(state.accounts?.length) <= 1) {
            normalAlert({
                icon: "info",
                title: "تمهل",
                text: "لا يوجد بيانات للحذف"
            })
        }
        else {
            customAlert({
                titleBeforeSubmit: "تمهل يا رجل",
                textBeforeSubmitAction: "هل تريد بالفعل مسح كل الحسابات ما عدا حساب المدير ؟؟",
                textAfterSubmitAction: "تم الحذف بنجاح",
                runFunctionAfterConfirm() {
                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "حذف كل حسابات الكباتن",
                        description: `حساب رقم ${state.logInfo?.id} قام بحذف كل حسابات الكباتن`,
                        reportedBy: "بيمو"
                    } as reports_Type) as any);

                    dispatch(changeLogInInfo(null));
                    dispatch(deleteAllRowsInAccountsTable() as any);

                    navigate(logInPagePath);
                },
            })
        }
    }

    function deleteAllDataInProfitsAndExpensesPage() {
        if (Number(state.years?.length) == 0) {
            normalAlert({
                icon: "info",
                title: "تمهل",
                text: "لا يوجد بيانات للحذف"
            })
        }
        else {
            customAlert({
                titleBeforeSubmit: "تمهل يا رجل",
                textBeforeSubmitAction: "هل تريد بالفعل مسح كل السنين والشهور والايام في صفحة الارباح والمصروفات ؟؟",
                textAfterSubmitAction: "تم الحذف بنجاح",
                runFunctionAfterConfirm: async function () {
                    const db = await Database.load("sqlite:gym-app.db");

                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "حذف كل بيانات الارباح والمصروفات",
                        description: `حساب رقم ${state.logInfo?.id} قام بحذف كل بيانات الارباح والمصروفات`,
                        reportedBy: "بيمو"
                    } as reports_Type) as any);

                    try {
                        await db.execute(`
                            PRAGMA foreign_keys = OFF;

                            DELETE FROM yearsProfitsAndExpenses;
                            DELETE FROM monthsProfitsAndExpenses;
                            DELETE FROM daysProfitsAndExpenses;
                            DELETE FROM items;

                            DELETE FROM sqlite_sequence WHERE name IN (
                                'yearsProfitsAndExpenses',
                                'monthsProfitsAndExpenses',
                                'daysProfitsAndExpenses',
                                'items'
                            );

                            PRAGMA foreign_keys = ON;
                        `);

                        dispatch(getAllRowsInYearsProfitsAndExpensesTable() as any);
                    }
                    catch (err) {
                        normalAlert({
                            title: "حدث خطا اثناء مسح البيانات الخاصه بالارباح والمصروفات",
                            text: String(err),
                            icon: "error"
                        });
                    }
                },
            });
        }
    }



    useEffect(function () {
        if (
            isActiveMoreSessionInDay != JSON.parse(state.settings.isActiveMoreSessionInDay as any)
            ||
            isDeleteSomeTrainersWhoNotRenwal != JSON.parse(state.settings.isDeleteSomeTrainersWhoNotRenwal as any)
        ) {
            setIsChangeInfo(true);
        }
        else {
            setIsChangeInfo(false);
        }
    }, [
        isActiveMoreSessionInDay, isDeleteSomeTrainersWhoNotRenwal,
        state.settings.isActiveMoreSessionInDay, state.settings.isDeleteSomeTrainersWhoNotRenwal
    ]);




    return <section className="my-10 grid gap-5 select-none">
        <h2 className="text-4xl mb-5 font-bold">
            إعدادات اخرى
        </h2>

        {/* Active more sessions in day */}
        <Box_for_setting
            title="تفعيل اكثر من حصه في اليوم الواحد"
            discription="هذا الإجراء تحت التطوير .. إذا تم تفعيله ينصح بعدم إغلاقه حتى يأتي اليوم الجديد"
        >
            <Toggle_Btn
                value={isActiveMoreSessionInDay as boolean}
                onGetValue={setIsActiveMoreSessionInDay as any}
            />
        </Box_for_setting>

        {/* Remove some trainers */}
        <Box_for_setting
            title="حذف بعض المتدربين"
            discription="الذين لم يتم تجديد الاشتراك الخاص بهم منذ ستة اشهر ; للتحسين من اداء البرنامج"
        >
            <Toggle_Btn
                value={isDeleteSomeTrainersWhoNotRenwal as boolean}
                onGetValue={setIsDeleteSomeTrainersWhoNotRenwal as any}
            />
        </Box_for_setting>


        {/* Btns */}
        <div className="flex gap-2 justify-end">
            {
                isChangeInfo ?
                    <Custom_Btn onClick={cancelChanges}>
                        <X size={25} />
                    </Custom_Btn>
                    :
                    <button className="text-neutral-500 cursor-not-allowed" >
                        <X size={30} />
                    </button>
            }


            {
                isChangeInfo ?
                    <Custom_Btn
                        className="bg-emerald-500! border-emerald-600!"
                        onClick={saveChanges}
                    >
                        <Save size={25} />
                    </Custom_Btn>
                    :
                    <button className="text-neutral-500 cursor-not-allowed">
                        <Save size={30} />
                    </button>
            }
        </div>

        <Custom_Line />

        {/* Warning */}
        <div className="bg-red-100 border-2 border-red-500 p-10 rounded-lg grid gap-5">
            <h3 className="text-red-500 text-2xl font-bold">
                منطقة الإجراءات
            </h3>

            {/* Remove All trainers */}
            <Box_for_setting title="حذف كل المتدربين">
                <Custom_Btn onClick={deleteAllTrainers}>
                    <Trash />
                </Custom_Btn>
            </Box_for_setting>

            {/* Remove All subscription menus */}
            <Box_for_setting title="حذف كل قوائم الاشتراكات">
                <Custom_Btn onClick={deleteAllSubscriptionsMenu}>
                    <Trash />
                </Custom_Btn>
            </Box_for_setting>

            {/* Remove All Accountes */}
            <Box_for_setting
                title="حذف كل حسابات الكباتن"
                discription="لن يتم حذف حساب المدير"
            >
                <Custom_Btn onClick={deleteAllAccounts}>
                    <Trash />
                </Custom_Btn>
            </Box_for_setting>

            {/* Remove All Data for profites and expenses */}
            <Box_for_setting title="حذف بيانات الارباح والمصروفات">
                <Custom_Btn onClick={deleteAllDataInProfitsAndExpensesPage}>
                    <Trash />
                </Custom_Btn>
            </Box_for_setting>
        </div>
    </section>
}