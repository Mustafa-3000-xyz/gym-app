import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import Box_for_setting from "../Components/Box_for_setting";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { customAlert, normalAlert } from "@/Lib/functions";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { InputText } from "primereact/inputtext";
import { updateAnyPropertyInRowInSettingsTable } from "@/Rtk/Slices/Db-slices/settingsSlice";
// ========================================================== //
export default function Preferences_Page() {
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

    const [rowsInTrainerTable, setRowsInTrainerTable] = useState(state.settings.rowsInTrainerTable);
    const [rowsInAttendanceTable, setRowsInAttendanceTable] = useState(state.settings.rowsInAttendanceTable);
    const [rowsInItemsTable, setRowsInItemsTable] = useState(state.settings.rowsInItemsTable);





    function saveChanges() {
        const messegesError = [];

        if (rowsInTrainerTable == 0 || rowsInTrainerTable < 6) {
            messegesError.push("يجب ان عدد الصفوف في جدول المتدربين لا تقل عن ستة صفوف");
        }

        if (rowsInAttendanceTable == 0 || rowsInAttendanceTable < 6) {
            messegesError.push("يجب ان عدد الصفوف في جدول سجل الحضور لا تقل عن ستة صفوف");
        }

        if (rowsInItemsTable == 0 || rowsInItemsTable < 6) {
            messegesError.push("يجب ان عدد الصفوف في جدول البنود لا تقل عن ستة صفوف");
        }


        if (messegesError.length > 0) {
            normalAlert({
                title: "يوجد خطأ",
                text: messegesError.join(" / "),
                icon: "error"
            });
        }
        else {
            customAlert({
                textBeforeSubmitAction: "هل تريد حفظ التغيرات",
                titleAfterSubmit: "تهانينا",
                textAfterSubmitAction: "تم التحديث بنجاح",
                runFunctionAfterConfirm() {
                    dispatch(updateAnyPropertyInRowInSettingsTable({
                        rowsInTrainerTable,
                        rowsInAttendanceTable,
                        rowsInItemsTable
                    }) as any);


                    setIsChangeInfo(false);
                }
            });
        }
    }

    function clickOnCancel() {
        if (isChangeInfo) {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل إلغاء التغيرات",
                runFunctionAfterConfirm() {
                    setRowsInTrainerTable(state.settings.rowsInTrainerTable)
                    setRowsInAttendanceTable(state.settings.rowsInAttendanceTable);
                    setRowsInItemsTable(state.settings.rowsInItemsTable);


                    setIsChangeInfo(false);
                },
            })
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
    }, [rowsInTrainerTable, rowsInAttendanceTable, rowsInItemsTable]);




    return <section className="mt-10">
        <h2 className="text-4xl mb-5 font-bold">
            التفضيلات
        </h2>

        {/* Inputs */}
        <div className="flex flex-col gap-5">
            <Box_for_setting title="عدد الصفوف في العمود الواحد لجدول المتدربين">
                <InputText
                    type="number"
                    className="text-center font-bold"
                    value={Number(rowsInTrainerTable) as any}
                    onChange={(e) => setRowsInTrainerTable(Number(e.target.value))}
                />
            </Box_for_setting>

            <Box_for_setting title="عدد الصفوف في العمود الواحد لجدول سجل الحضور">
                <InputText
                    type="number"
                    className="text-center font-bold"
                    value={Number(rowsInAttendanceTable) as any}
                    onChange={(e) => setRowsInAttendanceTable(Number(e.target.value))}
                />
            </Box_for_setting>

            <Box_for_setting title="عدد الصفوف في العمود الواحد لجدول البنود">
                <InputText
                    type="number"
                    className="text-center font-bold"
                    value={Number(rowsInItemsTable) as any}
                    onChange={(e) => setRowsInItemsTable(Number(e.target.value))}
                />
            </Box_for_setting>
        </div>

        {/* Btns */}
        <div className="flex gap-2 justify-end mt-10">
            {
                isChangeInfo ?
                    <Custom_Btn onClick={clickOnCancel}>
                        <X size={25} />
                    </Custom_Btn>
                    :
                    <button className="text-neutral-500 cursor-not-allowed"  >
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
    </section>
}