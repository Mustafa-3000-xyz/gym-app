import { daysProfitsAndExpenses_Type, item_Type, monthsProfitsAndExpenses_Type, yearsProfitsAndExpenses_Type } from "@/Pages/types";
import { Table_For_Read_Profits_Expenses_Props } from "@/Pages/typesProps";
import { store_Type } from "@/Rtk/types";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { styleDate } from "@/Lib/constants";
import { format } from "date-fns";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import Popup_Component from "@/Global-components/Popup-component/Popup_Component";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import { InputText } from "primereact/inputtext";
import { customAlert, normalAlert } from "@/Lib/functions";
import { systemForAddYearsMonthesDaysAndItems } from "@/Lib/functionsWithDb";
import Database from "@tauri-apps/plugin-sql";
import { updateAnyPropertyInRowInItemsTable } from "@/Rtk/Slices/Db-slices/itemsSlice";
import { addRowInReportsTable } from "@/Rtk/Slices/Db-slices/reportsSlice";
// ========================================================== //
export default function Read_Items(
    {
        layersIds,
        countRowsInSlide
    }: Table_For_Read_Profits_Expenses_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            items: state.items,
            logInInfo: state.logInInfo
        }
    }, shallowEqual);



    const [isShowCreateNewItem, setIsShowCreateNewItem] = useState(false);
    const [isShowItemDetails, setIsShowItemDetails] = useState(false);

    const [itemDetails, setItemDetails] = useState<item_Type | null>(null);
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const [itmeCategory, setItemCategory] = useState<"profit" | "expense" | null>(null);




    // These for slides
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);


    // This for create slides
    const slides = useMemo(function () {
        const arr: item_Type[][] = [];
        const afterSort = [...state.items].sort((a, b) => Number(b.price) - Number(a.price));

        for (let i = 0; i < state.items.length; i += countRowsInSlide) {
            const createSlice = afterSort.slice(i, i + countRowsInSlide)

            arr.push(createSlice);
        }

        setCurrentSlide(0);

        return arr;
    }, [state.items, countRowsInSlide]);




    async function getLayers() {
        const db = await Database.load("sqlite:gym-app.db");

        const [getYear] = await (db.select(
            `SELECT * FROM yearsProfitsAndExpenses WHERE id = ?;`, [layersIds.yearId]
        ) as any) as yearsProfitsAndExpenses_Type[];

        const [getMonth] = await (db.select(
            `SELECT * FROM monthsProfitsAndExpenses WHERE id = ?;`, [layersIds.monthId]
        ) as any) as monthsProfitsAndExpenses_Type[];

        const [getDay] = await (db.select(
            `SELECT * FROM daysProfitsAndExpenses WHERE id = ?;`, [layersIds.dayId]
        ) as any) as daysProfitsAndExpenses_Type[];


        return {
            year: getYear,
            month: getMonth,
            day: getDay
        }
    }

    function saveData() {
        const errorsMessagesList = [];


        if (!itemName) {
            errorsMessagesList.push("يجب كتابة اسم الباند");
        }

        if (!itemPrice) {
            errorsMessagesList.push("يجب كتابة المبلغ");
        }


        if (!itmeCategory) {
            errorsMessagesList.push("يجب اختيار نوع الباند");
        }



        if (errorsMessagesList.length == 0) {
            customAlert({
                textBeforeSubmitAction: "هل انت متأكد من إضافة هذا الباند ؟",
                textAfterSubmitAction: "تم إضافة الباند بنجاح",
                runFunctionAfterConfirm: async function () {
                    const layers = await getLayers();
                    const date = new Date(`${layers.year.yearNumber}/${layers.month.monthNumber}/${layers.day.dayNumber}`);


                    dispatch(addRowInReportsTable({
                        linkWithPerson: "bemo",
                        additionTime: new Date().toDateString(),
                        title: "تعديل بيانات الباند",
                        description: `حساب رقم ${state.logInInfo?.id} لقد قام بإضافة باند جديد في تاريخ ${format(new Date(date), styleDate)}`,
                        reportedBy: "بيمو"
                    }) as any);


                    await systemForAddYearsMonthesDaysAndItems(
                        date,
                        {
                            year: {
                                ...(itmeCategory == "profit" ? { profites: itemPrice } : { expensess: itemPrice })
                            },
                            month: {
                                ...(itmeCategory == "profit" ? { profites: itemPrice } : { expensess: itemPrice })
                            },
                            day: {
                                ...(itmeCategory == "profit" ? { profites: itemPrice } : { expensess: itemPrice })
                            },
                            item: {
                                additionTime: new Date().toISOString(),
                                title: itemName,
                                price: itemPrice,
                                category: itmeCategory == "profit" ? "profit" : "expense"
                            },
                        }
                    );


                    setIsShowCreateNewItem(false);
                    setItemName("");
                    setItemPrice(0);
                    setItemCategory(null);
                }
            });
        }
        else {
            normalAlert({
                title: "يوجد بيانات غير صالحه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });
        }
    }

    function cancel() {
        if (itemName || itemPrice || itmeCategory) {
            customAlert({
                textBeforeSubmitAction: "هل انت متأكد من عدم استكمال البيانات ؟",
                runFunctionAfterConfirm: function () {
                    setIsShowCreateNewItem(false);
                    setItemName("");
                    setItemPrice(0);
                    setItemCategory(null);
                }
            })
        }
        else {
            setIsShowCreateNewItem(false);
        }
    }

    async function saveChanges() {
        const errorsMessagesList = [];


        if (!itemName) {
            errorsMessagesList.push("يجب كتابة اسم الباند");
        }

        if (!itemPrice) {
            errorsMessagesList.push("يجب كتابة المبلغ");
        }


        if (!itmeCategory) {
            errorsMessagesList.push("يجب اختيار نوع الباند");
        }


        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات غير صالحه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });
        }
        else if (
            itemDetails?.itemName != itemName
            ||
            itemDetails?.price != itemPrice
            ||
            itemDetails?.category != itmeCategory
        ) {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل حفظ التغيرات ؟",
                textAfterSubmitAction: "تم حفظ التغيرات بنجاح , ويجب مراجعة الارباح والمصروفات الخاصه باليوم والشهر والسنه",
                runFunctionAfterConfirm: async function () {
                    const layers = await getLayers();
                    const date = new Date(`${layers.year.yearNumber}/${layers.month.monthNumber}/${layers.day.dayNumber}`);


                    dispatch(addRowInReportsTable({
                        linkWithPerson: "bemo",
                        additionTime: new Date().toDateString(),
                        title: "تعديل بيانات الباند",
                        description: `حساب رقم ${state.logInInfo?.id} قام بتعديل البيانات الخاصه بالباند المتواجد في ${format(new Date(date), styleDate)}`,
                        reportedBy: "بيمو"
                    }) as any);


                    dispatch(updateAnyPropertyInRowInItemsTable({
                        id: Number(itemDetails?.id),
                        values: {
                            itemName: itemName,
                            price: itemPrice,
                            category: itmeCategory as any
                        }
                    }) as any);


                    setIsShowItemDetails(false);
                    setItemDetails(null);

                    setItemName("");
                    setItemPrice(0);
                    setItemCategory(null);
                }
            })
        }
        else {
            normalAlert({
                title: "هممم",
                text: "لا يوجد اي تغيرات تمت",
                icon: "info"
            });
        }
    }

    function cancelChanges() {
        if (
            itemDetails?.itemName != itemName
            ||
            itemDetails?.price != itemPrice
            ||
            itemDetails?.category != itmeCategory
        ) {
            customAlert({
                textBeforeSubmitAction: "هل انت متأكد من عدم استكمال التغيرات ؟",
                runFunctionAfterConfirm: function () {
                    setIsShowItemDetails(false);
                    setItemDetails(null);

                    setItemName("");
                    setItemPrice(0);
                    setItemCategory(null);
                }
            })
        }
        else {
            setIsShowItemDetails(false);
            setItemDetails(null);

            setItemName("");
            setItemPrice(0);
            setItemCategory(null);
        }
    }



    useEffect(function () {
        if (!itemDetails) return;

        setItemName(itemDetails.itemName);
        setItemPrice(itemDetails.price);
        setItemCategory(itemDetails.category);
    }, [itemDetails]);




    return <div className="mt-10">
        {/* Btn add & items total */}
        <div className="mb-5 flex items-center justify-end gap-3 font-bold">
            <p>
                ({state.items.length})
            </p>

            <Custom_Btn
                className="bg-emerald-500! border-emerald-600!"
                onClick={() => setIsShowCreateNewItem(true)}
            >
                إنشاء باند جديد
            </Custom_Btn>
        </div>


        {
            slides[currentSlide] ?
                <table className="w-full mb-5">
                    <thead className="text-center bg-slate-300/30">
                        <tr>
                            <th className="p-3 rounded-tr-lg">اسم الباند</th>
                            <th> تاريخ الإضافة </th>
                            <th>نوع الباند</th>
                            <th>المبلغ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            slides[currentSlide].map(ele => (
                                <tr
                                    key={ele.id}
                                    className={`
                                        duration-100  font-bold
                                        text-center bg-slate-100 cursor-pointer 
                                        hover:bg-(--thirdColor) hover:text-white
                                    `}
                                    onClick={() => {
                                        setIsShowItemDetails(true);
                                        setItemDetails(ele);
                                    }}
                                >
                                    <td className="py-5">
                                        {
                                            ele.itemName.length > 9 ?
                                                `${ele.itemName.slice(0, 10)} ...`
                                                :
                                                ele.itemName
                                        }
                                    </td>

                                    <td className="py-5">
                                        <p>
                                            {
                                                ele.additionTime ?
                                                    format(new Date(ele.additionTime), styleDate)
                                                    :
                                                    "-"
                                            }
                                        </p>

                                        {
                                            ele.additionTime ?
                                                <p className="text-sm unde">
                                                    {format(new Date(ele.additionTime), 'hh:mm a')}
                                                </p>
                                                :
                                                null
                                        }
                                    </td>

                                    <td className={` ${ele.category == "profit" ? "text-emerald-500" : "text-red-500"} `}>
                                        {ele.category == "profit" ? "ربح" : "مصروف"}
                                    </td>

                                    <td>
                                        ${ele.price}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>

                    <tfoot className="bg-slate-300/30">
                        <tr>
                            <td colSpan={6} className="py-4 rounded-b-lg">
                                <div className="flex items-center px-5 gap-2">
                                    <ArrowRight
                                        size={18}
                                        className={`
                                            swiper-prev-x
                                            ${isBeginning ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
                                        `}
                                    />

                                    <Swiper
                                        modules={[Navigation]}
                                        allowTouchMove={false}
                                        spaceBetween={30}
                                        slidesPerView={4}
                                        slidesPerGroup={4}
                                        className="w-80"
                                        navigation={{
                                            prevEl: ".swiper-prev-x",
                                            nextEl: ".swiper-next-x",
                                        }}
                                        onSlideChange={(swiper) => {
                                            setIsBeginning(swiper.isBeginning)
                                            setIsEnd(swiper.isEnd)
                                        }}
                                    >
                                        {
                                            slides.map(function (__, i) {
                                                return <SwiperSlide>
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentSlide(i)}
                                                        className={`
                                                            ${i == currentSlide ? "bg-(--thirdColor) text-white" : "bg-slate-100"}
                                                            px-4 py-1 cursor-pointer rounded-md border border-slate-300
                                                        `}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </SwiperSlide>
                                            })
                                        }
                                    </Swiper>

                                    <ArrowLeft
                                        size={18}
                                        className={`
                                            swiper-next-x
                                            ${isEnd ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
                                        `}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                :
                <Not_Found
                    srcImg="/not_found_in_table.svg"
                    title="لا يوجد اي بنود"
                />
        }


        {
            isShowCreateNewItem ?
                <Popup_Component
                    title="إنشاء باند جديد"
                    classNameForParent="h-[60vh]"
                    classNameForContainer="grid grid-cols-2 gap-10"
                    clickOnSaveBtn={saveData}
                    clickOnCancel={cancel}
                >
                    {/* item name */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-bold">
                            اسم الباند
                        </label>

                        <InputText
                            className="text-center w-full font-bold"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </div>

                    {/* Item price */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-bold">
                            المبلغ
                        </label>

                        <InputText
                            type="number"
                            className="text-center w-full font-bold"
                            value={itemPrice == 0 ? "" : itemPrice as any}
                            onChange={(e) => setItemPrice(Number(e.target.value))}
                        />
                    </div>

                    {/* Item category */}
                    <div className="col-span-full w-1/2 mx-auto">
                        <Drop_Menu classNameForMenu="w-full">
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
                                        onClick={() => setItemCategory("profit")}
                                    >
                                        ربح
                                    </li>

                                    <li
                                        className="duration-200 hover:bg-slate-200 p-2 cursor-pointer text-red-500"
                                        onClick={() => setItemCategory("expense")}
                                    >
                                        مصروف
                                    </li>
                                </ul>
                            </Bottom_Content_For_The_Drop>
                        </Drop_Menu>
                    </div>
                </Popup_Component>
                :
                null
        }


        {
            isShowItemDetails ?
                <Popup_Component
                    title="إنشاء باند جديد"
                    classNameForParent="h-[60vh]"
                    classNameForContainer="grid grid-cols-2 gap-10"
                    clickOnSaveBtn={saveChanges}
                    clickOnCancel={cancelChanges}
                >
                    {/* item name */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-bold">
                            اسم الباند
                        </label>

                        <InputText
                            className="text-center w-full font-bold"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </div>

                    {/* Item price */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-bold">
                            المبلغ
                        </label>

                        <InputText
                            type="number"
                            className="text-center w-full font-bold"
                            value={itemPrice == 0 ? "" : itemPrice as any}
                            onChange={(e) => setItemPrice(Number(e.target.value))}
                        />
                    </div>

                    {/* Item category */}
                    <div className="col-span-full w-1/2 mx-auto">
                        <Drop_Menu classNameForMenu="w-full">
                            <Top_Content_For_The_Drop className="py-2 font-bold">
                                {
                                    itmeCategory == "profit" ? "ربح" : "مصروف"
                                }
                            </Top_Content_For_The_Drop>

                            <Bottom_Content_For_The_Drop>
                                <ul className="ps-3">
                                    <li
                                        className="duration-200 hover:bg-slate-200 p-2 cursor-pointer  text-emerald-500"
                                        onClick={() => setItemCategory("profit")}
                                    >
                                        ربح
                                    </li>

                                    <li
                                        className="duration-200 hover:bg-slate-200 p-2 cursor-pointer text-red-500"
                                        onClick={() => setItemCategory("expense")}
                                    >
                                        مصروف
                                    </li>
                                </ul>
                            </Bottom_Content_For_The_Drop>
                        </Drop_Menu>
                    </div>
                </Popup_Component>
                :
                null
        }
    </div>
}