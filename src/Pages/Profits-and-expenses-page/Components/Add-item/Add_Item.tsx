import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { maxForCreateItems, maxPriceInOneItem } from "@/Lib/constants";
import { alert, normalAlert } from "@/Lib/functions";
import { arithmeticOperatorsWithProfitsAndExpenses } from "@/Lib/functionsWithDb";
import { regexItemName } from "@/Lib/REGEX";
import { Add_Item_Props } from "@/Pages/typesProps";
import { addRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { store_Type } from "@/Rtk/types";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
    const state = useSelector(function (state: store_Type) {
        return {
            items: state.items,
        }
    }, shallowEqual);

    const [isSave, setIsSave] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const [isShowAddNewItem, setIsShowAddNewItem] = useState(false);

    const [itemNameInp, setItemNameInp] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const [itmeCategory, setItemCategory] = useState<null | "profit" | "expense">(null);




    function saveInfo() {
        alert({
            titleBeforeClickOnOk: "هل انت متأكد من إضافة هذا الباند ؟",
            titleAfterClickOnOk: "تم إضافة الباند بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(addRowInItemsTable({
                    linkWithDay: Number(dayInfo.id),
                    linkedWithTrainer: null,
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

    function cancelChanges() {
        setIsShowAddNewItem(false);
        setItemNameInp("");
        setItemPrice(0);
        setItemCategory(null);
    }

    function clickOnAddNewItemBtn() {
        if (state.items.length == maxForCreateItems) {
            normalAlert({
                title: "المعذره",
                text: "لقد وصلت للحد الاقصى من إنشاء البنود",
                icon: "error"
            });
        }
        else {
            onIsEditing(false);
            setIsShowAddNewItem(true);
        }
    }

    function clickOnItem(type: "ربح" | "مصروف") {
        setIsShowMenu(false);
        setItemCategory(type == "ربح" ? "profit" : "expense");
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
            className={`
                py-2 
                ${state.items.length == maxForCreateItems ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
            onClick={clickOnAddNewItemBtn}
        />



        {
            isShowAddNewItem ?
                <Popup_Form
                    titel={"إنشاء باند جديد"}
                    discription={` يمكنك الان إنشاء باند جديد وسوف يتم ربطه بيوم رقم ${dayInfo.title} `}
                    classNameForParent="h-[430px]"
                    isSave={isSave}
                    clickOnCancel={cancelChanges}
                    clickOnSaveBtn={saveInfo}
                >
                    {/* Top */}
                    <div className="flex justify-center items-center gap-3">
                        <div className="w-1/2">
                            <Inp_With_Label
                                inpValue={itemNameInp}
                                inpType="text"
                                labelName="اسم الباند"
                                onWriteInInput={(e) => setItemNameInp(e.target.value)}
                            />

                            <Max_Min_Length
                                isGreenFlag={itemNameInp.match(regexItemName) ? true : false}
                                maxLength={11}
                                minLength={itemNameInp?.length}
                            />
                        </div>

                        {/* Drop menu */}
                        <div className="w-1/2 mb-2">
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
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex flex-col justify-center items-center mt-3">
                        <div className="w-1/2">
                            <Inp_With_Label
                                inpValue={itemPrice == 0 ? "" : itemPrice}
                                inpType="number"
                                labelName="المبلغ"
                                onWriteInInput={(e) => {
                                    if (Number(e.target.value) <= maxPriceInOneItem) {
                                        setItemPrice(Number(e.target.value));
                                    }
                                    else {
                                        setItemPrice(maxPriceInOneItem);
                                    }
                                }}
                            />

                            <p className="font-bold">
                                الحد الاقصى : {maxPriceInOneItem}
                            </p>
                        </div>
                    </div>
                </Popup_Form>
                :
                null
        }
    </div>
}