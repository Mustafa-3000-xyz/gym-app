import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { Years_Box_Props } from "@/Pages/typesProps";
import { PackageOpen, Pen, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { yearsProfitsAndExpenses_Type } from "@/Pages/types";
import Popup_Component from "@/Global-components/Popup-component/Popup_Component";
import { InputText } from "primereact/inputtext";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { customAlert, normalAlert } from "@/Lib/functions";
import { useDispatch } from "react-redux";
import { addRowInYearsProfitsAndExpensesTable, updateِAnyPropertyInRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
export default function Years_Layers(
    { onGetYearInfo, allYears }: Years_Box_Props
) {
    const dispatch = useDispatch();


    const [isEditing, setIsEditing] = useState(true);
    const [layerIdForEditing, setLayerIdForEditing] = useState(0);
    const [profitsTotalInput, setProfitsTotalInput] = useState<number>(0);
    const [expensesTotalInput, setExpensesTotalInput] = useState<number>(0);
    const [targetInput, setTargetInput] = useState<number>(0);

    const [isShowCreateNewLayer, setIsShowCreateNewLayer] = useState(false);
    const [layerInfo, setLayerInfo] = useState({
        id: null as number | null,
        yearNumber: null as number | null
    });

    const [yearNumInp, setYearNumInp] = useState(0);
    const [yearTargetInp, setYearTargetInp] = useState(0);




    async function saveData() {
        const db = await Database.load("sqlite:gym-app.db");
        const errorsMessagesList = [];

        const [getYear] = await db.select(`
            SELECT * from yearsProfitsAndExpenses WHERE yearNumber = ${yearNumInp}
        `) as yearsProfitsAndExpenses_Type[];



        if (getYear) {
            errorsMessagesList.push("يجب كتابة سنه غير موجوده");
        }

        if (`${yearNumInp}`.length != 4) {
            errorsMessagesList.push("يجب ان السنه تتكون من اربعة ارقام");
        }

        if (!yearTargetInp) {
            errorsMessagesList.push("يجب كتابة مبلغ للهدف السنوي");
        }


        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات غير صالحه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            })
        }
        else {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل إنشاء تلك السنه ؟",
                textAfterSubmitAction: "تم إنشاء السنه بنجاح",
                runFunctionAfterConfirm: function () {
                    dispatch(addRowInYearsProfitsAndExpensesTable({
                        yearNumber: yearNumInp,
                        profitsTotal: 0,
                        expensesTotal: 0,
                        target: yearTargetInp
                    }) as any);


                    setYearNumInp(0);
                    setYearTargetInp(0);
                    setIsShowCreateNewLayer(false);
                }
            });
        }
    }

    function cancel() {
        if (yearNumInp || yearTargetInp) {
            customAlert({
                textBeforeSubmitAction: "هل انت متأكد من عدم استكمال البيانات ؟",
                runFunctionAfterConfirm: function () {
                    setIsShowCreateNewLayer(false);
                    setYearNumInp(0);
                    setYearTargetInp(0);
                }
            })
        }
        else {
            setIsShowCreateNewLayer(false);
        }
    }

    function saveChanges() {
        customAlert({
            textBeforeSubmitAction: "هل تريد بالفعل تعديل تلك السنه ؟",
            textAfterSubmitAction: "تم التعديل بنجاح",
            runFunctionAfterConfirm: function () {
                dispatch(updateِAnyPropertyInRowInYearsProfitsAndExpensesTable({
                    id: Number(layerIdForEditing),
                    values: {
                        profitsTotal: profitsTotalInput,
                        expensesTotal: expensesTotalInput,
                        target: targetInput
                    }
                }) as any);


                setProfitsTotalInput(0);
                setExpensesTotalInput(0);
                setTargetInput(0);

                setLayerIdForEditing(-1);
                setIsEditing(false);
            }
        });
    }

    function cancelChanges() {
        if (profitsTotalInput || expensesTotalInput || targetInput) {
            customAlert({
                textBeforeSubmitAction: "هل انت متأكد من عدم استكمال البيانات ؟",
                runFunctionAfterConfirm: function () {
                    setProfitsTotalInput(0);
                    setExpensesTotalInput(0);
                    setTargetInput(0);

                    setLayerIdForEditing(-1);
                    setIsEditing(false);
                }
            })
        }
        else {
            setLayerIdForEditing(-1);
            setIsEditing(false);
        }
    }




    useEffect(function () {
        // Send data
        if (layerInfo?.id != null) {
            onGetYearInfo({
                id: Number(layerInfo?.id),
                yearNumber: Number(layerInfo?.yearNumber)
            });
        }


        if (layerInfo?.id != layerIdForEditing) {
            setIsEditing(false);
            setLayerIdForEditing(-1);
        }
    }, [layerInfo]);




    return <div>
        {/* Title & icon */}
        <div className="flex itmes-center gap-2 font-bold mb-2">
            <PackageOpen size={33} />

            <h3 className="text-2xl">
                التقارير السنويه
            </h3>
        </div>

        <Custom_Btn
            className="bg-emerald-500! border-emerald-600! w-full py-3"
            onClick={() => setIsShowCreateNewLayer(true)}
        >
            <p className="font-bold text-lg">
                إنشاء سنه جديده
            </p>
        </Custom_Btn>

        {/* All Boxes */}
        <div className="flex flex-col items-center gap-3 p-5 max-h-[70vh] overflow-y-auto">
            {
                allYears.length > 0 ?
                    allYears.map((ele, i) => <div
                        key={i}
                        className={`
                            border-r-5 border-white duration-300 w-full p-5 rounded-lg bg-slate-100
                            ${ele.id != layerInfo?.id ? "cursor-pointer" : ""}
                            ${ele.id == layerInfo?.id ? "border-r-amber-500 border-r-10" : ""}
                        `}
                        onClick={() => setLayerInfo({
                            id: Number(ele.id),
                            yearNumber: ele.yearNumber
                        })}
                    >
                        {/* Title */}
                        <h3 className="text-2xl font-bold opacity-30 mb-5">
                            سنة {ele.yearNumber}
                        </h3>

                        {/* Infos */}
                        <div className="mb-2">
                            <ul>
                                {/* Profites total */}
                                <li className="flex items-center gap-2 font-bold text-emerald-500">
                                    <h3 className="font-bold">
                                        مجموع الارباح :
                                    </h3>

                                    {
                                        isEditing && ele.id == layerIdForEditing ?
                                            <input
                                                type="number"
                                                className="text-center border-b-2 focus:outline-0 w-20 font-bold"
                                                value={profitsTotalInput}
                                                onChange={(e) => setProfitsTotalInput(Number(e.target.value))}
                                            />
                                            :
                                            <span>
                                                {ele.profitsTotal}ج
                                            </span>
                                    }
                                </li>

                                {/* Expensess total */}
                                <li className="flex items-center gap-2 font-bold text-red-500">
                                    <h3 className="font-bold">
                                        مجموع المصروفات :
                                    </h3>

                                    {
                                        isEditing && ele.id == layerIdForEditing ?
                                            <input
                                                type="number"
                                                className="text-center border-b-2 focus:outline-0 w-20 font-bold"
                                                value={expensesTotalInput}
                                                onChange={(e) => setExpensesTotalInput(Number(e.target.value))}
                                            />
                                            :
                                            <span>
                                                {ele.expensesTotal}ج
                                            </span>
                                    }
                                </li>

                                {/* Target */}
                                <li className="flex items-center gap-2 text-amber-500 font-bold">
                                    <h3>
                                        الهدف  السنوي :
                                    </h3>

                                    {
                                        isEditing && ele.id == layerIdForEditing ?
                                            <input
                                                type="number"
                                                className="text-center border-b-2 focus:outline-0 w-20 font-bold"
                                                value={targetInput}
                                                onChange={(e) => setTargetInput(Number(e.target.value))}
                                            />
                                            :
                                            <span>
                                                {ele.target}ج
                                            </span>
                                    }
                                </li>
                            </ul>

                            {/* Profits */}
                            <h3 className="font-bold text-2xl mt-3">
                                صافي الربح : {ele.profitsTotal - ele.expensesTotal}ج
                            </h3>
                        </div>

                        {/* Btns */}
                        <div className="flex justify-end items-center gap-2">
                            {
                                isEditing && layerIdForEditing == ele.id ?
                                    <>
                                        <Custom_Btn
                                            className="px-3!"
                                            onClick={cancelChanges}
                                        >
                                            <X size={20} />
                                        </Custom_Btn>

                                        <Custom_Btn
                                            className="bg-emerald-500! border-emerald-600! px-6!"
                                            onClick={saveChanges}
                                        >
                                            <Save size={20} />
                                        </Custom_Btn>
                                    </>
                                    :
                                    <Custom_Btn
                                        className="bg-emerald-500! border-emerald-600! px-3!"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setLayerIdForEditing(Number(ele.id));
                                        }}
                                    >
                                        <Pen size={20} />
                                    </Custom_Btn>
                            }
                        </div>
                    </div>)
                    :
                    <Not_Found
                        srcImg="/not_found_in_layers.svg"
                    />
            }
        </div>

        {
            isShowCreateNewLayer &&
            <Popup_Component
                title="إنشاء سنه جديده"
                classNameForParent="h-fit"
                classNameForContainer="grid grid-cols-2 gap-5"
                clickOnSaveBtn={saveData}
                clickOnCancel={cancel}
            >
                {/* Year number */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">
                        رقم السنه
                    </label>

                    <InputText
                        type="number"
                        placeholder="yyyy"
                        className="text-center w-full font-bold"
                        value={yearNumInp == 0 ? "" : yearNumInp as any}
                        onChange={(e) => setYearNumInp(Number(e.target.value))}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            isGreenFlag={`${yearNumInp}`.length == 4 ? true : false}
                            maxLength={4}
                            minLength={`${yearNumInp == 0 ? "" : yearNumInp}`.length}
                        />
                    </small>
                </div>

                {/* Target */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">
                        الهدف السنوي
                    </label>

                    <InputText
                        type="number"
                        placeholder="000"
                        className="text-center w-full font-bold"
                        value={yearTargetInp == 0 ? "" : yearTargetInp as any}
                        onChange={(e) => setYearTargetInp(Number(e.target.value))}
                    />
                </div>
            </Popup_Component>
        }
    </div>
}