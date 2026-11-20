import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import Popup_Component from "@/Global-components/Popup-component/Popup_Component";
import { listOfMonthes } from "@/Lib/constants";
import { customAlert, normalAlert } from "@/Lib/functions";
import { Months_Layers_Props } from "@/Pages/typesProps";
import { addRowInMonthsProfitsAndExpensesTable, updateAnyPropertyInRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { Package, Pen, Save, X } from "lucide-react";
import { InputText } from "primereact/inputtext";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Months_Layers(
    { onGetMonthInfo, yearId, allMonths }: Months_Layers_Props
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
        monthName: null as string | null,
        monthNumber: null as number | null
    });

    // These for when create new month
    const [monthTargetInp, setMonthTargetInp] = useState(0);
    const [monthInfoSelected, setMonthInfoSelected] = useState({
        title: "",
        monthNumber: 0,
    });


    // This for when create new month
    const readMonths = useMemo(() => {
        if (allMonths.length == 0) {
            return listOfMonthes;
        }


        const result = listOfMonthes.filter(function (ele) {
            const search = allMonths.find(mm => mm.monthNumber == ele.monthNumber);

            if (!search) {
                return ele
            }
        });


        return result;
    }, [allMonths]);





    function clickOnCreateNewLayer() {
        if (yearId == null) {
            normalAlert({
                title: "تنبيه",
                text: "يجب اختيار السنه اولا",
                icon: "info"
            });

            return;
        }

        if (allMonths.length == listOfMonthes.length) {
            normalAlert({
                title: "تنبيه",
                text: "لقد تم إنشاء كل الشهور في السنه المختاره",
                icon: "info"
            });

            return;
        }


        setIsShowCreateNewLayer(true);
    }

    function saveData() {
        const errorsMessagesList = [];


        if (!monthInfoSelected.title) {
            errorsMessagesList.push("يجب اختيار الشهر");
        }

        if (!monthTargetInp) {
            errorsMessagesList.push("يجب كتابة مبلغ للهدف الشهري")
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
                textBeforeSubmitAction: "هل تريد بالفعل إنشاء ذلك الشهر ؟",
                textAfterSubmitAction: "تم إنشاء الشهر بنجاح",
                runFunctionAfterConfirm: function () {
                    dispatch(addRowInMonthsProfitsAndExpensesTable({
                        linkWithYear: Number(yearId),
                        monthName: monthInfoSelected.title,
                        monthNumber: Number(monthInfoSelected.monthNumber),
                        profitsTotal: 0,
                        expensesTotal: 0,
                        target: monthTargetInp,
                    }) as any);


                    setMonthTargetInp(0);
                    setMonthInfoSelected({
                        title: "",
                        monthNumber: 0
                    });


                    setIsShowCreateNewLayer(false);
                }
            });
        }
    }

    function cancel() {
        if (monthInfoSelected.title || monthTargetInp) {
            customAlert({
                textBeforeSubmitAction: "هل انت متأكد من عدم استكمال البيانات ؟",
                runFunctionAfterConfirm: function () {
                    setMonthTargetInp(0);
                    setMonthInfoSelected({
                        title: "",
                        monthNumber: 0
                    });

                    setIsShowCreateNewLayer(false);
                }
            })
        }
        else {
            setIsShowCreateNewLayer(false);
        }
    }

    function saveChanges() {
        const errorsMessagesList = [];


        if (!profitsTotalInput) {
            errorsMessagesList.push("يجب كتابة مجموع الارباح الجديد");
        }


        if (!expensesTotalInput) {
            errorsMessagesList.push("يجب كتابة مجموع المصروفات الجديد");
        }

        if (!targetInput) {
            errorsMessagesList.push("يجب كتابة الهدف السنوي الجديد");
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
                textBeforeSubmitAction: "هل تريد بالفعل تعديل ذلك الشهر ؟",
                textAfterSubmitAction: "تم التعديل بنجاح",
                runFunctionAfterConfirm: function () {
                    dispatch(updateAnyPropertyInRowInMonthsProfitsAndExpensesTable({
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




    // Remove old data when select new year
    useEffect(function () {
        setLayerInfo({
            id: null,
            monthName: null,
            monthNumber: null
        })
    }, [yearId]);

    useEffect(function () {
        // Send data
        if (layerInfo?.id != null) {
            onGetMonthInfo(layerInfo as any);
        }


        if (layerInfo?.id != layerIdForEditing) {
            setIsEditing(false);
            setLayerIdForEditing(-1);
        }
    }, [layerInfo]);






    return <div>
        {/* Title & icon */}
        <div className="flex itmes-center gap-2 font-bold mb-2">
            <Package size={33} />

            <h3 className="text-2xl">
                التقارير الشهريه
            </h3>
        </div>


        <Custom_Btn
            className="bg-emerald-500! border-emerald-600! w-full py-3"
            onClick={clickOnCreateNewLayer}
        >
            <p className="font-bold text-lg">
                إنشاء شهر جديد
            </p>
        </Custom_Btn>


        {/* All Boxes */}
        <div className="flex flex-col items-center gap-3 p-5 max-h-[70vh] overflow-y-auto">
            {
                allMonths.length > 0 ?
                    allMonths.map((ele, i) => <div
                        key={i}
                        className={`
                            border-r-5 border-white duration-300 w-full p-5 rounded-lg bg-slate-100
                            ${ele.id != layerInfo?.id ? "cursor-pointer" : ""}
                            ${ele.id == layerInfo?.id ? "border-r-amber-500 border-r-10" : ""}
                        `}
                        onClick={() => setLayerInfo({
                            id: Number(ele.id),
                            monthName: ele.monthName,
                            monthNumber: Number(ele.monthNumber)
                        })}
                    >
                        {/* Title */}
                        <h3 className="text-2xl font-bold opacity-30 mb-5">
                            شهر {ele.monthName}
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
                                                value={profitsTotalInput == 0 ? "" : profitsTotalInput}
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
                                                value={expensesTotalInput == 0 ? "" : expensesTotalInput}
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
                                        الهدف  الشهري :
                                    </h3>

                                    {
                                        isEditing && ele.id == layerIdForEditing ?
                                            <input
                                                type="number"
                                                className="text-center border-b-2 focus:outline-0 w-20 font-bold"
                                                value={targetInput == 0 ? "" : targetInput}
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
                                            <X
                                                size={20}
                                                className="duration-300 cursor-pointer hover:scale-110"
                                            />
                                        </Custom_Btn>

                                        <Custom_Btn
                                            className="bg-emerald-500! border-emerald-600!"
                                            onClick={saveChanges}
                                        >
                                            <Save
                                                size={20}
                                                className="duration-300 cursor-pointer hover:scale-110"
                                            />
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
                                        <Pen
                                            size={20}
                                            className="duration-300 cursor-pointer hover:scale-110"
                                        />
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
                title="إنشاء شهر جديد"
                classNameForParent="h-[50vh]"
                classNameForContainer="grid grid-cols-2 items-center gap-5"
                clickOnSaveBtn={saveData}
                clickOnCancel={cancel}
            >
                <div className="h-[50px] mt-7">
                    <Drop_Menu>
                        <Top_Content_For_The_Drop>
                            {
                                monthInfoSelected.title || "اسامي الشهور"
                            }
                        </Top_Content_For_The_Drop>

                        <Bottom_Content_For_The_Drop className="flex justify-center gap-3">
                            {
                                readMonths.map((ele, i) => {
                                    return <p
                                        key={i}
                                        className="bg-slate-200 p-2 rounded-lg cursor-pointer hover:bg-slate-100"
                                        onClick={() => setMonthInfoSelected({
                                            title: ele.month,
                                            monthNumber: ele.monthNumber
                                        })}
                                    >
                                        {ele.month}
                                    </p>
                                })
                            }
                        </Bottom_Content_For_The_Drop>
                    </Drop_Menu>
                </div>

                {/* Target */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">
                        الهدف الشهري
                    </label>

                    <InputText
                        type="number"
                        placeholder="000"
                        className="text-center w-full font-bold"
                        value={monthTargetInp == 0 ? "" : monthTargetInp as any}
                        onChange={(e) => setMonthTargetInp(Number(e.target.value))}
                    />
                </div>
            </Popup_Component>
        }
    </div>
}