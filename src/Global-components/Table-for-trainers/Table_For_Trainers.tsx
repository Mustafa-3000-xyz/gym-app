import { trainer_Type } from "@/Pages/types";
import { checkThePermissionIsHere, normalAlert, styleForSubscriptionState } from "@/Lib/functions";
import { styleDate, trainerPagePath } from "@/Lib/constants";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Not_Found from "@/Global-components/Not-found/Not_Found";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Btn_Slide from "./Btn-slide/Btn_Slide";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { addTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { store_Type } from "@/Rtk/types";
import { useNavigate } from "react-router-dom";
// ========================================================== //
export default function Table_For_Trainers(
    { trainersList }: { trainersList: trainer_Type[] }
) {
    const dispath = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);



    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [slides, setSlides] = useState<trainer_Type[][]>([]);
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const navigation = useNavigate();
    const trainersCountInSlide = 6;

    const checkTrainerPagePermission = checkThePermissionIsHere({
        accountId: Number(state.logInInfo?.id),
        permissionType: trainerPagePath,
    })



    function clickOnTrainer(trainer_Type: trainer_Type) {
        dispath(addTrainerDetails(trainer_Type));

        if (checkTrainerPagePermission) {
            navigation(trainerPagePath);
        }
        else{
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحيه للوصول الى صفحة المتدربين  لمعرفة تفاصيل المتدرب",
                icon: "error"
            });
        }
    }


    // This for create slides, and each slides have 6 trainers or less
    useEffect(function () {
        const arr: trainer_Type[][] = [];

        for (let i = 0; i < trainersList.length; i += trainersCountInSlide) {
            const createSlice = trainersList.slice(i, i + trainersCountInSlide);
            arr.push(createSlice);
        }


        setSlides(arr);
        setCurrentSlide(0);
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
                title="لا يوجد بيانات"
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
                        key={ele.id}
                        onClick={() => clickOnTrainer(ele as trainer_Type)}
                        className={`
                            text-center bg-slate-100 cursor-pointer transition duration-100
                            hover:text-white ${state.logInInfo?.type == "manager" ? "hover:bg-(--managerColor)" : "hover:bg-(--captainColor)"}
                        `}
                    >
                        <td className="p-2 py-4">{ele.firstName.slice(0,4)} {ele.lastName.slice(0,4)}</td>
                        <td className="font-bold underline">{ele.id}</td>
                        <td className="p-2 py-4">{ele.subscriptionName}</td>
                        <td className="p-2 py-4">
                            {format(ele.subscriptionStart, styleDate)}
                        </td>
                        <td className="p-2 py-4">
                            {format(ele.subscriptionEnd, styleDate)}
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