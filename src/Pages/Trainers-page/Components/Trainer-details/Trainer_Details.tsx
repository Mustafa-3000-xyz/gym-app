import { ArrowLeft, ArrowRight, SquarePen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { updateSomePropertiesInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { alert, deleteRowsInActiveSessionsLinkedToTrainer, theTodayDate } from "@/Lib/functions";
import { stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import Btn_Delete_Trainer from "../Btns/Btn_Delete_Trainer";
import Btn_Subscription_Renewal from "../Btns/Btn_Subscription_Renewal";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { store_Type } from "@/Rtk/types";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import Btn_Withdraw_Money from "../Btns/Btn_Withdraw_Money";
import Sessions from "../Sessions/Sessions";
import { removeSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { removeSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
import { removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import Date_Info_Form from "@/Pages/Trainers-page/Components/Forms/Date_Info_Form";
import Subscription_Info_Form from "@/Pages/Trainers-page/Components/Forms/Subscription_Info_Form";
import Trainer_Info_Form from "@/Pages/Trainers-page/Components/Forms/Trainer_Info_Form";
// ========================================================== //
export default function Trainer_Details() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            subscriptionStart: state.subscriptionStart,
            subscriptionEnd: state.subscriptionEnd,
            sessionsCount: state.sessionsCount,
            trainerDetails: state.trainerDetails,
        }
    }, shallowEqual);


    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [isActiveSubscriptionRenewal, setIsActiveSubscriptionRenewal] = useState(false);
    const [isActiveBtnSave, setIsActiveBtnSave] = useState(false);

    const [newInfoForTrainer, setNewInfoForTrainer] = useState({});
    const [subscriptionState, setSubscriptionState] = useState(stateIsActive);
    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);

    // Trainer info & Subscription info & Date info
    const [getFirstName, setGetFirstName] = useState<string | null>(null);
    const [getLastName, setGetLastName] = useState<string | null>(null);
    const [getPhone, setGetPhone] = useState<number | null>(0);
    const [getAddress, setGetAddress] = useState<string | null>(null);
    const [getSubscriptionName, setGetSubscriptionName] = useState<string | null>("");
    const [getPrice, setGetPrice] = useState<number | null>(0);



    function checkTheSessionsIsChanges() {
        if (state.sessionsCount == state.trainerDetails?.sessionsCount) return;

        deleteRowsInActiveSessionsLinkedToTrainer(Number(state.trainerDetails?.id));
    }

    function updateInfo() {
        if (!isActiveBtnSave) return;

        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تعديل البيانات , في حالة تعديل عدد الحصص سوف يتم اعاده الحصص من الاول",
            titleAfterClickOnOk: `تم تحديث المتدرب رقم : ${state.trainerDetails?.id}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInRowInTrainersTable({
                    id: state.trainerDetails?.id as any,
                    values: {
                        ...newInfoForTrainer,
                        subscriptionState: statusTheSubscription,
                    } as any
                }) as any);

                checkTheSessionsIsChanges();
                dispatch(removeTrainerDetails());
                dispatch(removeSubscriptionStart());
                dispatch(removeSubscriptionEnd());
                dispatch(removeAllSessions());
            }
        });
    }

    function clickOnCancel() {
        dispatch(removeTrainerDetails())
        dispatch(removeSubscriptionStart());
        dispatch(removeSubscriptionEnd());
        dispatch(removeAllSessions());
    }



    useEffect(function () {
        if (!state.trainerDetails) return;

        setSubscriptionState(state.trainerDetails.subscriptionState);
    }, [state.trainerDetails]);

    // This useEffect for check the any value in properties are change
    useEffect(function () {
        const obj = {
            id: state.trainerDetails?.id,
            firstName: getFirstName == state.trainerDetails?.firstName || !getFirstName ? state.trainerDetails?.firstName : getFirstName,
            lastName: getLastName == state.trainerDetails?.lastName || !getLastName ? state.trainerDetails?.lastName : getLastName,
            address: getAddress == state.trainerDetails?.address || !getAddress ? state.trainerDetails?.address : getAddress,
            phone: getPhone == Number(state.trainerDetails?.phone) || !getPhone ? state.trainerDetails?.phone : getPhone,
            subscriptionName: getSubscriptionName,
            sessionsCount: state.sessionsCount,
            price: getPrice,
            subscriptionStart: state.subscriptionStart,
            subscriptionEnd: state.subscriptionEnd,
        }


        // This conditional for subscription renewal
        if (
            subscriptionState == stateIsFinished &&
            !getSubscriptionName ||
            !getPrice ||
            !state.sessionsCount ||
            !state.subscriptionStart ||
            !state.subscriptionEnd

        ) {
            setIsActiveSubscriptionRenewal(false);
        }
        else if (
            subscriptionState == stateIsFinished &&
            getSubscriptionName &&
            getPrice &&
            state.sessionsCount &&
            state.subscriptionStart &&
            state.subscriptionEnd
        ) {
            setNewInfoForTrainer(obj);
            setIsActiveSubscriptionRenewal(true);
            return;
        }


        /*
            This conditional for update info for trainer, 
            but the subscription state is active or pending
        */
        if (
            !getFirstName || !getLastName || !getSubscriptionName || !getPrice ||
            !state.sessionsCount || !state.subscriptionEnd || getPhone == null
        ) {
            setIsActiveBtnSave(false);
        }
        else if (
            getFirstName != state.trainerDetails?.firstName
            ||
            getLastName != state.trainerDetails?.lastName
            ||
            getAddress != state.trainerDetails?.address
            ||
            (
                getPhone != null &&
                getPhone != state.trainerDetails?.phone as any
            )
            ||
            getSubscriptionName != state.trainerDetails?.subscriptionName
            ||
            state.sessionsCount != state.trainerDetails?.sessionsCount
            ||
            getPrice != state.trainerDetails?.price
            ||
            new Date(state.subscriptionStart as any).getTime() != new Date(state.trainerDetails?.subscriptionStart as any).getTime()
            ||
            new Date(state.subscriptionEnd as any).getTime() != new Date(state.trainerDetails?.subscriptionEnd as any).getTime()
        ) {
            setNewInfoForTrainer(obj);
            setIsActiveBtnSave(true);
        } else {
            setIsActiveBtnSave(false);
        }
    }, [getFirstName, getLastName, getAddress, getPhone,
        getSubscriptionName, state.sessionsCount, getPrice,
        state.subscriptionStart, state.subscriptionEnd, subscriptionState
    ]);


    const statusTheSubscription = useMemo(() => {
        if (
            todayDate.getTime() >= new Date(state.subscriptionStart as any).getTime()
            &&
            todayDate.getTime() <= new Date(state.subscriptionEnd as any).getTime()
        ) {
            return stateIsActive;
        }
        else if (
            todayDate.getTime() < new Date(state.subscriptionStart as any).getTime()
        ) {
            return stateIsPending;
        }
        else {
            return stateIsFinished;
        }
    }, [state.subscriptionStart, state.subscriptionEnd, todayDate]);




    if (!state.trainerDetails) return null;

    return <Popup_Form
        titel="تفاصيل المتدرب"
        discription="تلك التفاصيل الخاصه بالمتدرب"
        isSave={isActiveBtnSave}
        typeBtn="save change"
        className="h-[87vh] flex flex-col justify-between"
        isShowBtn={subscriptionState == stateIsFinished ? false : true}
        clickOnCancel={clickOnCancel}
        clickOnSaveBtn={updateInfo}
    >
        {/* Sessions */}
        <Sessions />

        {/* Title & arrowes */}
        <div className="mb-5 flex justify-between items-center">
            {/* Title */}
            <div className="flex items-center gap-2 text-(--thirdColor)">
                <SquarePen size={23} />
                <h3 className="font-bold">
                    تفاصيل المتدرب
                </h3>
            </div>

            {/* Arrows */}
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
        </div >

        {/* Trainer info & Subscription info & Date info */}
        <div>
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
                <SwiperSlide className="overflow-auto pb-6">
                    <Subscription_Info_Form
                        onGetSubscriptionName={setGetSubscriptionName}
                        onGetPrice={setGetPrice}
                    />

                    <Date_Info_Form />
                </SwiperSlide>
            </Swiper>
        </div>

        {/* Warning zone */}
        <div className="bg-red-100/50 p-3 rounded-lg border border-red-300" >
            <h3 className="text-red-500 font-bold mb-3">
                منطقة الإجراءات
            </h3>

            <div className="flex gap-2">
                {
                    subscriptionState != stateIsFinished ?
                        <Btn_Withdraw_Money trainerId={state.trainerDetails.id as any} />
                        :
                        <Btn_Subscription_Renewal
                            trainer={newInfoForTrainer as any}
                            isInfoComplete={isActiveSubscriptionRenewal}
                        />
                }

                <Btn_Delete_Trainer id={state.trainerDetails.id as any} />
            </div>
        </div>
    </Popup_Form >
}