import { Show_Traine_Details_Props } from "@/Pages/Trainers-page/trainersTypes";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BanknoteX, CircleUserRound, Presentation, SquarePen, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { deleteTrainerById, updateTrainerProperty } from "@/db/trainerDb";
import Swal from "sweetalert2";

import "swiper/css/navigation";
import "swiper/css";
import { stateIsActive, stateIsFinished, stateIsPending } from "@/lib/customs";
// ========================================================== //
export default function Show_Trainer_Details(
    { trainer, onIsShowTrainerDetails, getAllTrainers }: Show_Traine_Details_Props
) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [hasOverflow, setHasOverflow] = useState(false)
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [isSubscriptionActive, setIsSubscriptionActive] = useState(trainer.subscriptionState);
    const [activeSessionsList, setActiveSessionsList] = useState(
        JSON.parse(trainer.activeSessionsList as any)
    );


    function closeThisWinow() {
        onIsShowTrainerDetails(false);
    }

    async function clickOnSession(numCircle: number) {
        const arr = [...activeSessionsList];

        if (!activeSessionsList.includes(numCircle)) {
            arr.push(numCircle);
            setActiveSessionsList(arr);
        }
        // This for return about active session
        else {
            const result = arr.filter(num => num != numCircle);
            setActiveSessionsList(result);
        }
    }

    function deleteTrainer() {
        Swal.fire({
            title: "!! تحذير",
            text: "هل تريد حقا حذف ذلك المتدرب ؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم , انا متأكد",
            cancelButtonText: "إلغاء",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "لقد تم حذف المتدرب بنجاح",
                    text: "ذلك المتدرب لم يعد موجود في الجدول",
                    icon: "success",
                    confirmButtonText: "تمام"
                });

                await deleteTrainerById(trainer.trainerId);
                getAllTrainers();
                closeThisWinow();
            }
        });
    }

    function finishedSubscription() {
        Swal.fire({
            title: "!! تحذير",
            text: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم , انا متأكد",
            cancelButtonText: "إلغاء",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "تمت العمليه",
                    text: "تم إنتهاء الاشتراك",
                    icon: "success",
                    confirmButtonText: "تمام"
                });

                setIsSubscriptionActive(stateIsFinished);
                await updateTrainerProperty(trainer.trainerId, "subscriptionState", stateIsFinished);
                getAllTrainers();
                closeThisWinow();
            }
        });
    }

    async function update() {
        if (activeSessionsList.length == trainer.sessionsCount) {
            setIsSubscriptionActive(stateIsFinished);
            await updateTrainerProperty(trainer.trainerId, "subscriptionState", stateIsFinished);
            getAllTrainers();
        }

        await updateTrainerProperty(trainer.trainerId, "activeSessionsList", activeSessionsList);
    }


    useEffect(() => {
        const el = containerRef.current;

        setHasOverflow(el!.clientHeight > 100);
        update();
    }, [trainer.sessionsCount, activeSessionsList]);


    return <div className="w-screen h-screen fixed bg-black/65 top-0 end-0 select-none">
        <motion.div
            className={`
                    absolute top-1/2 end-1/2 -translate-x-1/2 -translate-y-1/2 
                    bg-slate-100 border border-slate-200 rounded-lg w-[60vw]
                `}
            initial={{
                scale: 0.5,
            }}
            animate={{
                scale: 1,
            }}
        >
            {/* Title & x & icon */}
            <div className="p-5 flex justify-between items-center mb-7 bg-black/5 border-b border-b-slate-300">
                <div className=" flex items-center gap-4">
                    <div className={`
                            p-3 rounded-full
                            ${isSubscriptionActive == stateIsActive ?
                            "bg-emerald-100 text-emerald-500"
                            : isSubscriptionActive == stateIsPending ?
                                "bg-amber-100 text-amber-500"
                                : isSubscriptionActive == stateIsFinished && "bg-red-100 text-red-500"
                        }
                        `}
                    >
                        <CircleUserRound strokeWidth={1.75} size={33} />
                    </div>

                    <div>
                        <h3 className="font-bold text-lg">
                            {trainer.firstName} {trainer.lastName}
                        </h3>
                        <p>
                            <span>رقم المتدرب : </span>
                            <span className=" underline font-bold">{trainer.trainerId}</span>
                        </p>
                    </div>
                </div>

                <X size={23} onClick={closeThisWinow} className="cursor-pointer text-red-500" />
            </div>

            {/* Sessions */}
            <div className="px-5 mb-7">
                <div className="mb-1">
                    <div className="flex items-center gap-2 text-(--primary)">
                        <Presentation strokeWidth={1.75} size={23} />
                        <h3 className="font-bold mb-1">الحصص</h3>
                    </div>

                    <div className="opacity-60 mb-4">
                        {
                            isSubscriptionActive == stateIsFinished ?
                                <p>
                                    تم إكمال الحصص
                                </p>
                                :
                                <p>
                                    <span> تم إكمال </span>
                                    <span className="font-bold me-1">
                                        {activeSessionsList.length}
                                    </span>
                                    <span>
                                        من اصل
                                    </span>
                                    <span className="font-bold"> {trainer.sessionsCount} </span>
                                </p>
                        }
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className={`
                        transition duration-500
                        flex gap-2 flex-wrap overflow-auto
                        ${hasOverflow ? "h-[120px]" : "h-auto"}
                    `}
                >
                    {Array.from({ length: trainer.sessionsCount }).map((_, i) => {
                        const temp = activeSessionsList.includes(i);

                        return <div
                            key={i}
                            onClick={() => clickOnSession(i)}
                            className={`
                                ${temp ? "bg-[var(--primary)] text-white" : "bg-slate-200 text-black"}
                                ${isSubscriptionActive == stateIsActive ?
                                    "pointer-events-auto cursor-pointer" : "pointer-events-none cursor-not-allowed opacity-45"}
                                cursor-pointer rounded-full h-12 w-12 flex items-center justify-center
                            `}
                        >
                            {i + 1}
                        </div>
                    })}
                </div>
            </div>

            {/* Trainer informations */}
            <div className="px-5 mb-7">
                <div className="mb-3">
                    <div className="flex items-center gap-2 text-(--primary)">
                        <SquarePen size={23} />
                        <h3 className="font-bold">
                            تفاصيل المتدرب
                        </h3>
                    </div>

                    <div className="flex justify-end gap-2">
                        <ArrowRight
                            size={18}
                            className={`
                                swiper-prev
                                ${isBeginning ? "cursor-not-allowed opacity-35"
                                    : "cursor-pointer"}
                            `}
                        />

                        <ArrowLeft
                            size={18}
                            className={`
                                swiper-next
                                ${isEnd ? "cursor-not-allowed opacity-35"
                                    : "cursor-pointer"}
                            `}
                        />
                    </div>
                </div>


                <Swiper
                    modules={[Navigation]}
                    allowTouchMove={false}
                    spaceBetween={50}
                    navigation={{
                        prevEl: ".swiper-prev",
                        nextEl: ".swiper-next",
                    }}
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning)
                        setIsEnd(swiper.isEnd)
                    }}
                >
                    {/* Trainer info */}
                    <SwiperSlide>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <div className="mb-2">
                                <h3 className=" font-bold mb-1">الاسم الاول</h3>
                                <input
                                    defaultValue={trainer.firstName}
                                    type="text"
                                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0 w-full"
                                />
                            </div>

                            <div className="mb-2">
                                <h3 className=" font-bold mb-1">الاسم الثاني</h3>
                                <input
                                    defaultValue={trainer.lastName}
                                    type="text"
                                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0 w-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="mb-2">
                                <h3 className=" font-bold mb-1">العنوان</h3>
                                <input
                                    defaultValue={trainer.address}
                                    type="text"
                                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0 w-full"
                                />
                            </div>

                            <div className="mb-2">
                                <h3 className=" font-bold mb-1">رقم الموبايل</h3>
                                <div className="bg-slate-100 border border-slate-200 rounded-lg relative">
                                    <input
                                        defaultValue={trainer.phone}
                                        type="number"
                                        className={`
                                    p-2 w-[80%] focus:outline-0
                                    appearance-none
                                    [&::-webkit-inner-spin-button]:appearance-none
                                    [&::-webkit-outer-spin-button]:appearance-none"
                                `}
                                    />

                                    <span className="absolute top-2 left-3">
                                        20+
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Subscription info */}
                    <SwiperSlide>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div>
                                <h4>اسم الاشتراك</h4>
                                <input
                                    defaultValue={trainer.subscriptionName}
                                    type="text"
                                    className="w-full bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                                />
                            </div>

                            <div>
                                <h4>عدد الحصص</h4>
                                <input
                                    defaultValue={trainer.sessionsCount}
                                    type="number"
                                    className={`
                                        w-full bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0
                                        appearance-none
                                        [&::-webkit-inner-spin-button]:appearance-none
                                        [&::-webkit-outer-spin-button]:appearance-none"
                                    `}
                                />
                            </div>

                            <div>
                                <h4>السعر</h4>
                                <input
                                    defaultValue={trainer.price}
                                    type="number"
                                    className={`
                                        w-full bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0
                                        appearance-none
                                        [&::-webkit-inner-spin-button]:appearance-none
                                        [&::-webkit-outer-spin-button]:appearance-none"
                                    `}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {/* Start subscription */}
                            <div className=" w-3/6">
                                <h4>تاريخ بدأ الاشتراك</h4>

                                <p className="w-full bg-slate-100 border border-slate-200 p-2 rounded-lg opacity-70 cursor-not-allowed">
                                    {trainer.subscriptionStart}
                                </p>
                            </div>

                            {/* Days */}
                            <div className="mt-5 px-3 flex gap-1">
                                <span className="leading-7">
                                    000
                                </span>

                                <span>
                                    يوم
                                </span>
                            </div>

                            {/* End subscription */}
                            <div className=" w-3/6">
                                <h4>تاريخ نهاية الاشتراك</h4>

                                {/* <End_Date_Picker
                                    subscriptionStart={trainer.subscriptionStart}
                                    subscriptionEnd={trainer.subscriptionEnd}
                                    setSubscriptionEnd={() => null}
                                /> */}
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* Warning zone */}
            <div className="px-5 mb-6">
                <div className="bg-red-100/50 p-3 rounded-lg border border-red-300">
                    <h3 className=" text-red-500 font-bold mb-3">
                        منطقة الإجراءات
                    </h3>

                    <div className=" flex  gap-2">
                        {/* Finshid subscription */}
                        <button
                            onClick={finishedSubscription}
                            className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-amber-300/40 text-amber-700"
                        >
                            <span>
                                <BanknoteX size={23} />
                            </span>

                            <span>
                                إنهاء الاشتراك
                            </span>
                        </button>

                        <button
                            onClick={deleteTrainer}
                            className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-red-300/40 text-amber-700"
                        >
                            <span>
                                <Trash size={23} />
                            </span>

                            <span>
                                حذف المتدرب
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Btn change and cancel */}
            <div className="bg-black/5 p-5 border-t border-t-slate-300 flex gap-3">
                <button
                    disabled={true}
                    className={`
                        transition duration-300 
                        bg-[#385E97] text-white px-5  py-2 rounded-lg
                        opacity-50 cursor-not-allowed hover:bg-[#285E97]
                    `}
                >
                    حفظ التغيرات
                </button>

                <button
                    onClick={closeThisWinow}
                    className={`
                        transition duration-300 hover:bg-red-600
                        bg-red-500 text-white px-5 cursor-pointer rounded-lg
                    `}
                >
                    إلغاء
                </button>
            </div>
        </motion.div>
    </div>
}