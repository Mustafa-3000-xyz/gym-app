import Progress from "@/Global-components/Progress/Progress";
import { maxTargetInDay, maxTargetInMonth, maxTargetInYear } from "@/Lib/constants";
import { Info_Box_For_Profits_Expenses_Props } from "@/Pages/typesProps";
import { updatePropertyInRowInDaysProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { updatePropertyInRowInMonthsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { updatePropertyInRowYearsInProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { Pen, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Info_Box_For_Profits_Expenses(
    {
        id,
        mainTitle,
        title,
        profitsTotal,
        expensesTotal,
        target,
        targetType,
        isHiddenTheWord = true,
        className,
        styleBoxWhenSelect = null,
        monthNumber,
        onGetBoxInfo
    }: Info_Box_For_Profits_Expenses_Props
) {
    const dispatch = useDispatch();


    const [isEditingBox, setIsEditingBox] = useState(false);
    const [targetInfoForEditing, setTargetInfoForEditing] = useState(0);
    const [targetInp, setTargetInp] = useState(0);
    const [netProfit, setNetProfit] = useState(0);



    function clickOnBox(id: number, mainTitle: number | string) {
        if (monthNumber) {
            onGetBoxInfo({
                id,
                title: mainTitle,
                monthNumber
            });
        }
        else {
            onGetBoxInfo({
                id,
                title: mainTitle,
            });
        }
    }

    function clickOnPenBtn(e: React.MouseEvent) {
        e.stopPropagation();
        setIsEditingBox(true);
    }

    function clickOnSaveBtn(e: React.MouseEvent) {
        e.stopPropagation();

        if (targetInp == 0) return;


        if (targetType == "year") {
            dispatch(updatePropertyInRowYearsInProfitsAndExpensesTable({
                id: Number(id),
                column: "target",
                value: targetInp
            }) as any);

            cancelChanges(e);
        }
        else if (targetType == "month") {
            dispatch(updatePropertyInRowInMonthsProfitsAndExpensesTable({
                id: Number(id),
                column: "target",
                value: targetInp
            }) as any);

            cancelChanges(e);
        }
        else {
            dispatch(updatePropertyInRowInDaysProfitsAndExpensesTable({
                id: Number(id),
                column: "target",
                value: targetInp
            }) as any);

            cancelChanges(e);
        }
    }

    function cancelChanges(e: React.MouseEvent) {
        e.stopPropagation();

        setIsEditingBox(false);
        setTargetInfoForEditing(0);
        setTargetInp(0);
    }



    useEffect(function () {
        if (isEditingBox) {
            const result = targetType == "year" ? maxTargetInYear
                : targetType == "month" ? maxTargetInMonth
                    : maxTargetInDay;

            setTargetInfoForEditing(result);
        }
    }, [isEditingBox]);

    useEffect(function () {
        setNetProfit(profitsTotal - Math.abs(expensesTotal));
    }, [profitsTotal, expensesTotal]);




    return <div
        className={`duration-300 w-full p-5 rounded-lg bg-slate-100 ${className}`}
        style={{
            boxShadow: styleBoxWhenSelect ? `6px 0px ${styleBoxWhenSelect}` : "none"
        }}
        onClick={() => clickOnBox(id, mainTitle)}
    >
        {/* Title */}
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-bold opacity-30">
                {title}
            </h3>

            {
                !isHiddenTheWord ?
                    <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                        الحالي
                    </h3>
                    :
                    null
            }
        </div>

        {/* Infos */}
        <div className="mb-2">
            <ul className="list-disc ps-4">
                <li className="font-bold text-red-500">
                    مجموع المصروفات : {expensesTotal}$
                </li>

                <li className="font-bold text-amber-500">
                    <span className="mx-1">
                        الهدف
                    </span>
                    {
                        isEditingBox ?
                            <input
                                value={targetInp == 0 ? "" : targetInp}
                                type="number"
                                placeholder={`الحد الاقصى (${targetInfoForEditing})`}
                                className="border-2 border-black rounded-lg p-2 text-black focus:outline-0"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    if (Number(e.target.value) <= targetInfoForEditing) {
                                        setTargetInp(Number(e.target.value));
                                    } else {
                                        setTargetInp(targetInfoForEditing);
                                    }
                                }}
                            />
                            :
                            <>
                                {
                                    targetType == "year" ?
                                        "السنوي"
                                        :
                                        targetType == "month" ? "الشهري" : "اليومي"
                                } :
                                {target}$
                            </>
                    }
                </li>

                <li className="font-bold text-emerald-500">
                    مجموع الارباح : {profitsTotal}$
                </li>
            </ul>

            <Progress
                widthChild={(profitsTotal - expensesTotal) / target * 100}
                percentage={Number.isInteger(netProfit / target * 100) ? netProfit / target * 100 : (netProfit / target * 100).toFixed(2) as any}
            />
        </div>

        {/* Profits & tools */}
        <div>
            {/* Profits */}
            <h3 className="font-bold text-2xl">
                صافي الربح : {profitsTotal - expensesTotal}$
            </h3>

            <hr className="my-3" />

            {/* Tools */}
            <div className="flex justify-end items-center gap-2">
                {
                    isEditingBox ?
                        <>
                            <X
                                size={27}
                                className="duration-300 text-red-500 cursor-pointer hover:scale-110"
                                onClick={(e) => cancelChanges(e)}
                            />
                            <Save
                                size={27}
                                className={`
                                    duration-300 
                                    ${!targetInp ? "opacity-45 cursor-not-allowed text-gray-500" : "cursor-pointer hover:scale-110 text-emerald-500"}
                                `}
                                onClick={(e) => clickOnSaveBtn(e)}
                            />
                        </>
                        :
                        <Pen
                            size={27}
                            className="duration-300 text-emerald-500 cursor-pointer hover:scale-110"
                            onClick={(e) => clickOnPenBtn(e)}
                        />
                }
            </div>
        </div>
    </div>
}