import { ArrowLeft, ArrowRight, CircleUserRound, Presentation, SquarePen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { deleteTrainerById, updateSomePropertiesInTrainer, updateTrainerProperty } from "@/Db/trainerDb";
import Swal from "sweetalert2";

import { stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/customs";
import { useAtom, useAtomValue } from "jotai";
import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
import isShowTrainerDetails_Atom from "@/Atoms/isShowTrainerDetails_Atom";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import { Show_Traine_Details_Props, trainer } from "../../types";
import Animation from "@/Global-components/Animation/Animation";
import Btn_Finished_Subscription from "./Btns/Btn-finished-subscription/Btn_Finished_Subscription";
import Btn_Delete_Trainer from "./Btns/Btn-delete-trainer/Btn_Delete_Trainer";
import Btn_Subscription_Renewal from "./Btns/Subscription-renewal/Btn_Subscription_Renewal";
import Btn_Save_Change from "./Btns/Btn-save-change/Btn_Save_Change";
import Btn_Cancel from "./Btns/Btn-cancel/Btn_Cancel";
// ========================================================== //
export default function Trainer_Details(
    { getAllTrainers, onIsShowTrainerDetails }: Show_Traine_Details_Props
) {
    const trainer = useAtomValue(trainerDetails_Atom);
    const setIsShowTrainerDetailsAtom = useAtom(isShowTrainerDetails_Atom)[1];


    const [hasOverflow, setHasOverflow] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [subscriptionState, setSubscriptionState] = useState(trainer?.subscriptionState);
    const [activeSessionsList, setActiveSessionsList] = useState(
        JSON.parse(trainer?.activeSessionsList as any)
    );



    // These for swiper
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [isActiveSubscriptionRenewal, setIsActiveSubscriptionRenewal] = useState(false);
    // Check the [ trainer info ] or [ subscription info ] or [ date info ] are change
    const [isChangeInfo, setIsChangeInfo] = useState(false);


    // Trainer info & Subscription info & Date info
    const [getFirstName, setGetFirstName] = useState<string>("");
    const [getLastName, setGetLastName] = useState<string>("");
    const [getPhone, setGetPhone] = useState<number | string>("");
    const [getAddress, setGetAddress] = useState<string>("");
    const [getSubscriptionName, setGetSubscriptionName] = useState<string | string>("");
    const [getSessionsCount, setGetSessionsCount] = useState<number | string>("");
    const [getPrice, setGetPrice] = useState<number | string>("");
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<Date | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<Date | null>(null);


    const trainerObj = {
        // I want when change the sessions count and click on btn save change, so reset the activeSessionsList
        activeSessionsList: getSessionsCount != trainer?.sessionsCount ? [] : activeSessionsList,
        firstName: getFirstName,
        lastName: getLastName,
        address: getAddress,
        phone: getPhone,
        subscriptionName: getSubscriptionName,
        sessionsCount: getSessionsCount,
        price: getPrice,
        subscriptionStart: getSubscriptionStart,
        subscriptionEnd: getSubscriptionEnd
    };


    function closeThisWinow() {
        onIsShowTrainerDetails(false);
        getAllTrainers();
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

                await deleteTrainerById(trainer?.trainerId as any);
                getAllTrainers();
                closeThisWinow();
            }
        });
    }

    function updateInfo() {
        if (!isChangeInfo) return;

        Swal.fire({
            title: "!! تحذير",
            text: "هل انت متأكد من تعديل البيانات , في حالة تعديل عدد الحصص سوف يتم اعاده الحصص من الاول",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم , انا متأكد",
            cancelButtonText: "إلغاء",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "لقد تم التحديث بنجاح",
                    text: `تم تحديث المتدرب رقم : ${trainer?.trainerId}`,
                    icon: "success",
                    confirmButtonText: "تمام"
                });

                await updateSomePropertiesInTrainer(trainer?.trainerId as any,
                    trainerObj as any);
                closeThisWinow();
            }
        });
    }

    function subscriptionRenwal() {
        if (!isActiveSubscriptionRenewal) return;

        Swal.fire({
            title: "لحظه واحده",
            text: "هل تريد تجديد الاشتراك ؟؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم , انا اريد",
            cancelButtonText: "لا",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "لقد تم التجديد بنجاح",
                    text: `تم تجديد اشتراك المتدرب رقم : ${trainer?.trainerId}`,
                    icon: "success",
                    confirmButtonText: "تمام"
                });
                const obj = {
                    ...trainerObj as any,
                    firstName: trainer?.firstName,
                    lastName: trainer?.lastName,
                    phone: trainer?.phone,
                    address: trainer?.address,
                    subscriptionState: stateIsActive,
                    activeSessionsList: [],
                } as trainer;

                await updateSomePropertiesInTrainer(trainer?.trainerId as any,
                    obj as any);
                closeThisWinow();
            }
        });
    }

    function btnFinishedSubscription() {
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

                const obj = {
                    ...trainerObj,
                    subscriptionState: stateIsFinished,
                    subscriptionStart: "",
                    subscriptionEnd: ""
                } as trainer;

                await updateSomePropertiesInTrainer(trainer?.trainerId as any, obj as any);
                setSubscriptionState(stateIsFinished);
                closeThisWinow();
            }
        });
    }

    async function clickOnSession(numCircle: number) {
        let arr = [...activeSessionsList];

        if (!activeSessionsList.includes(numCircle)) {
            arr.push(numCircle);
        }
        else {
            const result = arr.filter(num => num != numCircle);
            arr = result;
        }


        if (arr.length == trainer?.sessionsCount) {
            const obj = {
                ...trainerObj,
                activeSessionsList: arr,
                subscriptionState: stateIsFinished,
                subscriptionStart: "",
                subscriptionEnd: ""
            } as trainer;

            await updateSomePropertiesInTrainer(trainer?.trainerId as any, obj as any);
            setSubscriptionState(stateIsFinished);
            getAllTrainers();
        }

        setActiveSessionsList(arr);
        await updateTrainerProperty(trainer?.trainerId as any,
            "activeSessionsList", arr as any);
    }


    // This for send true to isShowTrainerDetails_Atom
    useEffect(function () {
        setIsShowTrainerDetailsAtom(true);
    }, []);

    // Check the hight for container sessions and run the checkInActiveSessionsList
    useEffect(() => {
        const el = containerRef.current;

        setHasOverflow(el!.clientHeight > 100);
    }, [trainer?.sessionsCount, trainer?.activeSessionsList, activeSessionsList]);

    // This useEffect for check the any value in properties are change
    useEffect(function () {
        if (!getSubscriptionName || !getPrice || !getSessionsCount ||
            !getSubscriptionStart || !getSubscriptionEnd
        ) {
            setIsActiveSubscriptionRenewal(false);
        } else {
            setIsActiveSubscriptionRenewal(true);
        }

        if (
            !getFirstName || !getLastName || !getSubscriptionName || !getPrice ||
            !getSessionsCount || getPhone != 0 && !String(getPhone).match(regexPhone)
        ) {
            setIsChangeInfo(false);
            return;
        }


        if (
            (getFirstName != trainer?.firstName)
            ||
            (getLastName != trainer?.lastName)
            ||
            (getAddress != trainer?.address)
            ||
            (
                (getPhone == 0 || String(getPhone).match(regexPhone))
                && getPhone != trainer?.phone
            )
            ||
            (getSubscriptionName != trainer?.subscriptionName)
            ||
            (getSessionsCount != trainer?.sessionsCount)
            ||
            (getPrice != trainer?.price)
            ||
            (new Date(getSubscriptionStart as any).getTime() != new Date(trainer?.subscriptionStart as any).getTime())
            ||
            (new Date(getSubscriptionEnd as any).getTime() != new Date(trainer?.subscriptionEnd as any).getTime())
        ) {
            setIsChangeInfo(true);
        } else {
            setIsChangeInfo(false);
        }


    }, [getFirstName, getLastName, getAddress, getPhone,
        getSubscriptionName, getSessionsCount, getPrice,
        getSubscriptionStart, getSubscriptionEnd
    ]);



    if (!trainer) return null;

    return <div className="w-screen h-screen fixed bg-black/65 top-0 end-0 select-none z-50">
        <Animation
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
                            ${subscriptionState == stateIsActive ?
                            "bg-emerald-100 text-emerald-500"
                            : subscriptionState == stateIsPending ?
                                "bg-amber-100 text-amber-500"
                                : subscriptionState == stateIsFinished && "bg-red-100 text-red-500"
                        }
                        `}
                    >
                        <CircleUserRound strokeWidth={1.75} size={33} />
                    </div>

                    <div>
                        <h3 className="font-bold text-lg">
                            {trainer?.firstName} {trainer?.lastName}
                        </h3>
                        <p>
                            <span>رقم المتدرب : </span>
                            <span className=" underline font-bold">{trainer?.trainerId}</span>
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
                            subscriptionState == stateIsFinished ?
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
                                cursor-pointer rounded-full h-12 w-12 flex items-center justify-center
                                ${temp ? "bg-[var(--primary)] text-white" :
                                    "bg-slate-200 text-black"}
                                ${subscriptionState == stateIsActive ? "pointer-events-auto cursor-pointer" :
                                    "pointer-events-none cursor-not-allowed opacity-45"}
                            `}
                        >
                            {i + 1}
                        </div>
                    })}
                </div>
            </div>

            {/* Trainer info & Subscription info & Date info */}
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
                    {
                        subscriptionState != stateIsFinished ?
                            <SwiperSlide>
                                <Trainer_Info_Form
                                    onGetFirstName={setGetFirstName}
                                    onGetLastName={setGetLastName}
                                    onGetPhone={setGetPhone}
                                    onGetAddress={setGetAddress}
                                />
                            </SwiperSlide>
                            :
                            null
                    }

                    {/* Subscription info & Date info*/}
                    <SwiperSlide>
                        <Subscription_Info_Form
                            onGetSubscriptionName={setGetSubscriptionName}
                            onGetSessionsCount={setGetSessionsCount}
                            onGetPrice={setGetPrice}
                        />
                        <Date_Info_Form
                            onGetSubscriptionStart={setGetSubscriptionStart}
                            onGetSubscriptionEnd={setGetSubscriptionEnd}
                        />
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
                        {
                            subscriptionState != stateIsFinished ?
                                <Btn_Finished_Subscription
                                    onFinishedSubscription={btnFinishedSubscription}
                                />
                                :
                                <Btn_Subscription_Renewal
                                    isInfoComplete={isActiveSubscriptionRenewal}
                                    onSubscriptionRenwal={subscriptionRenwal}
                                />
                        }

                        {/* Delete trainer */}
                        <Btn_Delete_Trainer
                            onDeleteTrainer={deleteTrainer}
                        />
                    </div>
                </div>
            </div>

            {/* Btn change and cancel */}
            <div className="bg-black/5 p-5 border-t border-t-slate-300 flex gap-3">
                {
                    subscriptionState != stateIsFinished ?
                        <Btn_Save_Change
                            isChangeInfo={isChangeInfo}
                            onUpdateInfo={updateInfo}
                        />
                        :
                        null
                }

                <Btn_Cancel onCloseThisWinow={closeThisWinow} />
            </div>
        </Animation>
    </div>
}