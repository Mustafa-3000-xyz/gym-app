import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
import { All_Trainers_Props, trainer } from "@/Pages/Trainers-page/types";
import { stateIsFinished, styleDate, styleForSubscriptionState } from "@/Lib/customs";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import Not_Found from "@/Global-components/Not-found/Not_Found";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Btn_Slide from "./Btn-slide/Btn_Slide";
// ========================================================== //
export default function All_Trainers(
    {
        trainersList,
        setIsShowTrainerDetails,
    }: All_Trainers_Props
) {
    const setTrainerDetailsAtom = useAtom(trainerDetails_Atom)[1];


    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [slides, setSlides] = useState<trainer[][]>([]);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const trainersCountInSlide = 6;


    async function showDetailsTrainer(trainer: trainer) {
        setIsShowTrainerDetails(true);
        setTrainerDetailsAtom(trainer);
    }


    // This for create slides, and each slides have 5 trainers or less
    useEffect(function () {
        let arr = [];

        for (let i = 0; i < trainersList.length; i++) {
            if (i == trainersCountInSlide - 1) {
                const value = trainersList.slice(0, trainersCountInSlide);
                arr.push(value);

                trainersList.splice(0, trainersCountInSlide);
                i = 0;
            }
        }

        if (trainersList.length < trainersCountInSlide && trainersList.length != 0) {
            arr.push(trainersList);
        }


        setSlides(arr as any);
    }, [trainersList]);


    // Check the slides[currentSlide] return value or no
    useEffect(function () {
        if (slides[currentSlide] == undefined) {
            setCurrentSlide(0);
        }
    }, [slides, currentSlide]);



    if (slides[currentSlide] == undefined) {
        return <div className="mt-20">
            <Not_Found
                srcImg="/not_found_in_table.svg"
                title="لا يوجد متدربين الان"
            />
        </div>
    }


    return <table className="w-full select-none">
        <thead>
            <tr className="text-center bg-slate-100/30">
                <td className="py-4 rounded-tr-lg">اسم المتدرب</td>
                <td className="py-4">رقم المتدرب</td>
                <td className="py-4">الاشتراك</td>
                <td className="py-4">بداية الاشتراك</td>
                <td className="py-4">نهاية الاشتراك</td>
                <td className="py-4 rounded-tl-lg">حالة الاشتراك</td>
            </tr>
        </thead>

        <tbody>
            {
                slides[currentSlide].map(ele => (
                    <tr
                        key={ele.trainerId}
                        onClick={() => showDetailsTrainer(ele as trainer)}
                        className="text-center bg-slate-100 cursor-pointer transition duration-100 hover:bg-[var(--primary)] hover:text-white"
                    >
                        <td className="p-2 py-4">{ele.firstName} {ele.lastName}</td>
                        <td className="font-bold underline">{ele.trainerId}</td>
                        <td className="p-2 py-4">{ele.subscriptionName}</td>
                        <td className="p-2 py-4">
                            {
                                ele.subscriptionState != stateIsFinished ?
                                    format(ele.subscriptionStart, styleDate)
                                    :
                                    "-"
                            }
                        </td>
                        <td className="p-2 py-4">
                            {
                                ele.subscriptionState != stateIsFinished ?
                                    format(ele.subscriptionEnd, styleDate)
                                    :
                                    "-"
                            }
                        </td>
                        <td className="p-2 py-4">
                            <span className={`
                                    px-3 py-1 rounded-full font-bold
                                    ${styleForSubscriptionState(ele).style}
                                `}
                            >
                                {styleForSubscriptionState(ele).title}
                            </span>
                        </td>
                    </tr>
                ))
            }
        </tbody>

        <tfoot>
            <tr className="bg-slate-100/30">
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
                                        <Btn_Slide
                                            index={i}
                                            currentSlide={currentSlide}
                                            onGetIndexBtn={setCurrentSlide}
                                        />
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
}