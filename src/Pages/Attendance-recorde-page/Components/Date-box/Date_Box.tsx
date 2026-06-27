import { ArrowLeft, ArrowRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { format } from "date-fns";
import { styleDate } from "@/Lib/constants";
import { Date_Box_Props } from "@/Pages/types";
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


    const [allDates, setAllDates] = useState<Date[] | string[]>([]);
    const [isShowTheMenu, setIsShowTheMenu] = useState(false);
    const [positionDate, setPositionDate] = useState(0);

    // These for swiper 
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);




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

    function getAllDates() {
        if (state.attendance.length == 0 || !state.attendance) return;

        const arr = [...allDates];

        // Get all dates and don't repeat dates
        state.attendance.forEach(function (ele) {
            if (!arr.includes(ele.date as any)) {
                arr.push(ele.date as any);
            }
        });


        if (allDates.length != arr.length) {
            setAllDates(arr.reverse() as any);
        }
    }

    function updateTheTransaction() {
        if (swiperRef.current) {
            swiperRef.current.slideTo(positionDate);
        }
    }

    function getAllDateInfo() {
        const dateInfo = state.attendance.filter(ele => new Date(ele.date).getTime() == new Date(allDates[positionDate]).getTime());

        onGetDayDetails(dateInfo);
    }



    useEffect(function () {
        getAllDates();
        getAllDateInfo();
        updateTheTransaction();
        onGetDatesTotal(allDates.length);
    }, [positionDate, allDates, state.attendance]);




    return <Drop_Menu
        isShowTheMenu={isShowTheMenu}
        classNameForMenu="w-full"
        messageForNotAddChildren={allDates?.length == 0 ? "لا يوجد ايام"
            :
            allDates?.length == 1 ? "لا يوجد ايام اخرى" : ""
        }
        onGetCurrentIsShowMenu={setIsShowTheMenu}
    >
        <Top_Content_For_The_Drop className={`
                duration-300 w-full px-3
                flex justify-between items-center h-full
                has-[.arrow-btn:hover]:bg-transparent cursor-pointer hover:bg-slate-300/25
            `}
        >
            {
                allDates?.length as any >= 2 ?
                    <ArrowRight
                        size={50}
                        className={`
                            arrow-btn duration-300
                            ${isBeginning ? "cursor-not-allowed opacity-35" : "cursor-pointer hover:scale-150"}
                        `}
                        onClick={handlePrev}
                    />
                    :
                    null
            }

            {/* Dates */}
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                initialSlide={positionDate}
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
                            {format(new Date(ele), styleDate)}
                        </SwiperSlide>)
                }
            </Swiper>

            {
                allDates?.length as any >= 2 ?
                    <ArrowLeft
                        size={50}
                        className={`
                            arrow-btn duration-300
                            ${isEnd ? "cursor-not-allowed opacity-35" : "cursor-pointer hover:scale-150"}
                        `}
                        onClick={handleNext}
                    />
                    :
                    null
            }
        </Top_Content_For_The_Drop>

        {
            allDates?.length as any >= 2 ?
                <Bottom_Content_For_The_Drop className={`
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
                            {format(ele, styleDate)}
                        </button>)
                    }
                </Bottom_Content_For_The_Drop>
                :
                null
        }
    </Drop_Menu>
}