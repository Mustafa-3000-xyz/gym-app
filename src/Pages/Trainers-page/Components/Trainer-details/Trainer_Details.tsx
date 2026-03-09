import { ArrowLeft, ArrowRight, CircleUserRound, Presentation, SquarePen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { updatePropertyInTrainer, updateSomePropertiesInTrainer } from "@/Rtk/Slices/trainersSlice";

import { alert, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/customs";
import { useAtom } from "jotai";
import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
import isShowTrainerDetails_Atom from "@/Atoms/isShowTrainerDetails_Atom";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import Animation from "@/Global-components/Animation/Animation";
import Btn_Finished_Subscription from "./Btns/Btn_Finished_Subscription";
import Btn_Delete_Trainer from "./Btns/Btn_Delete_Trainer";
import Btn_Subscription_Renewal from "./Btns/Btn_Subscription_Renewal";
import Btn_Save_Change from "./Btns/Btn_Save_Change";
import Btn_Cancel from "./Btns/Btn_Cancel";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Trainer_Details(
    { onIsShowTrainerDetails }: { onIsShowTrainerDetails: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const [trainerDetailsAtom, setTrainerDetailsAtom] = useAtom(trainerDetails_Atom);
    const setIsShowTrainerDetailsAtom = useAtom(isShowTrainerDetails_Atom)[1];


    const [hasOverflow, setHasOverflow] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [subscriptionState, setSubscriptionState] = useState(trainerDetailsAtom?.subscriptionState);
    const [activeSessionsList, setActiveSessionsList] = useState(
        JSON.parse(trainerDetailsAtom?.activeSessionsList as any)
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


    const todayDate = new Date();

    const trainerUpdateOrRenewalObj = {
        ...trainerDetailsAtom,
        // I want when change the sessions count and click on btn save change, so reset the activeSessionsList
        activeSessionsList: getSessionsCount != trainerDetailsAtom?.sessionsCount ? "[]" :
            JSON.stringify(activeSessionsList),
        subscriptionState: todayDate.getTime() < new Date(getSubscriptionStart as any).getTime() ?
            stateIsPending : stateIsActive,
        firstName: getFirstName,
        lastName: getLastName,
        address: getAddress,
        phone: getPhone,
        subscriptionName: getSubscriptionName,
        sessionsCount: getSessionsCount,
        price: getPrice,
        subscriptionStart: getSubscriptionStart?.toISOString(),
        subscriptionEnd: getSubscriptionEnd?.toISOString(),
    };

    const trainerFinishedSubscriptionObj = {
        ...trainerUpdateOrRenewalObj,
        firstName: trainerDetailsAtom?.firstName,
        lastName: trainerDetailsAtom?.lastName,
        address: trainerDetailsAtom?.address,
        phone: trainerDetailsAtom?.phone,
        activeSessionsList: JSON.stringify([]),
        subscriptionState: stateIsFinished,
    };



    function closeThisWinow() {
        onIsShowTrainerDetails(false);
    }

    function finishedSubscriptionUsingSessions(arr: number[]) {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            showMessageAfterClickOnOk: false,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: trainerDetailsAtom?.trainerId as any,
                    trainer: trainerFinishedSubscriptionObj as any
                }) as any);

                dispatch(updatePropertyInTrainer({
                    trainerId: trainerDetailsAtom?.trainerId as any,
                    column: "activeSessionsList",
                    value: arr as any,
                }) as any);

                setTrainerDetailsAtom(trainerFinishedSubscriptionObj as any);
                setSubscriptionState(stateIsFinished);
                setActiveSessionsList(arr);
            }
        });
    }

    function clickOnSession(numCircle: number) {
        let arr = [...activeSessionsList];


        /*
            If the num not in activeSessionsList so put in activeSessionsList,
            else remove in activeSessionsList
        */
        if (!arr.includes(numCircle)) {
            arr.push(numCircle);
        }
        else {
            const result = arr.filter(num => num != numCircle);
            arr = result;
        }


        if (arr.length == trainerDetailsAtom?.sessionsCount) {
            finishedSubscriptionUsingSessions(arr);
        } else {
            setActiveSessionsList(arr);

            dispatch(updatePropertyInTrainer({
                trainerId: trainerDetailsAtom?.trainerId as any,
                column: "activeSessionsList",
                value: arr as any,
            }) as any);
        }
    }



    // This for send true to isShowTrainerDetails_Atom
    useEffect(function () {
        setIsShowTrainerDetailsAtom(true);
    }, []);


    // Check the hight for container sessions and run the checkInActiveSessionsList
    useEffect(() => {
        const el = containerRef.current;

        setHasOverflow(el!.clientHeight > 100);
    }, [trainerDetailsAtom?.sessionsCount, trainerDetailsAtom?.activeSessionsList, activeSessionsList]);


    // This useEffect for check the any value in properties are change
    useEffect(function () {
        // This conditional for subscription renewal
        if (!getSubscriptionName || !getPrice || !getSessionsCount ||
            !getSubscriptionStart || !getSubscriptionEnd
        ) {
            setIsActiveSubscriptionRenewal(false);
        } else {
            setIsActiveSubscriptionRenewal(true);
        }

        if (
            !getFirstName || !getLastName || !getSubscriptionName || !getPrice ||
            !getSessionsCount || !getSubscriptionEnd || getPhone != 0 && !String(getPhone).match(regexPhone)
        ) {
            setIsChangeInfo(false);
            return;
        }


        if (
            (getFirstName != trainerDetailsAtom?.firstName)
            ||
            (getLastName != trainerDetailsAtom?.lastName)
            ||
            (getAddress != trainerDetailsAtom?.address)
            ||
            (
                (getPhone == 0 || String(getPhone).match(regexPhone))
                && getPhone != trainerDetailsAtom?.phone
            )
            ||
            (getSubscriptionName != trainerDetailsAtom?.subscriptionName)
            ||
            (getSessionsCount != trainerDetailsAtom?.sessionsCount)
            ||
            (getPrice != trainerDetailsAtom?.price)
            ||
            (new Date(getSubscriptionStart as any).getTime() != new Date(trainerDetailsAtom?.subscriptionStart as any).getTime())
            ||
            (new Date(getSubscriptionEnd as any).getTime() != new Date(trainerDetailsAtom?.subscriptionEnd as any).getTime())
        ) {
            setIsChangeInfo(true);
        } else {
            setIsChangeInfo(false);
        }


    }, [getFirstName, getLastName, getAddress, getPhone,
        getSubscriptionName, getSessionsCount, getPrice,
        getSubscriptionStart, getSubscriptionEnd
    ]);



    if (!trainerDetailsAtom) return null;

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
                            {trainerDetailsAtom?.firstName} {trainerDetailsAtom?.lastName}
                        </h3>
                        <p>
                            <span>رقم المتدرب : </span>
                            <span className=" underline font-bold">{trainerDetailsAtom?.trainerId}</span>
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
                                        {activeSessionsList?.length}
                                    </span>
                                    <span>
                                        من اصل
                                    </span>
                                    <span className="font-bold"> {trainerDetailsAtom.sessionsCount} </span>
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
                    {Array.from({ length: trainerDetailsAtom.sessionsCount }).map((_, i) => {
                        const temp = activeSessionsList?.includes(i);

                        return <div
                            key={i}
                            onClick={() => clickOnSession(i)}
                            className={`
                                rounded-full h-12 w-12 flex items-center justify-center
                                ${subscriptionState == stateIsActive ?
                                    `cursor-pointer ${temp ? "bg-(--primary) text-white" : "bg-slate-200 text-black"}`
                                    :
                                    subscriptionState == stateIsPending ?
                                        `opacity-45 pointer-events-none bg-amber-500 text-amber-100 ${temp && "!bg-(--primary) text-white"}`
                                        :
                                        "opacity-45 pointer-events-none bg-red-500 text-red-100"
                                }
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
                                    id={trainerDetailsAtom.trainerId}
                                    trainerState={trainerFinishedSubscriptionObj}
                                    onGetSubscriptionState={setSubscriptionState}
                                    onGetTrainer={setTrainerDetailsAtom}
                                />
                                :
                                <Btn_Subscription_Renewal
                                    trainer={trainerDetailsAtom}
                                    trainerState={trainerUpdateOrRenewalObj}
                                    isInfoComplete={isActiveSubscriptionRenewal}
                                    closeWindow={closeThisWinow}
                                    onGetSubscriptionState={setSubscriptionState}
                                />
                        }

                        {/* Delete trainerDetailsAtom */}
                        <Btn_Delete_Trainer
                            closeWindow={closeThisWinow}
                            trainer={trainerDetailsAtom}
                        />
                    </div>
                </div>
            </div>

            {/* Btn change and cancel */}
            <div className="bg-black/5 p-5 border-t border-t-slate-300 flex gap-3">
                {
                    subscriptionState != stateIsFinished ?
                        <Btn_Save_Change
                            id={trainerDetailsAtom.trainerId}
                            trainerState={trainerUpdateOrRenewalObj}
                            isChangeInfo={isChangeInfo}
                            closeWindow={closeThisWinow}
                        />
                        :
                        null
                }

                <Btn_Cancel onCloseThisWinow={closeThisWinow} />
            </div>
        </Animation >
    </div >
}