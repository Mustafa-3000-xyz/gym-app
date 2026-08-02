import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { addNewTrainer, maxForCreateItems, maxPriceInOneItem, renewalSubscription, withDrawSubscription } from "@/Lib/constants";
import { alert } from "@/Lib/functions";
import { regexItemName } from "@/Lib/REGEX";
import { item_Type } from "@/Pages/types";
import { Table_For_Read_Profits_Expenses_Props } from "@/Pages/typesProps";
import { deleteRowInItemsTableById, updateSomePropertiesInRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { store_Type } from "@/Rtk/types";
import { Pen, Save, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Add_Item from "../Add-item/Add_Item";
import { arithmeticOperatorsWithProfitsAndExpenses } from "@/Lib/functionsWithDb";
// ========================================================== //
export default function Table_For_Read_Profits_Expenses(
    {
        yearId,
        monthId,
        dayInfo
    }: Table_For_Read_Profits_Expenses_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            items: state.items,
            days: state.daysProfitsAndExpenses,
            months: state.monthsProfitsAndExpenses,
            years: state.yearsProfitsAndExpenses
        }
    }, shallowEqual);

    const [isEditing, setIsEditing] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isSaveChanges, setIsSaveChanges] = useState(false);

    const [getProfitsTotalInYear, setGetProfitsTotalInYear] = useState(0);
    const [getProfitsTotalInMonth, setGetProfitsTotalInMonth] = useState(0);
    const [getProfitsTotalInDay, setGetProfitsTotalInDay] = useState(0);

    const [getExpensesTotalInYear, setGetExpensesTotalInYear] = useState(0);
    const [getExpensesTotalInMonth, setGetExpensesTotalInMonth] = useState(0);
    const [getExpensesTotalInDay, setGetExpensesTotalInDay] = useState(0);

    // These for when update the item
    const [getMainItemWhenEditing, setGetMainItemWhenEditing] = useState<null | item_Type>(null);
    const [itemIdForEditing, setItemIdForEditing] = useState(0);
    const [itemNameInEditingInp, setItemNameInEditingInp] = useState("");
    const [itemCategoryInEditingInp, setItemCategoryInEditingInp] = useState<"profit" | "expense">("profit");
    const [itemPriceInEditingInp, setItemPriceInEditingInp] = useState(0);




    function clickOnTrashBtn(itemId: number, itemPrice: number, itemCategory: "profit" | "expense") {
        alert({
            titleBeforeClickOnOk: "هل انت متأكد من حذف هذا الباند ؟",
            titleAfterClickOnOk: "تم حذف الباند بنجاح",
            funRunWhenClickOnOk: function () {
                if (itemCategory == "profit") {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "profitsTotal",
                                value: getProfitsTotalInYear - itemPrice
                            },
                            month: {
                                monthId: monthId,
                                column: "profitsTotal",
                                value: getProfitsTotalInMonth - itemPrice
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                column: "profitsTotal",
                                value: getProfitsTotalInDay - itemPrice
                            }
                        }
                    });
                }
                else {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "expensesTotal",
                                value: getExpensesTotalInYear - itemPrice
                            },
                            month: {
                                monthId: monthId,
                                column: "expensesTotal",
                                value: getExpensesTotalInMonth - itemPrice
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                column: "expensesTotal",
                                value: getExpensesTotalInDay - itemPrice
                            }
                        }
                    });
                }

                dispatch(deleteRowInItemsTableById(itemId) as any);
            }
        });
    }

    function clickOnPenBtn(
        itemId: number,
        itemName: string,
        itemCategory: "profit" | "expense",
        itemPrice: number
    ) {
        setItemIdForEditing(itemId);
        setItemNameInEditingInp(itemName);
        setItemCategoryInEditingInp(itemCategory);
        setItemPriceInEditingInp(itemPrice);

        setIsEditing(true);
    }

    function clickOnSaveChangesBtn() {
        if (!isSaveChanges) return;

        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تحديث البيانات",
            titleAfterClickOnOk: "تم التحديث بنجاح",
            funRunWhenClickOnOk: function () {
                // Explain: If item stell profit but his price was changed
                if (
                    (getMainItemWhenEditing?.category == "profit" && itemCategoryInEditingInp == "profit")
                    &&
                    getMainItemWhenEditing?.price != itemPriceInEditingInp
                ) {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "profitsTotal",
                                value: (getProfitsTotalInYear - getMainItemWhenEditing?.price) + itemPriceInEditingInp
                            },
                            month: {
                                monthId: monthId,
                                column: "profitsTotal",
                                value: (getProfitsTotalInMonth - getMainItemWhenEditing?.price) + itemPriceInEditingInp
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                column: "profitsTotal",
                                value: (getProfitsTotalInDay - getMainItemWhenEditing?.price) + itemPriceInEditingInp
                            }
                        }
                    });
                }

                // Explain: If item stell expense but his price was changed
                else if (
                    (getMainItemWhenEditing?.category == "expense" && itemCategoryInEditingInp == "expense")
                    &&
                    getMainItemWhenEditing?.price != itemPriceInEditingInp
                ) {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "expensesTotal",
                                value: (getExpensesTotalInYear - getMainItemWhenEditing?.price) + itemPriceInEditingInp
                            },
                            month: {
                                monthId: monthId,
                                column: "expensesTotal",
                                value: (getExpensesTotalInMonth - getMainItemWhenEditing?.price) + itemPriceInEditingInp
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                column: "expensesTotal",
                                value: (getExpensesTotalInDay - getMainItemWhenEditing?.price) + itemPriceInEditingInp
                            }
                        }
                    });
                }

                // Explain: If item was profit and it is be expense, so update values in year,month and day
                else if (getMainItemWhenEditing?.category == "profit" && itemCategoryInEditingInp == "expense") {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateSomeColumns: {
                            year: {
                                yearId: yearId,
                                profitsTotal: getProfitsTotalInYear - getMainItemWhenEditing.price < 0 ? 0 : getProfitsTotalInYear - getMainItemWhenEditing.price,
                                expensesTotal: getExpensesTotalInYear + itemPriceInEditingInp
                            },
                            month: {
                                monthId: monthId,
                                profitsTotal: getProfitsTotalInMonth - getMainItemWhenEditing.price < 0 ? 0 : getProfitsTotalInMonth - getMainItemWhenEditing.price,
                                expensesTotal: getExpensesTotalInMonth + itemPriceInEditingInp
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                profitsTotal: getProfitsTotalInDay - getMainItemWhenEditing.price < 0 ? 0 : getProfitsTotalInDay - getMainItemWhenEditing.price,
                                expensesTotal: getExpensesTotalInDay + itemPriceInEditingInp
                            }
                        }
                    });
                }

                // Explain: If item was expense and it is be profit, so update values in year,month and day
                else if (getMainItemWhenEditing?.category == "expense" && itemCategoryInEditingInp == "profit") {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateSomeColumns: {
                            year: {
                                yearId: yearId,
                                profitsTotal: getProfitsTotalInYear + itemPriceInEditingInp,
                                expensesTotal: getExpensesTotalInYear - getMainItemWhenEditing.price < 0 ? 0 : getExpensesTotalInYear - getMainItemWhenEditing.price
                            },
                            month: {
                                monthId: monthId,
                                profitsTotal: getProfitsTotalInMonth + itemPriceInEditingInp,
                                expensesTotal: getExpensesTotalInMonth - getMainItemWhenEditing.price < 0 ? 0 : getExpensesTotalInMonth - getMainItemWhenEditing.price
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                profitsTotal: getProfitsTotalInDay + itemPriceInEditingInp,
                                expensesTotal: getExpensesTotalInDay - getMainItemWhenEditing.price < 0 ? 0 : getExpensesTotalInDay - getMainItemWhenEditing.price
                            }
                        }
                    });
                }

                dispatch(updateSomePropertiesInRowInItemsTable({
                    id: Number(itemIdForEditing),
                    values: {
                        itemName: itemNameInEditingInp,
                        category: itemCategoryInEditingInp,
                        price: itemPriceInEditingInp
                    }
                }) as any);

                setIsSaveChanges(false);
                setIsEditing(false);
            }
        })
    }

    function clickOnItem(type: "ربح" | "مصروف") {
        setItemCategoryInEditingInp(type == "ربح" ? "profit" : "expense");
    }




    useEffect(function () {
        if (itemIdForEditing) {
            setGetMainItemWhenEditing(state.items.find(ele => ele.id == itemIdForEditing) as item_Type);
        }
    }, [itemIdForEditing, state.items]);

    useEffect(function () {
        const selectedYear = state.years.find(ele => ele.id == yearId);
        const selectedMonth = state.months.find(ele => ele.id == monthId);
        const selectedDay = state.days.find(ele => ele.id == dayInfo?.id);

        setGetProfitsTotalInYear(Number(selectedYear?.profitsTotal ?? 0));
        setGetProfitsTotalInMonth(Number(selectedMonth?.profitsTotal ?? 0));
        setGetProfitsTotalInDay(Number(selectedDay?.profitsTotal ?? 0));

        setGetExpensesTotalInYear(Number(selectedYear?.expensesTotal ?? 0));
        setGetExpensesTotalInMonth(Number(selectedMonth?.expensesTotal ?? 0));
        setGetExpensesTotalInDay(Number(selectedDay?.expensesTotal ?? 0));
    }, [yearId, monthId, dayInfo.id, state.days, state.months, state.years]);

    useEffect(function () {
        if (!getMainItemWhenEditing) {
            setIsSaveChanges(false);
            return;
        }
        else if (
            itemNameInEditingInp.length == 0
            ||
            itemPriceInEditingInp == 0
        ) {
            setIsSaveChanges(false);
            return;
        }


        if (
            (itemNameInEditingInp.match(regexItemName) && itemNameInEditingInp != getMainItemWhenEditing?.itemName)
            ||
            itemCategoryInEditingInp != getMainItemWhenEditing?.category
            ||
            (itemPriceInEditingInp > 0 && itemPriceInEditingInp != getMainItemWhenEditing.price)
        ) {
            setIsSaveChanges(true);
        } else {
            setIsSaveChanges(false);
        }
    }, [getMainItemWhenEditing, itemNameInEditingInp, itemCategoryInEditingInp, itemPriceInEditingInp]);


    const readItems = useMemo(function () {
        return [...state.items].sort((a, b) => Number(b.id) - Number(a.id));
    }, [state.items]);




    return <div className="mb-40">
        {/* Add item & count the itmes */}
        <div className="flex items-center justify-end gap-3 mb-5">
            <h3 className="mb-2 font-bold text-end">
                {maxForCreateItems}/{state.items.length}
            </h3>

            <Add_Item
                yearId={yearId}
                monthId={monthId}
                dayInfo={dayInfo as any}
                getProfitsTotalInYear={getProfitsTotalInYear}
                getProfitsTotalInMonth={getProfitsTotalInMonth}
                getProfitsTotalInDay={getProfitsTotalInDay}
                getExpensesTotalInYear={getExpensesTotalInYear}
                getExpensesTotalInMonth={getExpensesTotalInMonth}
                getExpensesTotalInDay={getExpensesTotalInDay}
                onIsEditing={setIsEditing}
            />
        </div>

        <table className="w-full mb-5">
            <thead className="text-center bg-slate-100">
                <tr>
                    <th className="p-3 rounded-tr-lg">اسم الباند</th>
                    <th>نوع الباند</th>
                    <th>المبلغ</th>
                    <th className="rounded-tl-lg" colSpan={2}>الادوات</th>
                </tr>
            </thead>

            <tbody className="bg-black text-center">
                {
                    readItems.length == 0 ?
                        <tr>
                            <td className="text-white p-2 font-bold" colSpan={4} >
                                لا يوجد بيانات
                            </td>
                        </tr>
                        :
                        readItems.map(ele => <tr
                            key={ele.id}
                            className={` duration-300 ${isEditing && ele.id == itemIdForEditing ? "bg-amber-500" : ""} `}
                        >
                            {
                                isEditing && ele.id == itemIdForEditing ?
                                    <>
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                <input
                                                    value={itemNameInEditingInp}
                                                    className="font-bold border-2 focus:outline-0 rounded-sm text-center w-[170px]"
                                                    onChange={(e) => setItemNameInEditingInp(e.target.value)}
                                                />

                                                <Max_Min_Length
                                                    isGreenFlag={itemNameInEditingInp.match(regexItemName) ? true : false}
                                                    maxLength={11}
                                                    minLength={itemNameInEditingInp?.length}
                                                />
                                            </div>
                                        </td>

                                        <td>
                                            <Drop_Menu
                                                isShowTheMenu={isShowMenu}
                                                classNameForMenu="w-full"
                                                onGetCurrentIsShowMenu={setIsShowMenu}
                                            >
                                                <Top_Content_For_The_Drop className="pt-1 pb-2">
                                                    {itemCategoryInEditingInp == "profit" ? "ربح" : "مصروف"}
                                                </Top_Content_For_The_Drop>

                                                <Bottom_Content_For_The_Drop>
                                                    <ul className="ps-3">
                                                        <li
                                                            className="duration-200 hover:bg-slate-200 p-2 cursor-pointer"
                                                            onClick={() => clickOnItem("ربح")}
                                                        >
                                                            ربح
                                                        </li>

                                                        <li
                                                            className="duration-200 hover:bg-slate-200 p-2 cursor-pointer"
                                                            onClick={() => clickOnItem("مصروف")}
                                                        >
                                                            مصروف
                                                        </li>
                                                    </ul>
                                                </Bottom_Content_For_The_Drop>
                                            </Drop_Menu>
                                        </td>

                                        <td>
                                            <input
                                                value={itemPriceInEditingInp == 0 ? "" : itemPriceInEditingInp}
                                                placeholder={`اقصى مبلغ ${maxPriceInOneItem}`}
                                                className="font-bold border-2 focus:outline-0 rounded-sm text-center w-[170px]"
                                                onKeyDown={(e) => {
                                                    if (["e", "E", "+", "-"].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    if (Number(e.target.value) <= maxPriceInOneItem) {
                                                        setItemPriceInEditingInp(Number(e.target.value));
                                                    } else {
                                                        setItemPriceInEditingInp(maxPriceInOneItem);
                                                    }
                                                }}
                                            />
                                        </td>

                                        <td className="p-3 flex justify-center gap-3">
                                            <X
                                                size={27}
                                                className="duration-300 text-red-500 cursor-pointer hover:scale-110"
                                                onClick={() => setIsEditing(false)}
                                            />
                                            <Save
                                                size={27}
                                                className={`
                                                    duration-300 
                                                    ${isSaveChanges ? "hover:scale-110 text-emerald-500 cursor-pointer" : "text-gray-500 cursor-not-allowed"}
                                                `}
                                                onClick={clickOnSaveChangesBtn}
                                            />
                                        </td>
                                    </>
                                    :
                                    <>
                                        <td className="text-white font-bold">{ele.itemName}</td>

                                        <td className={`
                                                font-bold
                                                ${ele.category == "profit" ? "text-emerald-500 " : "text-red-500 "}
                                            `}
                                        >
                                            {ele.category == "profit" ? "ربح" : "مصروف"}
                                        </td>

                                        <td className="text-white font-bold">${ele.price}</td>

                                        <td className="p-3 flex justify-center gap-3">
                                            {
                                                !ele.itemName.includes(addNewTrainer) && !ele.itemName.includes(withDrawSubscription) && !ele.itemName.includes(renewalSubscription) ?
                                                    <Pen
                                                        size={27}
                                                        className="text-gray-100 cursor-pointer hover:scale-110"
                                                        onClick={() => clickOnPenBtn(
                                                            Number(ele.id),
                                                            ele.itemName,
                                                            ele.category,
                                                            ele.price,
                                                        )
                                                        }
                                                    />
                                                    :
                                                    null
                                            }

                                            <Trash
                                                size={27}
                                                className="text-red-500 cursor-pointer  hover:scale-110"
                                                onClick={() => clickOnTrashBtn(Number(ele.id), ele.price, ele.category)}
                                            />
                                        </td>
                                    </>
                            }
                        </tr>)
                }
            </tbody>
        </table>
    </div>
}