import The_Setting from "./Components/The-setting/The_Setting";
import Update_App from "./Components/Update-app/Update_App"
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Save, Trash, X } from "lucide-react";
import { alert, normalAlert } from "@/Lib/functions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { deleteAllRowsInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { store_Type } from "@/Rtk/types";
import { deleteAllRowsInSubscriptionsMenusTable } from "@/Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import { deleteAllRowsInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { changeLogInInfo } from "@/Rtk/Slices/UI-slices/logInInfoSlice";
import Database from "@tauri-apps/plugin-sql";
import { getAllRowsInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { updateSomePropertiesInRowInSettingsTable } from "@/Rtk/Slices/Db-slices/settingsSlice";
import { deleteAllRowsInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
// ========================================================== //
export default function Settings_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            trainers: state.trainers,
            subscriptionsMenus: state.subscriptionsMenus,
            accounts: state.accounts,
            years: state.yearsProfitsAndExpenses,
            settings: state.settings
        }
    }, shallowEqual);


    const [isChangeInfo, setIsChangeInfo] = useState(false);
    const [isSaveInfo, setIsSaveInfo] = useState(false);


    const [rowsInTrainerTable, setRowsInTrainerTable] = useState(state.settings.rowsInTrainerTable);
    const [rowsInAttendanceTable, setRowsInAttendanceTable] = useState(state.settings.rowsInAttendanceTable);
    const [rowsInItemsTable, setRowsInItemsTable] = useState(state.settings.rowsInItemsTable);




    function clickOnCancel() {
        if (isChangeInfo) {
            alert({
                textBeforeSubmit: "هل تريد بالفعل إلغاء التغيرات",
                runFunctionAfterSubmit() {
                    setRowsInTrainerTable(state.settings.rowsInTrainerTable)
                    setRowsInAttendanceTable(state.settings.rowsInAttendanceTable);
                    setRowsInItemsTable(state.settings.rowsInItemsTable);


                    setIsChangeInfo(false);
                    setIsSaveInfo(false);
                },
            })
        }
    }

    function clickOnSaveChanges() {
        if (!isSaveInfo) return;


        alert({
            titleAfterSubmit:"تهانينا",
            textBeforeSubmit: "هل تريد حفظ التغيرات",
            textAfterSubmit: "تم التحديث بنجاح",
            runFunctionAfterSubmit() {
                dispatch(updateSomePropertiesInRowInSettingsTable({
                    rowsInTrainerTable,
                    rowsInAttendanceTable,
                    rowsInItemsTable
                }) as any);


                setIsChangeInfo(false);
                setIsSaveInfo(false);
            },
        });
    }

    function checkTheSaveChanges() {
        if (!rowsInTrainerTable || !rowsInAttendanceTable || !rowsInItemsTable) {
            setIsSaveInfo(false);
            return;
        }


        if (
            rowsInTrainerTable != state.settings.rowsInTrainerTable
            ||
            rowsInAttendanceTable != state.settings.rowsInAttendanceTable
            ||
            rowsInItemsTable != state.settings.rowsInItemsTable
        ) {
            setIsSaveInfo(true);
        }
        else {
            setIsSaveInfo(false);
        }
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
            alert({
                titleBeforeSubmit: "تمهل يا رجل",
                textBeforeSubmit: "هل تريد بالفعل مسح كل المتدربين ؟؟",
                textAfterSubmit: "تم الحذف بنجاح",
                runFunctionAfterSubmit() {
                    dispatch(deleteAllRowsInTrainersTable() as any);
                    dispatch(deleteAllRowsInAttendanceTable() as any);
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
            alert({
                titleBeforeSubmit: "تمهل يا رجل",
                textBeforeSubmit: "هل تريد بالفعل مسح كل قوائم الاشتراكات ؟؟",
                textAfterSubmit: "تم الحذف بنجاح",
                runFunctionAfterSubmit() {
                    dispatch(deleteAllRowsInSubscriptionsMenusTable() as any);
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
            alert({
                titleBeforeSubmit: "تمهل يا رجل",
                textBeforeSubmit: "هل تريد بالفعل مسح كل الحسابات ما عدا حساب المدير ؟؟",
                textAfterSubmit: "تم الحذف بنجاح",
                runFunctionAfterSubmit() {
                    dispatch(changeLogInInfo(null));
                    dispatch(deleteAllRowsInAccountsTable() as any);
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
            alert({
                titleBeforeSubmit: "تمهل يا رجل",
                textBeforeSubmit: "هل تريد بالفعل مسح كل السنين والشهور والايام في صفحة الارباح والمصروفات ؟؟",
                textAfterSubmit: "تم الحذف بنجاح",
                runFunctionAfterSubmit: async function () {
                    const database = await Database.load("sqlite:gym-app.db");

                    try {
                        await database.execute(`
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
                            title: "error",
                            text: String(err),
                            icon: "error"
                        });

                        console.log(err);
                    }
                },
            });
        }
    }







    useEffect(function () {
        if (
            rowsInTrainerTable != state.settings.rowsInTrainerTable
            ||
            rowsInAttendanceTable != state.settings.rowsInAttendanceTable
            ||
            rowsInItemsTable != state.settings.rowsInItemsTable
        ) {
            setIsChangeInfo(true);
        }
        else {
            setIsChangeInfo(false);
        }


        checkTheSaveChanges();
    }, [rowsInTrainerTable, rowsInAttendanceTable, rowsInItemsTable]);



    return <section className="select-none">
        {/* All settings */}
        <div className="grid gap-3 p-3">
            <The_Setting
                title="عدد الصفوف في جدول المتدربين"
                discription="هل تريد إمكانية حذف السنين والشهور والايام في صفحة الارباح والمصروفات"
                typeSetting={{
                    element: <Inp_With_Label
                        inpValue={rowsInTrainerTable == 0 ? "" : rowsInTrainerTable}
                        inpType="number"
                        className="text-center border-3"
                        onWriteInInput={setRowsInTrainerTable}
                    />
                }}
            />

            <The_Setting
                title="عدد الصفوف في جدول سجل الحضور"
                discription="هل تريد إمكانية حذف السنين والشهور والايام في صفحة الارباح والمصروفات"
                typeSetting={{
                    element: <Inp_With_Label
                        inpValue={rowsInAttendanceTable == 0 ? "" : rowsInAttendanceTable}
                        inpType="number"
                        className="text-center border-3"
                        onWriteInInput={setRowsInAttendanceTable}
                    />
                }}
            />

            <The_Setting
                title="عدد الصفوف في جدول البنود"
                discription="هل تريد إمكانية حذف السنين والشهور والايام في صفحة الارباح والمصروفات"
                typeSetting={{
                    element: <Inp_With_Label
                        inpValue={rowsInItemsTable == 0 ? "" : rowsInItemsTable}
                        inpType="number"
                        className="text-center border-3"
                        onWriteInInput={setRowsInItemsTable}
                    />
                }}
            />

            <Accordion>
                <AccordionTab
                    header="اعدادات اضافيه"
                    headerClassName="flex text-2xl"
                    contentClassName="*:grid *:gap-3"
                >
                    <The_Setting
                        title="حذف كل المتدربين"
                        typeSetting={{
                            element: <Trash
                                size={40}
                                className="text-red-500 cursor-pointer hover:text-red-400"
                                onClick={deleteAllTrainers}
                            />
                        }}
                    />

                    <The_Setting
                        title="حذف كل قوائم الاشتراكات"
                        typeSetting={{
                            element: <Trash
                                size={40}
                                className="text-red-500 cursor-pointer hover:text-red-400"
                                onClick={deleteAllSubscriptionsMenu}
                            />
                        }}
                    />

                    <The_Setting
                        title="حذف كل الحسابات"
                        typeSetting={{
                            element: <Trash
                                size={40}
                                className="text-red-500 cursor-pointer hover:text-red-400"
                                onClick={deleteAllAccounts}
                            />
                        }}
                    />

                    <The_Setting
                        title="حذف بيانات الارباح والمصروفات"
                        typeSetting={{
                            element: <Trash
                                size={40}
                                className="text-red-500 cursor-pointer hover:text-red-400"
                                onClick={deleteAllDataInProfitsAndExpensesPage}
                            />
                        }}
                    />
                </AccordionTab>
            </Accordion>
        </div>

        {/* Btns */}
        <div className="flex gap-2 justify-end">
            <X
                size={30}
                className={`
                    duration-300
                    ${isChangeInfo ? "cursor-pointer text-red-500" : "cursor-not-allowed text-neutral-500"}
                `}
                onClick={clickOnCancel}
            />

            <Save
                size={30}
                className={`
                    duration-300
                    ${isSaveInfo ? "cursor-pointer text-emerald-500" : "cursor-not-allowed text-neutral-500"}
                `}

                onClick={clickOnSaveChanges}
            />
        </div>

        <div className="w-full h-0.5 bg-black my-3"></div>

        <Update_App />
    </section>
}