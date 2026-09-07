import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { maxPriceInOneItem } from "@/Lib/constants";
import { alert, arithmeticOperatorsWithProfitsAndExpenses } from "@/Lib/functions";
import { regexItemName } from "@/Lib/REGEX";
import { Item_Details_Props } from "@/Pages/typesProps";
import { updateSomePropertiesInRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Item_Details(
    {
        yearId,
        monthId,
        dayId,
        profitsTotalInYear,
        profitsTotalInMonth,
        profitsTotalInDay,
        expensesTotalInYear,
        expensesTotalInMonth,
        expensesTotalInDay,
        mainItem,
        onIsShowItemDetails
    }: Item_Details_Props
) {
    const dispatch = useDispatch();

    const [isSaveChanges, setIsSaveChanges] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);


    const [itemName, setItemName] = useState(mainItem.itemName);
    const [itemCategory, setItemCategory] = useState<"profit" | "expense">(mainItem.category);
    const [itemPrice, setItemPrice] = useState(mainItem.price);



    function clickOnItem(type: "profit" | "expense") {
        setIsShowMenu(false);
        setItemCategory(type);
    }

    function saveChanges() {
        if (!isSaveChanges) return;

        alert({
            textBeforeSubmit: "هل انت متأكد من تحديث البيانات",
            textAfterSubmit: "تم التحديث بنجاح",
            runFunctionAfterSubmit: function () {
                // If item stell profit but his price was changed
                if (
                    (mainItem?.category == "profit" && itemCategory == "profit")
                    &&
                    mainItem?.price != itemPrice
                ) {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "profitsTotal",
                                value: (profitsTotalInYear - mainItem?.price) + itemPrice
                            },
                            month: {
                                monthId: monthId,
                                column: "profitsTotal",
                                value: (profitsTotalInMonth - mainItem?.price) + itemPrice
                            },
                            day: {
                                dayId: Number(dayId),
                                column: "profitsTotal",
                                value: (profitsTotalInDay - mainItem?.price) + itemPrice
                            }
                        }
                    });
                }

                // If item stell expense but his price was changed
                else if (
                    (mainItem?.category == "expense" && itemCategory == "expense")
                    &&
                    mainItem?.price != itemPrice
                ) {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "expensesTotal",
                                value: (expensesTotalInYear - mainItem?.price) + itemPrice
                            },
                            month: {
                                monthId: monthId,
                                column: "expensesTotal",
                                value: (expensesTotalInMonth - mainItem?.price) + itemPrice
                            },
                            day: {
                                dayId: Number(dayId),
                                column: "expensesTotal",
                                value: (expensesTotalInDay - mainItem?.price) + itemPrice
                            }
                        }
                    });
                }

                // If item was profit and it is be expense, so update values in year,month and day
                else if (mainItem?.category == "profit" && itemCategory == "expense") {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateSomeColumns: {
                            year: {
                                yearId: yearId,
                                profitsTotal: profitsTotalInYear - mainItem.price,
                                expensesTotal: expensesTotalInYear + itemPrice
                            },
                            month: {
                                monthId: monthId,
                                profitsTotal: profitsTotalInMonth - mainItem.price,
                                expensesTotal: expensesTotalInMonth + itemPrice
                            },
                            day: {
                                dayId: Number(dayId),
                                profitsTotal: profitsTotalInDay - mainItem.price,
                                expensesTotal: expensesTotalInDay + itemPrice
                            }
                        }
                    });
                }

                // If item was expense and it is be profit, so update values in year,month and day
                else if (mainItem?.category == "expense" && itemCategory == "profit") {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateSomeColumns: {
                            year: {
                                yearId: yearId,
                                profitsTotal: profitsTotalInYear + itemPrice,
                                expensesTotal: expensesTotalInYear - mainItem.price
                            },
                            month: {
                                monthId: monthId,
                                profitsTotal: profitsTotalInMonth + itemPrice,
                                expensesTotal: expensesTotalInMonth - mainItem.price
                            },
                            day: {
                                dayId: Number(dayId),
                                profitsTotal: profitsTotalInDay + itemPrice,
                                expensesTotal: expensesTotalInDay - mainItem.price
                            }
                        }
                    });
                }

                dispatch(updateSomePropertiesInRowInItemsTable({
                    id: Number(mainItem.id),
                    values: {
                        itemName: itemName,
                        category: itemCategory,
                        price: itemPrice
                    }
                }) as any);

                onIsShowItemDetails(false);
            }
        })
    }



    useEffect(function () {
        if (!itemName.match(regexItemName) || !itemName || !itemCategory || !itemPrice) {
            setIsSaveChanges(false);
            return;
        }


        if (
            itemName != mainItem?.itemName
            ||
            itemCategory != mainItem?.category
            ||
            (itemPrice > 0 && itemPrice != mainItem.price)
        ) {
            setIsSaveChanges(true);
        } else {
            setIsSaveChanges(false);
        }
    }, [mainItem, itemName, itemCategory, itemPrice]);





    return <Popup_Form
        popupFormInfo={{
            title: "التعديل على الباند",
            discription: `تلك التفاصيل الخاصه بالباند رقم ${mainItem.id}`,
        }}
        isSave={isSaveChanges}
        typeBtn="save change"
        classNameForParent="h-[55vh] w-[87vw]"
        classNameForContainer="grid grid-cols-2 gap-10 items-center justify-center"
        clickOnCancel={() => onIsShowItemDetails(false)}
        clickOnSaveBtn={saveChanges}
    >
        {/* Item name */}
        <div className="flex items-center justify-center gap-2">
            <Inp_With_Label
                labelName="اسم الباند"
                inpType="text"
                className="!font-bold !text-black text-center"
                inpValue={itemName}
                onWriteInInput={setItemName}
            />

            <Max_Min_Length
                isGreenFlag={itemName.match(regexItemName) ? true : false}
                maxLength={11}
                minLength={itemName?.length}
            />
        </div>

        {/* Item price */}
        <Inp_With_Label
            placeholder={`اقصى مبلغ : ${maxPriceInOneItem}`}
            labelName="سعر الباند"
            inpType="number"
            inpValue={itemPrice == 0 ? "" : itemPrice as any}
            onWriteInInput={(value) => {
                if (Number(value) <= maxPriceInOneItem) {
                    setItemPrice(Number(value));
                } else {
                    setItemPrice(maxPriceInOneItem);
                }
            }}
        />

        {/* Profit or expense */}
        <div className="col-span-full w-1/2 mx-auto">
            <Drop_Menu
                isShowTheMenu={isShowMenu}
                classNameForMenu="w-full"
                onGetCurrentIsShowMenu={setIsShowMenu}
            >
                <Top_Content_For_The_Drop className="pt-1 pb-2">
                    {itemCategory == "profit" ? "ربح" : "مصروف"}
                </Top_Content_For_The_Drop>

                <Bottom_Content_For_The_Drop>
                    <ul className="ps-3">
                        <li
                            className="duration-200 hover:bg-slate-200 p-2 cursor-pointer text-emerald-500"
                            onClick={() => clickOnItem("profit")}
                        >
                            ربح
                        </li>

                        <li
                            className="duration-200 hover:bg-slate-200 p-2 cursor-pointer text-red-500"
                            onClick={() => clickOnItem("expense")}
                        >
                            مصروف
                        </li>
                    </ul>
                </Bottom_Content_For_The_Drop>
            </Drop_Menu>
        </div>
    </Popup_Form>
}