import { item_Type } from "@/Pages/types";
import { Table_For_Read_Profits_Expenses_Props } from "@/Pages/typesProps";
import { store_Type } from "@/Rtk/types";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Add_Item from "../Add-item/Add_Item";
import Not_Found from "@/Global-components/Not-found/Not_Found";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight, Trash } from "lucide-react";
import Item_Details from "../Item-details/Item_Details";
import { alert, arithmeticOperatorsWithProfitsAndExpenses } from "@/Lib/functions";
import { deleteRowInItemsTableById } from "@/Rtk/Slices/Db-slices/itemsSlice";
// ========================================================== //
export default function Table_For_Read_Profits_Expenses(
    {
        yearId,
        monthId,
        dayInfo,
        countRowsInSlide
    }: Table_For_Read_Profits_Expenses_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            items: state.items,
            days: state.daysProfitsAndExpenses,
            months: state.monthsProfitsAndExpenses,
            years: state.yearsProfitsAndExpenses,
            logInInfo: state.logInInfo
        }
    }, shallowEqual);

    // Item details
    const [isEditing, setIsEditing] = useState(false);
    const [mainItem, setMainItem] = useState<null | item_Type>(null);

    const [getProfitsTotalInYear, setGetProfitsTotalInYear] = useState(0);
    const [getProfitsTotalInMonth, setGetProfitsTotalInMonth] = useState(0);
    const [getProfitsTotalInDay, setGetProfitsTotalInDay] = useState(0);

    const [getExpensesTotalInYear, setGetExpensesTotalInYear] = useState(0);
    const [getExpensesTotalInMonth, setGetExpensesTotalInMonth] = useState(0);
    const [getExpensesTotalInDay, setGetExpensesTotalInDay] = useState(0);

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




    function clickOnTrashBtn(mainItem: item_Type) {
        alert({
            textBeforeSubmit: "هل انت متأكد من حذف هذا الباند ؟",
            textAfterSubmit: "تم حذف الباند بنجاح",
            runFunctionAfterSubmit: function () {
                if (mainItem?.category == "profit") {
                    arithmeticOperatorsWithProfitsAndExpenses({
                        updateOneColumn: {
                            year: {
                                yearId: yearId,
                                column: "profitsTotal",
                                value: getProfitsTotalInYear - mainItem.price
                            },
                            month: {
                                monthId: monthId,
                                column: "profitsTotal",
                                value: getProfitsTotalInMonth - mainItem?.price
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                column: "profitsTotal",
                                value: getProfitsTotalInDay - mainItem?.price
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
                                value: getExpensesTotalInYear - Number(mainItem?.price)
                            },
                            month: {
                                monthId: monthId,
                                column: "expensesTotal",
                                value: getExpensesTotalInMonth - Number(mainItem?.price)
                            },
                            day: {
                                dayId: Number(dayInfo.id),
                                column: "expensesTotal",
                                value: getExpensesTotalInDay - Number(mainItem?.price)
                            }
                        }
                    });
                }

                dispatch(deleteRowInItemsTableById(Number(mainItem?.id)) as any);
            }
        });
    }



    // Check the slides[currentSlide] return value or no
    useEffect(function () {
        if (slides[currentSlide] == undefined) {
            setCurrentSlide(0);
        }
    }, [slides, currentSlide]);

    // This for get total in year, month, day
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




    if (slides[currentSlide] == undefined) {
        return <div>
            {/* Add item & count the itmes */}
            <div className="flex items-center justify-end gap-3 mb-5">
                <h3 className="font-bold text-end">
                    {state.items.length}
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

            <Not_Found
                srcImg="/not_found_in_table.svg"
                title="لا يوجد بيانات"
            />
        </div>
    }

    return <div className="mb-40">
        {/* Add item & count the itmes */}
        <div className="flex items-center justify-end gap-3 mb-10">
            <h3 className="font-bold text-end">
                {state.items.length}
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
            <thead className="text-center bg-slate-300/30">
                <tr>
                    <th className="p-3 rounded-tr-lg">اسم الباند</th>
                    <th>نوع الباند</th>
                    <th>المبلغ</th>
                    <th>حذف الباند</th>
                </tr>
            </thead>

            <tbody>
                {
                    slides[currentSlide].map(ele => (
                        <tr
                            key={ele.id}
                            style={{ '--account-color': state.logInInfo?.color } as React.CSSProperties}
                            className={`
                                duration-100 
                                text-(--thirdColor) text-center bg-slate-100 cursor-pointer font-bold
                                hover:bg-(--account-color) hover:text-white
                            `}
                            onClick={() => {
                                setIsEditing(true);
                                setMainItem(ele);
                            }}
                        >
                            <td className="py-5 font-bold">
                                {ele.itemName}
                            </td>

                            <td className={`font-bold ${ele.category == "profit" ? "text-emerald-500" : "text-red-500"}`}>
                                {ele.category == "profit" ? "ربح" : "مصروف"}
                            </td>

                            <td className="font-bold underline">
                                ${ele.price}
                            </td>

                            <td className="font-bold underline flex justify-center py-3">
                                <Trash
                                    size={30}
                                    className="text-red-500"
                                    onClick={(e) => {
                                        clickOnTrashBtn(ele);
                                        e.stopPropagation()
                                    }}
                                />
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


        {
            isEditing ?
                <Item_Details
                    yearId={yearId}
                    monthId={monthId}
                    dayId={Number(dayInfo?.id)}
                    profitsTotalInYear={getProfitsTotalInYear}
                    profitsTotalInMonth={getProfitsTotalInMonth}
                    profitsTotalInDay={getProfitsTotalInDay}
                    expensesTotalInYear={getExpensesTotalInYear}
                    expensesTotalInMonth={getExpensesTotalInMonth}
                    expensesTotalInDay={getExpensesTotalInDay}
                    mainItem={mainItem as any}
                    onIsShowItemDetails={setIsEditing}
                />
                :
                null
        }
    </div>
}