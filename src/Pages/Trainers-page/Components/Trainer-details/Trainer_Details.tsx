import { ArrowLeft, ArrowRight, SquarePen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { updateSomePropertiesInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { alert } from "@/Lib/functions";
import { statusIsActive, statusIsFinished, statusIsPending } from "@/Lib/constants";
import Btn_Delete_Trainer from "../Btns/Btn_Delete_Trainer";
import Btn_Subscription_Renewal from "../Btns/Btn_Subscription_Renewal";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { store_Type } from "@/Rtk/types";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import Btn_Withdraw_Money from "../Btns/Btn_Withdraw_Money";
import Sessions from "../Sessions/Sessions";
import Date_Info_Form from "@/Pages/Trainers-page/Components/Forms/Date_Info_Form";
import Subscription_Info_Form from "@/Pages/Trainers-page/Components/Forms/Subscription_Info_Form";
import Trainer_Info_Form from "@/Pages/Trainers-page/Components/Forms/Trainer_Info_Form";
import { deleteAllRowsInActiveSessionsTableToLinkedTheTrainer } from "@/Rtk/Slices/Db-slices/activeSessionsSlice";
import Btn_Cancel_Subscription from "../Btns/Btn_Cancel_Subscription";
import { trainer_Type } from "@/Pages/types";
// ========================================================== //
export default function Trainer_Details() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            trainerDetails: state.trainerDetails,
        }
    }, shallowEqual);



    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [isAnyInfoChanged, setIsAnyInfoChanged] = useState(false);
    const [isActiveSubscriptionRenewal, setIsActiveSubscriptionRenewal] = useState(false);

    const [newInfoForTrainer, setNewInfoForTrainer] = useState({});
    const [subscriptionStatus, setSubscriptionStatus] = useState(statusIsActive);

    // Trainer info
    const [getFirstName, setGetFirstName] = useState<string | null>(null);
    const [getLastName, setGetLastName] = useState<string | null>(null);
    const [getPhone, setGetPhone] = useState<number | null>(0);
    const [getAddress, setGetAddress] = useState<string | null>(null);
    const [getTrainerType, setGetTrainerType] = useState<"man" | "women">("man");

    // Subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState<string | null>(null);
    const [getSessions, setGetSessions] = useState<number | null>(0);
    const [getPrice, setGetPrice] = useState<number | null>(0);

    // Date info
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<string | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<string | null>(null);


    const todayDate = useMemo(() => new Date(), []);

    const statusTheSubscription = useMemo(() => {
        if (
            todayDate.getTime() >= new Date(getSubscriptionStart as any).getTime()
            &&
            todayDate.getTime() < new Date(getSubscriptionEnd as any).getTime()
        ) {
            return statusIsActive;
        }
        else if (todayDate.getTime() < new Date(getSubscriptionStart as any).getTime()) {
            return statusIsPending;
        }
        else if (todayDate.getTime() >= new Date(getSubscriptionEnd as any).getTime()) {
            return statusIsFinished;
        }
    }, [getSubscriptionStart, getSubscriptionEnd, todayDate]);




    function checkTheAnyInfoChanged() {
        if (
            !getFirstName || !getLastName || getPhone == null || (getAddress?.length != 0 && !getAddress) ||
            !getSubscriptionName || !getPrice || !getSessions || !getSubscriptionStart ||
            !getSubscriptionEnd
        ) {
            setIsAnyInfoChanged(false);
            return;
        }

        if (
            getFirstName != state.trainerDetails?.firstName
            ||
            getLastName != state.trainerDetails?.lastName
            ||
            (getAddress != state.trainerDetails?.address)
            ||
            (
                getPhone != null &&
                getPhone != state.trainerDetails?.phone as any
            )
            ||
            getTrainerType != state.trainerDetails.trainerType
            ||
            getSubscriptionName != state.trainerDetails?.subscriptionName
            ||
            getPrice != state.trainerDetails?.price
            ||
            getSessions != state.trainerDetails?.sessionsCount
            ||
            new Date(getSubscriptionStart as any).getTime() != new Date(state.trainerDetails?.subscriptionStart as any).getTime()
            ||
            new Date(getSubscriptionEnd as any).getTime() != new Date(state.trainerDetails?.subscriptionEnd as any).getTime()
        ) {
            setIsAnyInfoChanged(true);
        } else {
            setIsAnyInfoChanged(false);
        }
    }

    function checkTheRenwalSubscription() {
        if (
            !getSubscriptionName ||
            !getPrice ||
            !getSessions ||
            !getSubscriptionStart ||
            !getSubscriptionEnd

        ) {
            setIsActiveSubscriptionRenewal(false);
        }
        else if (
            getSubscriptionName &&
            getPrice &&
            getSessions &&
            getSubscriptionStart &&
            getSubscriptionEnd
        ) {
            setIsActiveSubscriptionRenewal(true);
        }
    }

    function updateInfo() {
        if (isAnyInfoChanged || isActiveSubscriptionRenewal) {
            alert({
                textBeforeSubmit: "هل انت متأكد من تعديل البيانات , في حالة تعديل عدد الحصص سوف يتم اعاده الحصص من الاول",
                textAfterSubmit: `تم تحديث المتدرب رقم : ${state.trainerDetails?.id}`,
                runFunctionAfterSubmit: function () {
                    dispatch(updateSomePropertiesInRowInTrainersTable({
                        id: state.trainerDetails?.id as any,
                        values: {
                            ...newInfoForTrainer,
                            subscriptionStatus: statusTheSubscription,
                        } as any
                    }) as any);


                    if (getSessions != state.trainerDetails?.sessionsCount) {
                        dispatch(deleteAllRowsInActiveSessionsTableToLinkedTheTrainer((Number(state.trainerDetails?.id))) as any);
                    }

                    dispatch(removeTrainerDetails());
                }
            });
        }
    }





    useEffect(function () {
        if (!state.trainerDetails) return;

        setSubscriptionStatus(state.trainerDetails.subscriptionStatus);
    }, [state.trainerDetails]);

    useEffect(function () {
        const obj = {
            id: state.trainerDetails?.id,
            firstName: getFirstName == state.trainerDetails?.firstName || !getFirstName ? state.trainerDetails?.firstName : getFirstName,
            lastName: getLastName == state.trainerDetails?.lastName || !getLastName ? state.trainerDetails?.lastName : getLastName,
            address: getAddress == state.trainerDetails?.address || !getAddress ? state.trainerDetails?.address : getAddress,
            phone: getPhone == Number(state.trainerDetails?.phone) || getPhone == null ? state.trainerDetails?.phone : getPhone,
            trainerType: getTrainerType,
            subscriptionName: getSubscriptionName,
            sessionsCount: getSessions,
            price: getPrice,
            subscriptionStart: getSubscriptionStart,
            subscriptionEnd: getSubscriptionEnd,
            subscriptionStatus: statusTheSubscription
        } as trainer_Type


        setNewInfoForTrainer(obj);


        if (subscriptionStatus != statusIsFinished) {
            checkTheAnyInfoChanged();
        }

        if (subscriptionStatus == statusIsFinished) {
            checkTheRenwalSubscription();
        }
    }, [getFirstName, getLastName, getAddress, getPhone, getTrainerType,
        getSubscriptionName, getSessions, getPrice,
        getSubscriptionStart, getSubscriptionEnd, subscriptionStatus
    ]);




    if (!state.trainerDetails) return null;

    return <Popup_Form
        popupFormInfo={{
            title: "تفاصيل المتدرب",
            discription: "تلك التفاصيل الخاصه بالمتدرب",
        }}
        isSave={isAnyInfoChanged}
        typeBtn="save change"
        classNameForParent="h-[92vh] w-[87vw]"
        isShowBtn={subscriptionStatus == statusIsFinished ? false : true}
        clickOnCancel={() => dispatch(removeTrainerDetails())}
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
                    subscriptionStatus != statusIsFinished && <>
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
                    subscriptionStatus != statusIsFinished && <SwiperSlide>
                        <Trainer_Info_Form
                            onGetFirstName={setGetFirstName}
                            onGetLastName={setGetLastName}
                            onGetPhone={setGetPhone}
                            onGetAddress={setGetAddress}
                            onGetTrainerType={setGetTrainerType}
                        />
                    </SwiperSlide>
                }

                {/* Subscription info & Date info*/}
                <SwiperSlide className="overflow-auto pb-6">
                    <Subscription_Info_Form
                        subscriptionStart={getSubscriptionStart}
                        subscriptionEnd={getSubscriptionEnd}
                        onGetSubscriptionName={setGetSubscriptionName}
                        onGetSessions={setGetSessions}
                        onGetPrice={setGetPrice}
                    />

                    <Date_Info_Form
                        sessions={getSessions}
                        onGetSubscriptionStart={setGetSubscriptionStart}
                        onGetSubscriptionEnd={setGetSubscriptionEnd}
                    />
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
                    subscriptionStatus != statusIsFinished ?
                        <>
                            <Btn_Withdraw_Money trainerId={state.trainerDetails.id as any} />
                            <Btn_Cancel_Subscription trainerId={state.trainerDetails.id as any} />
                        </>
                        :
                        <Btn_Subscription_Renewal
                            trainer={newInfoForTrainer as any}
                            subscriptionStart={new Date(getSubscriptionStart as any).toISOString()}
                            isInfoComplete={isActiveSubscriptionRenewal}
                        />
                }

                <Btn_Delete_Trainer id={state.trainerDetails.id as any} />
            </div>
        </div>
    </Popup_Form>
}