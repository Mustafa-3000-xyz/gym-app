import { ArrowLeft, ArrowRight, Presentation, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { updatePropertyInRowInTrainersTable, updateSomePropertiesInRowInTrainersTable } from "@/Rtk/Slices/trainersSlice";
import { alert, theTodayDate } from "@/Lib/functions";
import { stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import Btn_Finished_Subscription from "./Btns/Btn_Finished_Subscription";
import Btn_Delete_Trainer from "./Btns/Btn_Delete_Trainer";
import Btn_Subscription_Renewal from "./Btns/Btn_Subscription_Renewal";
import { useDispatch, useSelector } from "react-redux";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { activeSessionsList_Type } from "@/Pages/types";
import { store_Type } from "@/Rtk/types";
import { updatePropertyInRowInAccountsTable } from "@/Rtk/Slices/accountsSlice";
import { updatePropertyInRowInSubscriptionsMenusTable } from "@/Rtk/Slices/subscriptionsMenusSlice";
import { removeTrainerDetails } from "@/Rtk/Slices/trainerDetailsSlice";
// ========================================================== //
export default function Trainer_Details() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);


    const containerRef = useRef<HTMLDivElement | null>(null)
    const [subscriptionState, setSubscriptionState] = useState(stateIsActive);
    const [activeSessionsList, setActiveSessionsList] = useState<activeSessionsList_Type[]>([]);


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


    const totalActiveSessions = activeSessionsList.reduce((sum, ele) => sum + ele.sessions.length, 0);
    const todayDate = theTodayDate({ startingIn12Houre: true });
    const conditionalForActiveSubscription = todayDate.getTime() >= new Date(getSubscriptionStart as any).getTime() && todayDate.getTime() <= new Date(getSubscriptionEnd as any).getTime();
    const conditionalForPendingSubscription = todayDate.getTime() < new Date(getSubscriptionStart as any).getTime();
    const conditionalForFinishedSubscription = todayDate.getTime() > new Date(getSubscriptionEnd as any).getTime();


    const updateTheTrainer = {
        ...state.trainerDetails,
        // I want when change the sessions count and click on btn save change, so reset the activeSessionsList
        activeSessionsList: getSessionsCount != state.trainerDetails?.sessionsCount ? "[]" : JSON.stringify(activeSessionsList),
        subscriptionState: conditionalForActiveSubscription ?
            stateIsActive
            :
            conditionalForPendingSubscription ?
                stateIsPending
                :
                conditionalForFinishedSubscription && stateIsFinished,
        firstName: getFirstName != "" ? getFirstName : state.trainerDetails?.firstName,
        lastName: getLastName != "" ? getLastName : state.trainerDetails?.lastName,
        address: getAddress != "" ? getAddress : state.trainerDetails?.address,
        phone: getPhone != "" ? getPhone : state.trainerDetails?.phone,
        subscriptionName: getSubscriptionName,
        sessionsCount: getSessionsCount,
        price: getPrice,
        subscriptionStart: getSubscriptionStart?.toISOString(),
        subscriptionEnd: getSubscriptionEnd?.toISOString(),
    };



    function updateInfo() {
        if (!isChangeInfo) return;

        alert({
            titleBeforeClickOnOk: "هل انت متأكد من تعديل البيانات , في حالة تعديل عدد الحصص سوف يتم اعاده الحصص من الاول",
            titleAfterClickOnOk: `تم تحديث المتدرب رقم : ${state.trainerDetails?.trainerId}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInRowInTrainersTable({
                    trainerId: state.trainerDetails?.trainerId as any,
                    values: { ...updateTheTrainer } as any
                }) as any);

                incrementTheTrainersTotalForSubscriptionMenu();
                dispatch(removeTrainerDetails());
            }
        });
    }

    function finishedSubscriptionUsingSessions(accountId: number) {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            titleAfterClickOnOk: `تم إنهاء الاشتراك للمتدرب رقم : ${state.trainerDetails?.trainerId}`,
            funRunWhenClickOnOk: function () {
                dispatch(updateSomePropertiesInRowInTrainersTable({
                    trainerId: state.trainerDetails?.trainerId as any,
                    values: {
                        activeSessionsList: JSON.stringify([]),
                        subscriptionState: stateIsFinished,
                    } as any
                }) as any);

                incrementOrDecrementForTotalSessionInAccount("increment", accountId);
                setSubscriptionState(stateIsFinished);
                dispatch(removeTrainerDetails());
            }
        });
    }

    function clickOnSession(numCircle: number) {
        if (subscriptionState == stateIsPending || subscriptionState == stateIsFinished) return;

        const arr = [...activeSessionsList];
        const getAccount = arr.find(ele => ele.accountId == state.logInInfo?.id);
        const findTheSession = arr.find(ele => ele.sessions.includes(numCircle));

        if (
            (state.trainerDetails?.sessionsCount == totalActiveSessions + 1)
            &&
            !findTheSession
        ) {
            finishedSubscriptionUsingSessions(Number(state.logInInfo?.id));
            return;
        }

        /* If the current account is not in activeSessionsList
            and the session does not exist, create a new entry */
        if (!findTheSession && !getAccount) {
            const obj = {
                accountId: state.logInInfo?.id,
                sessions: [numCircle]
            } as activeSessionsList_Type

            arr.push(obj);
            incrementOrDecrementForTotalSessionInAccount("increment", Number(state.logInInfo?.id));
        }

        // If the account exists but the session does not here, append the session
        else if (!findTheSession && getAccount) {
            const obj = {
                accountId: getAccount.accountId,
                sessions: [...getAccount.sessions, numCircle]
            } as activeSessionsList_Type

            const getIndex = arr.findIndex(ele => ele.accountId == obj.accountId);

            // This for remove old obj
            arr.splice(getIndex, 1);
            arr.push(obj);
            incrementOrDecrementForTotalSessionInAccount("increment", getAccount.accountId as any);
        }

        /* If the account and session exist, and either the session belongs to the account
            or the account is a manager, remove the session */
        else if (
            (findTheSession?.accountId == state.logInInfo?.id)
            ||
            (state.logInInfo?.type == "manager")
        ) {
            const getIndex = arr.findIndex(ele => ele.accountId == findTheSession?.accountId);
            const removeSession = findTheSession?.sessions.filter(ele => ele != numCircle);
            const obj = {
                accountId: findTheSession?.accountId,
                sessions: removeSession
            } as activeSessionsList_Type


            // This for remove old obj
            arr.splice(getIndex, 1);
            arr.push(obj);
            incrementOrDecrementForTotalSessionInAccount("decrement", findTheSession?.accountId as any);
        }


        setActiveSessionsList(arr);
    }

    function incrementOrDecrementForTotalSessionInAccount(
        incrementOrDecrement: "increment" | "decrement",
        accountId: number
    ) {
        const getAccount = state.accountes.find(ele => ele.id == accountId);


        switch (incrementOrDecrement) {
            case "increment":
                dispatch(updatePropertyInRowInAccountsTable({
                    id: accountId,
                    column: "totalForActiveSessions",
                    value: Math.trunc(getAccount?.totalForActiveSessions as number) + 1
                }) as any);
                break;
            case "decrement":
                dispatch(updatePropertyInRowInAccountsTable({
                    id: accountId,
                    column: "totalForActiveSessions",
                    value: Math.trunc(getAccount?.totalForActiveSessions as number) - 1
                }) as any);
                break;
        }
    }

    // If the account is deleted, change id to removed
    function isAccountDeleted() {
        const accountesHere: activeSessionsList_Type[] = [];
        const accountesNotHere: activeSessionsList_Type[] = [];
        const result: activeSessionsList_Type[] = [];


        activeSessionsList.map((ele) => {
            const isHere = state.accountes.find((mainAcc) => mainAcc.id == ele.accountId);

            if (isHere) {
                accountesHere.push(ele);
            } else {
                accountesNotHere.push({ ...ele, accountId: "removed" });
            }
        });


        if (accountesNotHere.length != 0) {
            accountesHere.map(ele => result.push(ele));
            accountesNotHere.map(ele => result.push(ele));

            setActiveSessionsList(result);
        }
    }

    function incrementTheTrainersTotalForSubscriptionMenu() {
        state.subscriptionsMenu.forEach(function (ele) {
            if (
                ele.subscriptionName == getSubscriptionName
                &&
                ele.sessionsCount == getSessionsCount
                &&
                ele.price == getPrice
            ) {
                dispatch(updatePropertyInRowInSubscriptionsMenusTable({
                    id: ele.id as any,
                    column: "trainersTotal",
                    value: ele.trainersTotal + 1
                }) as any);
            }
        })
    }



    useEffect(function () {
        isAccountDeleted();
    }, []);

    useEffect(function () {
        if (!state.trainerDetails) return;

        setSubscriptionState(state.trainerDetails.subscriptionState);
        setActiveSessionsList(JSON.parse(state.trainerDetails?.activeSessionsList as any));
    }, [state.trainerDetails]);

    useEffect(function () {
        if (!state.trainerDetails) return;

        dispatch(updatePropertyInRowInTrainersTable({
            trainerId: state.trainerDetails?.trainerId as any,
            column: "activeSessionsList",
            value: JSON.stringify(activeSessionsList),
        }) as any);
    }, [activeSessionsList]);

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
            (getFirstName != state.trainerDetails?.firstName)
            ||
            (getLastName != state.trainerDetails?.lastName)
            ||
            (getAddress != state.trainerDetails?.address)
            ||
            (
                (getPhone == 0 || String(getPhone).match(regexPhone))
                && getPhone != state.trainerDetails?.phone
            )
            ||
            (getSubscriptionName != state.trainerDetails?.subscriptionName)
            ||
            (getSessionsCount != state.trainerDetails?.sessionsCount)
            ||
            (getPrice != state.trainerDetails?.price)
            ||
            (new Date(getSubscriptionStart as any).getTime() != new Date(state.trainerDetails?.subscriptionStart as any).getTime())
            ||
            (new Date(getSubscriptionEnd as any).getTime() != new Date(state.trainerDetails?.subscriptionEnd as any).getTime())
        ) {
            setIsChangeInfo(true);
        } else {
            setIsChangeInfo(false);
        }


    }, [getFirstName, getLastName, getAddress, getPhone,
        getSubscriptionName, getSessionsCount, getPrice,
        getSubscriptionStart, getSubscriptionEnd
    ]);




    if (!state.trainerDetails) return null;

    return <Popup_Form
        titel="تفاصيل المتدرب"
        discription="تلك التفاصيل الخاصه بالمتدرب"
        isSave={isChangeInfo}
        typeBtn="save change"
        isShowBtn={subscriptionState == stateIsFinished ? false : true}
        clickOnCancel={() => dispatch(removeTrainerDetails())}
        clickOnSaveBtn={updateInfo}
    >
        {/* Title for sessions */}
        <div className="mb-1">
            <div className="flex items-center gap-2 text-(--thirdColor)">
                <Presentation strokeWidth={1.75} size={23} />
                <h3 className="font-bold mb-1">الحصص</h3>
            </div>

            <div className="opacity-60 mb-4">
                {
                    subscriptionState == stateIsActive ?
                        <p>
                            <span> تم إكمال </span>
                            <span className="font-bold me-1">
                                {totalActiveSessions}
                            </span>
                            <span>  من اصل </span>
                            <span className="font-bold">
                                {state.trainerDetails.sessionsCount}
                            </span>
                        </p>
                        :
                        subscriptionState == stateIsPending ?
                            <p>
                                الاشتراك معلق
                            </p>
                            :
                            <p>
                                تم إنتهاء الاشتراك
                            </p>
                }
            </div>
        </div>

        {/* Sessions */}
        <div
            ref={containerRef}
            className={`
                transition duration-500 mb-7
                flex gap-4 flex-wrap overflow-auto
                ${containerRef.current?.clientHeight as any > 100 ? "h-[120px]" : "h-auto"}
            `}
        >
            {Array.from({ length: state.trainerDetails.sessionsCount }).map((_, i) => {
                const getAccountId = activeSessionsList.find(ele => ele.sessions.includes(i))?.accountId;
                const getAccount = state.accountes.find(ele => ele.id == getAccountId);


                return <div className="flex flex-col gap-1 items-center" key={i}>
                    {/* Session */}
                    <div
                        onClick={() => clickOnSession(i)}
                        className={`
                            rounded-full h-12 w-12 flex items-center justify-center
                            border-2 border-neutral-300
                            ${getAccount?.type == "manager" ?
                                "bg-(--managerColor) text-white !border-0 font-bold"
                                :
                                getAccount?.type == "captain" || getAccountId == "removed" ?
                                    "bg-(--captainColor) text-white !border-0" : ""
                            }

                            ${!getAccount || getAccount?.id == state.logInInfo?.id || state.logInInfo?.type == "manager" ?
                                "cursor-pointer opacity-100" : "cursor-not-allowed opacity-40"
                            }

                            ${subscriptionState == stateIsPending ?
                                "!bg-amber-500 !text-black !font-normal !border-0 !cursor-not-allowed"
                                :
                                subscriptionState == stateIsFinished &&
                                "!bg-red-500 text-white !border-0 !cursor-not-allowed"
                            }
                        `}
                    >
                        {i + 1}
                    </div>

                    {
                        subscriptionState == stateIsActive ?
                            <h3 className="text-sm opacity-40">
                                {
                                    getAccountId == "removed" ?
                                        <span>
                                            الحساب <br />
                                            محذوف
                                        </span>
                                        :
                                        getAccount?.name.slice(0, 7)
                                }
                            </h3>
                            :
                            null
                    }
                </div>
            })}
        </div>

        {/* Title & arrowes */}
        <div className="mb-5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-(--thirdColor)">
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
        <div className="mb-16">
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
        <div className="bg-red-100/50 p-3 rounded-lg border border-red-300">
            <h3 className=" text-red-500 font-bold mb-3">
                منطقة الإجراءات
            </h3>

            <div className="flex gap-2">
                {
                    subscriptionState != stateIsFinished ?
                        <Btn_Finished_Subscription trainerId={state.trainerDetails.trainerId as any} />
                        :
                        <Btn_Subscription_Renewal
                            trainer={updateTheTrainer as any}
                            isInfoComplete={isActiveSubscriptionRenewal}
                        />
                }

                <Btn_Delete_Trainer trainerId={state.trainerDetails.trainerId as any} />
            </div>
        </div>
    </Popup_Form >
}