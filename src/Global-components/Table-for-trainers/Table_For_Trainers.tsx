import { trainer_Type } from "@/Pages/types";
import { checkPermissionesInAccount, normalAlert } from "@/Lib/functions";
import { styleDate, trainerPagePath } from "@/Lib/constants";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Not_Found from "@/Global-components/Not-found/Not_Found";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { addTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { store_Type } from "@/Rtk/types";
import { useNavigate } from "react-router-dom";
import { Table_For_Trainers_Props } from "../typesProps";
// ========================================================== //
export default function Table_For_Trainers(
    { trainersList, countRowsInSlide }: Table_For_Trainers_Props
) {
    const dispath = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);
    const checkTrainerPagePermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: trainerPagePath,
    }) as string[] | true;



    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const navigation = useNavigate();


    // This for create slides
    const slides = useMemo(function () {
        const arr: trainer_Type[][] = [];

        for (let i = 0; i < trainersList.length; i += countRowsInSlide) {
            const createSlice = trainersList.slice(i, i + countRowsInSlide);
            arr.push(createSlice);
        }

        setCurrentSlide(0);

        return arr
    }, [trainersList, countRowsInSlide]);




    function clickOnTrainer(trainer_Type: trainer_Type) {
        dispath(addTrainerDetails(trainer_Type));

        if (checkTrainerPagePermission) {
            navigation(trainerPagePath);
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحيه للوصول الى صفحة المتدربين  لمعرفة تفاصيل المتدرب",
                icon: "error"
            });
        }
    }



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
        <thead className="bg-slate-300/30">
            <tr className="text-center">
                <td className="py-4 rounded-tr-lg">اسم المتدرب</td>
                <td className="py-4">رقم المتدرب</td>
                <td className="py-4">نوع المتدرب</td>
                <td className="py-4">الاشتراك</td>
                <td className="py-4">بداية الاشتراك</td>
                <td className="py-4 rounded-tl-lg">نهاية الاشتراك</td>
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
                        onClick={() => clickOnTrainer(ele as trainer_Type)}
                    >
                        <td className="p-2 py-4">{ele.firstName.slice(0, 4)} {ele.lastName.slice(0, 4)}</td>
                        <td className="font-bold underline">{ele.id}</td>
                        <td>
                            {ele.trainerType == "man" ? "رجل" : "انثى"}
                        </td>
                        <td className="p-2 py-4">{ele.subscriptionName}</td>
                        <td className="p-2 py-4 underline font-bold">
                            {format(new Date(ele.subscriptionStart), styleDate)}
                        </td>
                        <td className="p-2 py-4 underline font-bold">
                            {format(new Date(ele.subscriptionEnd), styleDate)}
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
}