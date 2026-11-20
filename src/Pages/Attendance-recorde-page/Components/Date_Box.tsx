import { ArrowLeft, ArrowRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { Date_Box_Props } from "@/Pages/typesProps";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import { Swiper as SwiperType } from "swiper";
// ========================================================== //
export default function Date_Box(
    {
        onGetDayDetails,
        onChangeFilterType,
        onGetDatesTotal
    }: Date_Box_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            attendance: state.attendance,
        }
    }, shallowEqual);


    const [allDates, setAllDates] = useState<string[]>([]);
    const [dateSelected, setDateSelected] = useState("");

    const [isShowTheMenu, setIsShowTheMenu] = useState(false);
    const [positionDate, setPositionDate] = useState(0);

    // These for swiper 
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);




    function getAllDates() {
        if (!state.attendance || state.attendance.length == 0) return;

        const arr: string[] = [...allDates];

        // Get all dates and don't repeat dates
        state.attendance.forEach(function (ele) {
            if (!arr.includes(ele.date)) {
                arr.push(ele.date as any);
            }
        });


        arr.sort((a, b) => b.localeCompare(a));

        if (allDates.length != arr.length) {
            setAllDates(arr);
        }
    }

    function clickOnDateBtn(indexDate: number) {
        setPositionDate(indexDate);
        onChangeFilterType("allTrainers");
    }

    function handlePrev(e: React.MouseEvent) {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }

        e.stopPropagation();
        setIsShowTheMenu(false);
        onChangeFilterType("allTrainers");
    }

    function handleNext(e: React.MouseEvent) {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }

        e.stopPropagation();
        setIsShowTheMenu(false);
        onChangeFilterType("allTrainers");
    }

    function updateTheTransaction() {
        if (swiperRef.current) {
            swiperRef.current.slideTo(positionDate);
        }
    }




    useEffect(function () {
        getAllDates();
    }, [state.attendance]);

    // Send values
    useEffect(function () {
        const getAllInfo = state.attendance.filter(ele => ele.date == dateSelected);

        onGetDayDetails(getAllInfo)
    }, [dateSelected, state.attendance]);

    useEffect(function () {
        updateTheTransaction();
        setDateSelected(allDates[positionDate]);

        onGetDatesTotal(allDates.length);
    }, [positionDate, allDates]);





    return <Drop_Menu
        isShowTheMenu={isShowTheMenu}
        messageForNotAddChildren={allDates?.length == 0 ? "لا يوجد ايام"
            :
            allDates?.length == 1 ? "لا يوجد ايام اخرى" : ""
        }
        onGetCurrentIsShowMenu={setIsShowTheMenu}
    >
        <Top_Content_For_The_Drop
            className={`
                duration-300 w-full px-3
                flex justify-between items-center h-full
                has-[.arrow-btn:hover]:bg-transparent cursor-pointer hover:bg-slate-300/25
            `}
        >
            {
                allDates?.length >= 2 ?
                    <button onClick={handlePrev}>
                        <ArrowRight
                            size={25}
                            className={`
                                arrow-btn duration-300
                                ${isBeginning ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
                            `}
                        />
                    </button>
                    :
                    null
            }

            {/* Dates */}
            <Swiper
                initialSlide={positionDate}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation]}
                allowTouchMove={false}
                spaceBetween={50}
                onSlideChange={(swiper) => {
                    setPositionDate(swiper.activeIndex);
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {
                    allDates?.length == 0 ?
                        "-"
                        :
                        allDates?.map((ele, i) => <SwiperSlide
                            key={i}
                            className="text-center"
                        >
                            {ele}
                        </SwiperSlide>)
                }
            </Swiper>

            {
                allDates?.length >= 2 ?
                    <button onClick={handleNext}>
                        <ArrowLeft
                            size={25}
                            className={`
                                arrow-btn duration-300
                                ${isEnd ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
                            `}
                        />
                    </button>
                    :
                    null
            }
        </Top_Content_For_The_Drop>

        {
            allDates?.length >= 2 ?
                <Bottom_Content_For_The_Drop
                    className={`
                        flex flex-col gap-3
                        ${allDates?.length as any >= 4 ? "h-[209px] overflow-auto p-3" : ""}
                    `}
                >
                    {
                        allDates?.map((ele, i) => <button
                            key={i}
                            className={`
                                duration-300
                                w-full bg-slate-200 p-3 font-bold cursor-pointer rounded-lg
                                ${positionDate == i ? "!bg-emerald-500 text-white" : "hover:bg-emerald-500 hover:text-white"}
                            `}
                            onClick={() => clickOnDateBtn(i)}
                        >
                            {ele}
                        </button>)
                    }
                </Bottom_Content_For_The_Drop>
                :
                null
        }
    </Drop_Menu>
}