import { ArrowLeft, ArrowRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { format } from "date-fns";
import { styleDate } from "@/Lib/constants";
import { Date_Box_Props, dayDetails } from "@/Pages/types";
import { getAllDetailsForMainDay } from "@/Lib/functions";
import { deleteRowInDaysTableById } from "@/Rtk/Slices/Db-slices/daysSlice";
import { deleteRowInDaysDetailsTableById } from "@/Rtk/Slices/Db-slices/daysDetailsSlice";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import { Swiper as SwiperType } from "swiper";
// ========================================================== //
export default function Date_Box(
    { onGetDayDetails, onChangeFilterType }: Date_Box_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            days: state.days,
            daysDetails: state.daysDetails,
        }
    }, shallowEqual);

    const [positionDate, setPositionDate] = useState(Math.max(0, state.days?.length as any- 1));
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const swiperRef = useRef<SwiperType | null>(null);
    const [isShowTheMenu, setIsShowTheMenu] = useState(false);



    async function catchDayDetails(mainDayId: number) {
        const dayDetails = await getAllDetailsForMainDay(mainDayId) as dayDetails[];

        if (!dayDetails) return;

        //  This loop for check the row if trainers array is empty
        dayDetails.forEach(function (row) {
            const convertToArray = JSON.parse(row.trainers as any) as number[];

            if (convertToArray.length == 0 && dayDetails.length == 1) {
                dispatch(deleteRowInDaysTableById(mainDayId) as any);
            }
            else if (convertToArray.length == 0) {
                dispatch(deleteRowInDaysDetailsTableById(Number(row.id)) as any);
            }
        });

        onGetDayDetails(dayDetails as any);
    }

    function clickOnArrows(e: React.MouseEvent) {
        e.stopPropagation();
        setIsShowTheMenu(false);
    }



    // When select date, i want update the transaction the date in swiper
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(positionDate);
        }
    }, [positionDate]);

    useEffect(function () {
        const getDayId = state.days?.find((_, i) => i == positionDate)?.id;

        onChangeFilterType("allTrainers");
        catchDayDetails(Number(getDayId));
    }, [state.days, state.daysDetails, positionDate]);





    return <Drop_Menu
        isShowTheMenu={isShowTheMenu}
        classNameForMenu="w-full"
        messageForNotAddChildren={state.days?.length == 0 ?
            "لا يوجد ايام"
            :
            state.days?.length == 1 ? "لا يوجد ايام اخرى" : ""
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
                state.days?.length as any >= 2 ?
                    <ArrowRight
                        size={50}
                        className={`
                            swiper-prev arrow-btn duration-300
                            ${isBeginning ? "cursor-not-allowed opacity-35" : "cursor-pointer hover:scale-150"}
                        `}
                        onClick={clickOnArrows}
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
                navigation={{
                    prevEl: ".swiper-prev",
                    nextEl: ".swiper-next",
                }}
                onSlideChange={(swiper) => {
                    setPositionDate(swiper.activeIndex);
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {
                    state.days?.length == 0 ?
                        "-"
                        :
                        state.days?.map(ele => <SwiperSlide key={ele.id} className="text-center">
                            {format(new Date(ele.date), styleDate)}
                        </SwiperSlide>)
                }
            </Swiper>

            {
                state.days?.length as any >= 2 ?
                    <ArrowLeft
                        size={50}
                        className={`
                            swiper-next arrow-btn duration-300
                            ${isEnd ? "cursor-not-allowed opacity-35" : "cursor-pointer hover:scale-150"}
                        `}
                        onClick={clickOnArrows}
                    />
                    :
                    null
            }
        </Top_Content_For_The_Drop>

        {
            state.days?.length as any >= 2 ?
                <Bottom_Content_For_The_Drop className={`
                    flex flex-col gap-3
                    ${state.days?.length as any >= 4 ? "h-[209px] overflow-auto p-3" : ""}
                `}
                >
                    {
                        state.days?.map((ele, i) => <button
                            key={ele.id}
                            className={`
                                duration-300
                                w-full bg-slate-200 p-3 font-bold cursor-pointer rounded-lg
                                ${positionDate == i ? "!bg-emerald-500 text-white" : "hover:bg-emerald-500 hover:text-white"}
                            `}
                            onClick={() => setPositionDate(i)}
                        >
                            {format(ele.date, styleDate)}
                        </button>)
                    }
                </Bottom_Content_For_The_Drop>
                :
                null
        }
    </Drop_Menu>
}