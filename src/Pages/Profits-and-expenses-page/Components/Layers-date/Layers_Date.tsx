import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import { store_Type } from "@/Rtk/types";
import { Cuboid, Package, PackageOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Info_Box_For_Profits_Expenses from "../Info-box-for-profits-expenses/Info-box-for-profits-expenses/Info_Box_For_Profits_Expenses";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { regexYear } from "@/Lib/REGEX";
import { addRowInYearsProfitsAndExpensesTable } from "@/Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { alert, normalAlert } from "@/Lib/functions";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { maxTargetInDay, maxTargetInMonth, maxTargetInYear, monthsWithHisDays } from "@/Lib/constants";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import { addRowInMonthsProfitsAndExpensesTable, getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable } from "@/Rtk/Slices/Db-slices/monthsProfitsAndExpensesSlice";
import { addRowInDaysProfitsAndExpensesTable, getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable } from "@/Rtk/Slices/Db-slices/daysProfitsAndExpensesSlice";
import { Layers_Date_Props } from "@/Pages/typesProps";
import { getAllRowsInItemsTableLinkedToDay } from "@/Rtk/Slices/Db-slices/itemsSlice";
// ========================================================== //
export default function Layers_Date(
    {
        onGetYearInfo,
        onGetMonthInfo,
        onGetDayInfo
    }: Layers_Date_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            yearsProfitsAndExpenses: state.yearsProfitsAndExpenses,
            monthsProfitsAndExpenses: state.monthsProfitsAndExpenses,
            daysProfitsAndExpenses: state.daysProfitsAndExpenses
        }
    }, shallowEqual);

    const readYears = useMemo(function () {
        return [...state.yearsProfitsAndExpenses].sort((a, b) => Number(b.yearNumber) - Number(a.yearNumber));
    }, [state.yearsProfitsAndExpenses]);

    const readMonths = useMemo(function () {
        return [...state.monthsProfitsAndExpenses].reverse();
    }, [state.monthsProfitsAndExpenses]);

    const readDays = useMemo(function () {
        return [...state.daysProfitsAndExpenses].sort((a, b) => Number(b.dayNumber) - Number(a.dayNumber));
    }, [state.daysProfitsAndExpenses]);





    const [isShowCreateNewYear, setIsShowCreateNewYear] = useState(false);
    const [isShowCreateNewMonth, setIsShowCreateNewMonth] = useState(false);
    const [isShowCreateNewDay, setIsShowCreateNewDay] = useState(false);

    const [yearNumInp, setYearNumInp] = useState(0);
    const [monthInp, setMonthInp] = useState("");
    const [dayNumInp, setDayNumInp] = useState(0);

    const [targetForYear, setTargetForYear] = useState(0);
    const [targetForMonth, setTargetForMonth] = useState(0);
    const [targetForDay, setTargetForDay] = useState(0);

    const [isDropMenuOpen, setIsDropMenuOpen] = useState(false);
    const [isSave, setIsSave] = useState(false);

    const [getMonthNumber, setGetMonthNumber] = useState<number>(0);
    const [daysCountInMonth, setDaysCountInMonth] = useState<number[]>([]);

    const [yearInfo, setYearInfo] = useState({
        id: null,
        title: null
    });

    const [monthInfo, setMonthInfo] = useState({
        id: null,
        title: null,
        monthNumber: null
    });

    const [dayInfo, setDayInfo] = useState({
        id: null,
        title: null
    });




    function createNewYear() {
        if (!`${yearNumInp}`.match(regexYear) && targetForYear == 0) return;

        alert({
            titleBeforeClickOnOk: "هل انت متأكد بإنشاء تلك السنه",
            titleAfterClickOnOk: "تم إنشاء السنه بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(addRowInYearsProfitsAndExpensesTable({
                    yearNumber: yearNumInp,
                    target: targetForYear,
                    profitsTotal: 0,
                    expensesTotal: 0
                }) as any);

                resetValues();
            }
        })
    }

    function createNewMonth() {
        if (monthInp == "" && targetForMonth == 0 && yearInfo.id == null) return;

        alert({
            titleBeforeClickOnOk: `هل انت متأكد ربط شهر ${monthInp} بسنة ${yearInfo.title}`,
            titleAfterClickOnOk: "تم إنشاء السنه بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(addRowInMonthsProfitsAndExpensesTable({
                    linkWithYear: Number(yearInfo.id),
                    monthName: monthInp,
                    monthNumber: getMonthNumber,
                    profitsTotal: 0,
                    expensesTotal: 0,
                    target: targetForMonth
                }) as any);

                resetValues();
            }
        })
    }

    function createNewDay() {
        if (!daysCountInMonth.includes(dayNumInp)) {
            normalAlert({
                title: "تمهل قليلا",
                text: `ذلك اليوم ليس متوفر في شهر ${monthInfo.title}`,
                icon: "error"
            });

            setDayNumInp(0);
            return;
        }

        alert({
            titleBeforeClickOnOk: `هل انت متأكد ربط يوم ${dayNumInp} بشهر ${monthInfo.title}`,
            titleAfterClickOnOk: "تم إنشاء اليوم بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(addRowInDaysProfitsAndExpensesTable({
                    linkWithMonth: Number(monthInfo.id),
                    dayNumber: Number(dayNumInp),
                    profitsTotal: 0,
                    expensesTotal: 0,
                    target: targetForDay
                }) as any);

                resetValues();
            }
        })
    }

    function clickOnAddNewMonthBtn() {
        if (yearInfo.id == null) {
            normalAlert({
                title: ":( المعذره",
                text: "قم بختيار سنة اولا",
                icon: "error"
            })
        }
        else {
            setIsShowCreateNewMonth(true);
        }
    }

    function clickOnAddNewDayBtn() {
        if (monthInfo.id == null) {
            normalAlert({
                title: ":( المعذره",
                text: "قم بختيار الشهر اولا",
                icon: "error"
            })
        }
        else {
            setIsShowCreateNewDay(true);
        }
    }

    function clickOnMonth(monthName: string, monthNumber: number) {
        if (state.monthsProfitsAndExpenses.find(ele => Number(ele.monthNumber) == Number(monthNumber))) {
            normalAlert({
                title: "همممم",
                text: "ذلك الشهر موجود بالفعل",
                icon: "error"
            });

            setMonthInp("");
        }
        else {
            setGetMonthNumber(monthNumber);
            setMonthInp(monthName);
        }
    }

    function resetValues() {
        setYearNumInp(0);
        setMonthInp("");
        setDayNumInp(0);

        setTargetForYear(0);
        setTargetForMonth(0);
        setTargetForDay(0);

        setIsSave(false);
        setIsShowCreateNewYear(false);
        setIsShowCreateNewMonth(false);
        setIsShowCreateNewDay(false);
    }



    // When select another year, i want get months linked to new year
    useEffect(function () {
        dispatch(getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable(Number(yearInfo.id)) as any);

        onGetYearInfo(yearInfo);
        setMonthInfo({
            id: null,
            title: null,
            monthNumber: null
        });
    }, [yearInfo]);

    // When select another month, i want get days linked to new month
    useEffect(function () {
        dispatch(getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable(Number(monthInfo.id)) as any);

        onGetMonthInfo(monthInfo);
        setDayInfo({
            id: null,
            title: null
        });
    }, [monthInfo]);

    // When select another day, i want get itmes linked to new day
    useEffect(function () {
        dispatch(getAllRowsInItemsTableLinkedToDay(Number(dayInfo.id)) as any);

        onGetDayInfo(dayInfo);
    }, [dayInfo]);

    // Check the year is exist or no
    useEffect(function () {
        if (yearNumInp && state.yearsProfitsAndExpenses.find(ele => ele.yearNumber == yearNumInp)) {
            normalAlert({
                title: "!! هممم",
                text: "هذه السنه موجودة بالفعل",
                icon: "error"
            });

            setYearNumInp(0);
        }


        if (`${yearNumInp}`.match(regexYear) && targetForYear != 0) {
            setIsSave(true);
        } else {
            setIsSave(false);
        }
    }, [yearNumInp, targetForYear]);

    // Check the values for month is complete or no
    useEffect(function () {
        if (monthInp != "" && targetForMonth > 0) {
            setIsSave(true);
        } else {
            setIsSave(false);
        }
    }, [monthInp, targetForMonth]);

    // Check the available days in month
    useEffect(function () {
        const arr = [];
        const daysInMonth = monthsWithHisDays.find(ele => ele.monthNumber == monthInfo.monthNumber)?.days;

        if (daysInMonth) {
            for (let i = 1; i <= Number(daysInMonth); i++) {
                const isDayExist = state.daysProfitsAndExpenses.some(ele => ele.dayNumber == i);

                if (!isDayExist) {
                    arr.unshift(i);
                }
            }
        }

        if (dayNumInp > 0 && targetForDay > 0) {
            setIsSave(true);
        } else {
            setIsSave(false);
        }

        setDaysCountInMonth(arr);
    }, [state.daysProfitsAndExpenses, dayNumInp, targetForDay]);




    return <div className="grid grid-cols-3 gap-3 mt-7">
        {/* Years */}
        <div>
            {/* Title & icon */}
            <div className="flex itmes-center gap-2 font-bold mb-5">
                <PackageOpen size={33} />

                <h3 className="text-2xl">
                    التقارير السنويه
                </h3>
            </div>

            <Add_Btn
                title="إنشاء سنه جديد"
                className="cursor-pointer mb-5 py-5"
                onClick={() => setIsShowCreateNewYear(true)}
            />

            {/* All Boxes for years */}
            <div className="flex flex-col items-center gap-3 h-[70vh] overflow-y-auto p-5">
                {
                    readYears.length > 0 ?
                        readYears.map(ele => <Info_Box_For_Profits_Expenses
                            key={Number(ele.id)}
                            id={Number(ele.id)}
                            mainTitle={`${ele.yearNumber}`}
                            title={`سنة ${ele.yearNumber}`}
                            profitsTotal={ele.profitsTotal}
                            expensesTotal={ele.expensesTotal}
                            target={ele.target}
                            targetType="السنوي"
                            isHiddenTheWord={new Date().getFullYear() == Number(ele.yearNumber) ? false : true}
                            className={`${yearInfo.id != ele.id ? "cursor-pointer" : ""}`}
                            styleBoxWhenSelect={yearInfo.id == ele.id ? "black" : null}
                            onGetBoxInfo={yearInfo.id != ele.id ? setYearInfo as any : () => null}
                        />)
                        :
                        <Not_Found
                            srcImg="/not_found_in_layers.svg"
                            title="لا يوجد اي سنة تم إنشاؤها"
                        />
                }
            </div>
        </div>

        {/* Monthes */}
        <div>
            {/* Title & icon */}
            <div className="flex itmes-center gap-2 font-bold mb-5">
                <Package size={33} />

                <h3 className="text-2xl">
                    التقارير الشهريه
                </h3>
            </div>

            <Add_Btn
                title="إنشاء شهر جديد"
                className="cursor-pointer mb-5 py-5"
                onClick={clickOnAddNewMonthBtn}
            />

            {/* All Boxes for monthes */}
            <div className="flex flex-col items-center gap-3 h-[70vh] overflow-y-auto p-5">
                {
                    yearInfo.id != null && state.monthsProfitsAndExpenses.length > 0 ?
                        readMonths.map(ele => <Info_Box_For_Profits_Expenses
                            key={Number(ele.id)}
                            id={Number(ele.id)}
                            mainTitle={ele.monthName}
                            title={`${ele.monthName} (${yearInfo.title})`}
                            profitsTotal={ele.profitsTotal}
                            expensesTotal={ele.expensesTotal}
                            target={ele.target}
                            targetType="الشهري"
                            monthNumber={ele.monthNumber}
                            className={`${monthInfo.id != ele.id ? "cursor-pointer" : ""}`}
                            styleBoxWhenSelect={monthInfo.id == ele.id ? "black" : null}
                            onGetBoxInfo={monthInfo.id != ele.id ? setMonthInfo as any : () => null}
                        />)
                        :
                        yearInfo.id == null ?
                            <Not_Found
                                title="الرجاء قم بختيار سنه"
                                srcImg="/not_found_in_layers.svg"
                            />
                            :
                            <Not_Found
                                title={`لا توجد شهور مربوطه بسنة ${yearInfo.title}`}
                                srcImg="/not_found_after_search.svg"
                            />
                }
            </div>
        </div>

        {/* Days */}
        <div>
            {/* Title & icon */}
            <div className="flex itmes-center gap-2 font-bold mb-5 text-black">
                <Cuboid size={33} />

                <h3 className="text-2xl">
                    التقارير اليوميه
                </h3>
            </div>

            <Add_Btn
                title="إنشاء يوم جديد"
                className="cursor-pointer mb-5 py-5"
                onClick={clickOnAddNewDayBtn}
            />

            {/* All Boxes for days */}
            <div className="flex flex-col items-center gap-3 h-[70vh] overflow-y-auto p-5">
                {
                    monthInfo.id != null && state.daysProfitsAndExpenses.length > 0 ?
                        readDays.map(ele => <Info_Box_For_Profits_Expenses
                            key={Number(ele.id)}
                            id={Number(ele.id)}
                            mainTitle={ele.dayNumber}
                            title={`يوم رقم ${ele.dayNumber} من شهر (${monthInfo.title})`}
                            profitsTotal={ele.profitsTotal}
                            expensesTotal={ele.expensesTotal}
                            target={ele.target}
                            targetType="اليومي"
                            className={`${dayInfo.id != ele.id ? "cursor-pointer" : ""}`}
                            styleBoxWhenSelect={dayInfo.id == ele.id ? "black" : null}
                            onGetBoxInfo={dayInfo.id != ele.id ? setDayInfo as any : () => null}
                        />)
                        :
                        monthInfo.id == null ?
                            <Not_Found
                                title="الرجاء قم بختيار الشهر"
                                srcImg="/not_found_in_layers.svg"
                            />
                            :
                            <Not_Found
                                title={`لا توجد ايام مربوطه بشهر ${monthInfo.title}`}
                                srcImg="/not_found_after_search.svg"
                            />
                }
            </div>
        </div>


        {
            isShowCreateNewYear ?
                <Popup_Form
                    isSave={isSave}
                    titel="إنشاء سنه جديده"
                    discription="يمكنك الان إنشاء سنه جديده لكي يتم ربطها بشهر معين"
                    classNameForParent="h-fit"
                    classNameForContainer="grid grid-cols-2 gap-3"
                    clickOnSaveBtn={createNewYear}
                    clickOnCancel={resetValues}
                >
                    {/* Year number */}
                    <div>
                        <Inp_With_Label
                            valueOrDefaultValue="value"
                            inpType="number"
                            inpValue={yearNumInp == 0 ? "" : yearNumInp}
                            labelName="اكتب رقم السنه"
                            onWriteInInput={(e) => setYearNumInp(Number(e.target.value))}
                        />

                        <Max_Min_Length
                            isGreenFlag={`${yearNumInp}`.match(regexYear) ? true : false}
                            maxLength={4}
                            minLength={`${yearNumInp == 0 ? "" : yearNumInp}`.length}
                        />
                    </div>

                    {/* Target */}
                    <div>
                        <Inp_With_Label
                            valueOrDefaultValue="value"
                            inpType="number"
                            inpValue={targetForYear == 0 ? "" : targetForYear}
                            labelName="المبلغ الذي يجب تجميعه خلال هذه السنه (Target)"
                            onWriteInInput={(e) => {
                                if (Number(e.target.value) > maxTargetInYear) {
                                    setTargetForYear(maxTargetInYear);
                                }
                                else {
                                    setTargetForYear(Number(e.target.value));
                                }
                            }}
                        />

                        <span className="font-bold">
                            الحد الاقصى : {maxTargetInYear}
                        </span>
                    </div>
                </Popup_Form>
                :
                null
        }

        {
            isShowCreateNewMonth ?
                <Popup_Form
                    isSave={isSave}
                    titel="إنشاء شهر جديد"
                    discription={`يمكنك الان إنشاء شهر جديد داخل سنة (${yearInfo.title})`}
                    classNameForParent={`${isDropMenuOpen ? "h-[500px]!" : "h-fit"}`}
                    classNameForContainer="grid grid-cols-2 gap-3"
                    clickOnSaveBtn={createNewMonth}
                    clickOnCancel={resetValues}
                >
                    {/* Months names */}
                    <div className="flex justify-center items-center p-4">
                        <Drop_Menu onGetCurrentIsShowMenu={setIsDropMenuOpen}>
                            <Top_Content_For_The_Drop>
                                {
                                    monthInp != "" ? monthInp : "اسامي الشهور"
                                }
                            </Top_Content_For_The_Drop>

                            <Bottom_Content_For_The_Drop className="flex gap-3">
                                {
                                    monthsWithHisDays.map((ele, i) => {
                                        return <p
                                            key={i}
                                            className="bg-slate-200 p-2 rounded-lg cursor-pointer hover:bg-slate-100"
                                            onClick={() => clickOnMonth(ele.month, ele.monthNumber)}
                                        >
                                            {ele.month}
                                        </p>
                                    })
                                }
                            </Bottom_Content_For_The_Drop>
                        </Drop_Menu>
                    </div>

                    {/* Target */}
                    <div>
                        <Inp_With_Label
                            valueOrDefaultValue="value"
                            inpType="number"
                            inpValue={targetForMonth == 0 ? "" : targetForMonth}
                            labelName="المبلغ الذي يجب تجميعه خلال هذا الشهر (Target)"
                            onWriteInInput={(e) => {
                                if (Number(e.target.value) > maxTargetInMonth) {
                                    setTargetForMonth(maxTargetInMonth);
                                }
                                else {
                                    setTargetForMonth(Number(e.target.value));
                                }
                            }}
                        />

                        <span className="font-bold">
                            الحد الاقصى : {maxTargetInMonth}
                        </span>
                    </div>
                </Popup_Form>
                :
                null
        }

        {
            isShowCreateNewDay ?
                <Popup_Form
                    isSave={isSave}
                    titel="إنشاء يوم جديد"
                    discription={`يمكنك الان إنشاء يوم جديد داخل شهر (${monthInfo.title}) في سنة (${yearInfo.title})`}
                    classNameForContainer="grid grid-cols-2 gap-3"
                    clickOnSaveBtn={createNewDay}
                    clickOnCancel={resetValues}
                >
                    {/* Day number */}
                    <div className="flex flex-col justify-center items-center ">
                        <Inp_With_Label
                            valueOrDefaultValue="value"
                            inpType="number"
                            inpValue={dayNumInp == 0 ? "" : dayNumInp}
                            labelName="اكتب رقم اليوم"
                            onWriteInInput={(e) => setDayNumInp(Number(e.target.value))}
                        />

                        <div className="flex flex-wrap gap-1 font-bold w-full">
                            <p>
                                الايام المتاحه :
                            </p>

                            {daysCountInMonth.join("-")}
                        </div>
                    </div>

                    {/* Target */}
                    <div>
                        <Inp_With_Label
                            valueOrDefaultValue="value"
                            inpType="number"
                            inpValue={targetForDay == 0 ? "" : targetForDay}
                            labelName="المبلغ الذي يجب تجميعه خلال هذا اليوم (Target)"
                            onWriteInInput={(e) => {
                                if (Number(e.target.value) > maxTargetInDay) {
                                    setTargetForDay(maxTargetInDay);
                                }
                                else {
                                    setTargetForDay(Number(e.target.value));
                                }
                            }}
                        />

                        <span className="font-bold">
                            الحد الاقصى : {maxTargetInDay}
                        </span>
                    </div>
                </Popup_Form>
                :
                null
        }
    </div>
}