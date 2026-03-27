import { ArrowLeft, ArrowRight, Presentation, SquarePen} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { updatePropertyInTrainer, updateSomePropertiesInTrainer } from "@/Rtk/Slices/trainersSlice";
import { alert, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/customs";
import { useAtom } from "jotai";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import Btn_Finished_Subscription from "./Btns/Btn_Finished_Subscription";
import Btn_Delete_Trainer from "./Btns/Btn_Delete_Trainer";
import Btn_Subscription_Renewal from "./Btns/Btn_Subscription_Renewal";
import { useDispatch } from "react-redux";
import Popup from "@/Global-components/Popup/Popup";
// ========================================================== //
export default function Trainer_Details(
    { onIsShowTrainerDetails }: { onIsShowTrainerDetails: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const setIsShowTrainerDetailsAtom = useAtom(isShowTrainerDetails_Atom)[1];
    const [trainerDetailsAtom, setTrainerDetailsAtom] = useAtom(trainerDetails_Atom);


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

    function updateInfo() {
        if (!isChangeInfo) return;

        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تعديل البيانات , في حالة تعديل عدد الحصص سوف يتم اعاده الحصص من الاول",
            titleAfterClickOnOk: `تم تحديث المتدرب رقم : ${trainerDetailsAtom?.trainerId}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInTrainer({
                    trainerId: trainerDetailsAtom?.trainerId as any,
                    trainer: trainerUpdateOrRenewalObj as any
                }) as any);

                closeThisWinow();
            }
        });
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



    useEffect(function () {
        setIsShowTrainerDetailsAtom(true);
    }, []);


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

    return <Popup
        titel="تفاصيل المتدرب"
        discription="تلك التفاصيل الخاصه بالمتدرب"
        isSave={isChangeInfo}
        typeBtn="save change"
        isShowBtn={subscriptionState == stateIsFinished ? false : true}
        clickOnCancel={closeThisWinow}
        clickOnSaveBtn={updateInfo}
    >
        <div className="px-5 mb-1">
            <div className="flex items-center gap-2 text-(--primary)">
                <Presentation strokeWidth={1.75} size={23} />
                <h3 className="font-bold mb-1">الحصص</h3>
            </div>

            <div className="opacity-60 mb-4">
                <p>
                    <span> تم إكمال </span>
                    <span className="font-bold me-1">
                        {activeSessionsList?.length}
                    </span>
                    <span>  من اصل </span>
                    <span className="font-bold">
                        {trainerDetailsAtom.sessionsCount}
                    </span>
                </p>
            </div>
        </div>

        {/* Sessions */}
        <div
            ref={containerRef}
            className={`
                ${containerRef.current?.clientHeight as any > 100 ? "h-[120px]" : "h-auto"}
                transition duration-500 mb-7 px-5 
                flex gap-2 flex-wrap overflow-auto
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

        {/* Title & arrowes */}
        <div className="px-5 mb-3">
            <div className="flex items-center gap-2 text-(--primary)">
                <SquarePen size={23} />
                <h3 className="font-bold">
                    تفاصيل المتدرب
                </h3>
            </div>

            <div className="flex justify-end gap-2">
                {
                    subscriptionState != stateIsFinished && <>
                        <ArrowRight
                            size={18}
                            className={`
                                swiper-prev
                                ${isBeginning ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
                            `}
                        />

                        <ArrowLeft
                            size={18}
                            className={`
                                swiper-next
                                ${isEnd ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
                            `}
                        />
                    </>
                }
            </div>
        </div>

        {/* Trainer info & Subscription info & Date info */}
        <div className="px-5 mb-7">
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
                {
                    subscriptionState != stateIsFinished && <SwiperSlide>
                        <Trainer_Info_Form
                            onGetFirstName={setGetFirstName}
                            onGetLastName={setGetLastName}
                            onGetPhone={setGetPhone}
                            onGetAddress={setGetAddress}
                        />
                    </SwiperSlide>
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

                <div className="flex gap-2">
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

                    <Btn_Delete_Trainer
                        closeWindow={closeThisWinow}
                        trainer={trainerDetailsAtom}
                    />
                </div>
            </div>
        </div>
    </Popup>
}