import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { maxPriceInOneItem } from "@/Lib/constants";
import { alert, arithmeticOperatorsWithProfitsAndExpenses } from "@/Lib/functions";
import { regexItemName } from "@/Lib/REGEX";
import { Add_Item_Props } from "@/Pages/typesProps";
import { addRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Add_Item(
    {
        yearId,
        monthId,
        dayInfo,
        getProfitsTotalInYear,
        getProfitsTotalInMonth,
        getProfitsTotalInDay,
        getExpensesTotalInYear,
        getExpensesTotalInMonth,
        getExpensesTotalInDay,
        onIsEditing
    }: Add_Item_Props
) {
    const dispatch = useDispatch();

    const [isSave, setIsSave] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isShowAddNewItem, setIsShowAddNewItem] = useState(false);

    const [itemNameInp, setItemNameInp] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const [itmeCategory, setItemCategory] = useState<null | "profit" | "expense">(null);




    function clickOnAddNewItemBtn() {
        onIsEditing(false);
        setIsShowAddNewItem(true);
    }

    function cancelChanges() {
        setIsShowAddNewItem(false);
        setItemNameInp("");
        setItemPrice(0);
        setItemCategory(null);
    }

    function clickOnItem(type: "profit" | "expense") {
        setIsShowMenu(false);
        setItemCategory(type);
    }

    function saveInfo() {
        alert({
            textBeforeSubmit: "هل انت متأكد من إضافة هذا الباند ؟",
            textAfterSubmit: "تم إضافة الباند بنجاح",
            runFunctionAfterSubmit: function () {
                dispatch(addRowInItemsTable({
                    linkWithDay: Number(dayInfo.id),
                    itemName: itemNameInp,
                    category: itmeCategory as any,
                    price: Number(itemPrice),
                }) as any);

                if (itmeCategory == "profit") {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "profitsTotal",
                                value: getProfitsTotalInYear + itemPrice
                            },
                            month: {
                                monthId: monthId,
                                column: "profitsTotal",
                                value: getProfitsTotalInMonth + itemPrice
                            },
                            day: {
                                dayId: dayInfo.id,
                                column: "profitsTotal",
                                value: getProfitsTotalInDay + itemPrice
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
                                value: getExpensesTotalInYear + itemPrice
                            },
                            month: {
                                monthId: monthId,
                                column: "expensesTotal",
                                value: getExpensesTotalInMonth + itemPrice
                            },
                            day: {
                                dayId: dayInfo.id,
                                column: "expensesTotal",
                                value: getExpensesTotalInDay + itemPrice
                            }
                        }
                    });
                }

                cancelChanges();
            }
        });
    }



    useEffect(function () {
        if (itemNameInp.match(regexItemName) && itemPrice > 0 && itmeCategory != null) {
            setIsSave(true);
        } else {
            setIsSave(false);
        }
    }, [itemNameInp, itemPrice, itmeCategory]);




    return <div>
        <Add_Btn
            title="إضافة باند جديد"
            className="py-2 cursor-pointer"
            onClick={clickOnAddNewItemBtn}
        />



        {
            isShowAddNewItem ?
                <Popup_Form
                    popupFormInfo={{
                        title: "إنشاء باند جديد",
                        discription: ` يمكنك الان إنشاء باند جديد وسوف يتم ربطه بيوم رقم ${dayInfo.title} `,
                    }}
                    classNameForParent="h-[55vh] w-[87vw]"
                    classNameForContainer="grid grid-cols-2 gap-10"
                    isSave={isSave}
                    clickOnCancel={cancelChanges}
                    clickOnSaveBtn={saveInfo}
                >
                    <div>
                        <Inp_With_Label
                            inpValue={itemNameInp}
                            inpType="text"
                            labelName="اسم الباند"
                            onWriteInInput={setItemNameInp}
                        />

                        <Max_Min_Length
                            isGreenFlag={itemNameInp.match(regexItemName) ? true : false}
                            maxLength={11}
                            minLength={itemNameInp?.length}
                        />
                    </div>

                    <Inp_With_Label
                        placeholder={`اقصى مبلغ : ${maxPriceInOneItem}`}
                        labelName="سعر الباند"
                        inpType="number"
                        inpValue={itemPrice == 0 ? "" : itemPrice}
                        onWriteInInput={(value) => {
                            if (Number(value) <= maxPriceInOneItem) {
                                setItemPrice(Number(value));
                            }
                            else {
                                setItemPrice(maxPriceInOneItem);
                            }
                        }}
                    />

                    <div className="col-span-full w-1/2 mx-auto">
                        <Drop_Menu
                            classNameForMenu="w-full"
                            isShowTheMenu={isShowMenu}
                            onGetCurrentIsShowMenu={setIsShowMenu}
                        >
                            <Top_Content_For_The_Drop className="py-2 font-bold">
                                {
                                    itmeCategory == null ?
                                        "اختر نوع الباند"
                                        :
                                        itmeCategory == "profit" ? "ربح" : "مصروف"
                                }
                            </Top_Content_For_The_Drop>

                            <Bottom_Content_For_The_Drop>
                                <ul className="ps-3">
                                    <li
                                        className="duration-200 hover:bg-slate-200 p-2 cursor-pointer  text-emerald-500"
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
                :
                null
        }
    </div>
}