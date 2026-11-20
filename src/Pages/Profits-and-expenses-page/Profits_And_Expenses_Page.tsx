import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Read_Items from "./Components/Read_Items";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Custom_Line from "@/Global-components/Custom-line/Custom_Line";
import Years_Layers from "./Components/Years_Layers";
import Months_Layers from "./Components/Months_Layers";
import { getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import Days_Layers from "./Components/Days_Layers";
import { getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { getAllRowsInItemsTableLinkedToDay } from "@/Rtk/Slices/Db-slices/itemsSlice";
// ========================================================== //
export default function Profits_And_Expenses_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            yearsProfitsAndExpenses: state.yearsProfitsAndExpenses,
            monthsProfitsAndExpenses: state.monthsProfitsAndExpenses,
            daysProfitsAndExpenses: state.daysProfitsAndExpenses,
            settings: state.settings
        }
    }, shallowEqual);


    const [getYearInfo, setGetYearInfo] = useState({
        id: null as null | number,
        yearNumber: null as null | number
    });

    const [getMontInfo, setGetMonthInfo] = useState({
        id: null as null | number,
        monthName: null as null | string,
        monthNumber: null as null | number,
    });

    const [getDayInfo, setGetDayInfo] = useState({
        id: null as null | number,
        dayNumber: null as null | number
    });


    const allYears = useMemo(function () {
        return [...state.yearsProfitsAndExpenses].sort((a, b) => Number(b.yearNumber) - Number(a.yearNumber));
    }, [state.yearsProfitsAndExpenses]);

    const allMonths = useMemo(function () {
        return [...state.monthsProfitsAndExpenses].sort((a, b) => Number(b.monthNumber) - Number(a.monthNumber));
    }, [state.monthsProfitsAndExpenses]);

    const allDays = useMemo(function () {
        return [...state.daysProfitsAndExpenses].sort((a, b) => Number(b.dayNumber) - Number(a.dayNumber));
    }, [state.daysProfitsAndExpenses]);



    useEffect(function () {
        return () => {
            dispatch(getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable(-1) as any);
            dispatch(getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable(-1) as any);
            dispatch(getAllRowsInItemsTableLinkedToDay(-1) as any);
        }
    }, []);

    // Get months in year selected
    useEffect(function () {
        if (getYearInfo.id == null) return;

        setGetMonthInfo({
            id: null,
            monthName: null,
            monthNumber: null
        });

        setGetDayInfo({
            id: null,
            dayNumber: null
        });

        dispatch(getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable(getYearInfo.id) as any);
        dispatch(getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable(-1) as any);
        dispatch(getAllRowsInItemsTableLinkedToDay(-1) as any);
    }, [getYearInfo.id])

    // Get days in month selected
    useEffect(function () {
        if (getMontInfo.id == null) return;


        setGetDayInfo({
            id: null,
            dayNumber: null
        });


        dispatch(getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable(getMontInfo.id) as any);
        dispatch(getAllRowsInItemsTableLinkedToDay(-1) as any);
    }, [getMontInfo.id]);

    useEffect(function () {
        if (getMontInfo.id == null) return;

        dispatch(getAllRowsInItemsTableLinkedToDay(Number(getDayInfo.id)) as any);
    }, [getDayInfo.id]);





    return <section className="mt-10">
        {/* Layers */}
        <div className="grid grid-cols-3 gap-3">
            <Years_Layers
                allYears={allYears}
                onGetYearInfo={setGetYearInfo as any}
            />

            <Months_Layers
                yearId={getYearInfo.id}
                allMonths={allMonths}
                onGetMonthInfo={setGetMonthInfo as any}
            />

            <Days_Layers
                monthInfo={{
                    id: getMontInfo.id,
                    number: getMontInfo.monthNumber,
                }}
                allDays={allDays}
                onGetDayInfo={setGetDayInfo as any}
            />
        </div>


        <Custom_Line />


        {/* Steps */}
        <div className="flex items-center gap-1 text-lg mb-5">
            <span className="font-bold">
                {getYearInfo.id == null ? "-" : getYearInfo.yearNumber}
            </span>

            <ArrowLeft />

            <span className="font-bold">
                {getMontInfo.id == null ? "-" : getMontInfo.monthName}
            </span>

            <ArrowLeft />

            <span className="font-bold">
                {getDayInfo.id == null ? "-" : `${getDayInfo.dayNumber}`}
            </span>
        </div>

        {
            getYearInfo.id != null && getMontInfo.id != null && getDayInfo.id != null ?
                <>

                    <Read_Items
                        countRowsInSlide={Number(state.settings.rowsInItemsTable)}
                        layersIds={{
                            yearId: getYearInfo.id,
                            monthId: getMontInfo.id,
                            dayId: getDayInfo.id
                        }}
                    />
                </>
                :
                <Not_Found
                    title="من فضلك قم بختيار [سنه, شهر, يوم] لإظهار البنود"
                    srcImg="/not_found_in_table.svg"
                />
        }
    </section>
}