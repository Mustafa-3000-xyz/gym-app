import { statusIsActive, statusIsFinished, statusIsPending } from "@/Lib/constants";
import { updateAnyPropertyInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, RefreshCcw, SquarePen } from "lucide-react";
import Date_Info_Form from "../Components/Date_Info_Form";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Trainer_Info_Form from "../Components/Trainer_Info_Form";
import Subscription_Info_Form from "../Components/Subscription_Info_Form";
import Btn_Cancel_Subscription from "../Components/Btn_Cancel_Subscription";
import Btn_Delete_Trainer from "../Components/Btn_Delete_Trainer";
import { customAlert, normalAlert } from "@/Lib/functions";
import { changeStatusTheShowForSideBar } from "@/Rtk/Slices/UI-slices/sideBarSlice";
import { useNavigate, useParams } from "react-router-dom";
import { reports_Type, trainer_Type } from "@/Pages/types";
import Database from "@tauri-apps/plugin-sql";
import Sessions from "../Components/Sessions";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { systemForAddYearsMonthesDaysAndItems, deleteRowsInActiveSessionsTableToLinkedTheTrainerById } from "@/Lib/functionsWithDb";
import { addRowInReportsTable } from "@/Rtk/Slices/Db-slices/reportsSlice";
import { store_Type } from "@/Rtk/types";
// ========================================================== //
export default function Trainer_Details_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);


    const [trainerDetails, setTrainerDetails] = useState<trainer_Type | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    // Trainer info
    const [getTrainerType, setGetTrainerType] = useState<"man" | "woman">("man");
    const [getFirstName, setGetFirstName] = useState({
        value: "",
        isTrue: false,
    });
    const [getLastName, setGetLastName] = useState({
        value: "",
        isTrue: false,
    });
    const [getPhone, setGetPhone] = useState({
        value: 0,
        isTrue: false,
    });
    const [getAddress, setGetAddress] = useState({
        value: "",
        isTrue: false,
    });
    const [getNotes, setGetNotes] = useState("");

    // Subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState({
        value: "",
        isTrue: false
    });
    const [getSessions, setGetSessions] = useState({
        value: 0,
        isTrue: false
    });
    const [getPrice, setGetPrice] = useState({
        value: 0,
        isTrue: false
    });
    const [getDebt, setGetDebt] = useState<number>(0);


    // Date info
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<string | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<string | null>(null);

    const navigate = useNavigate();
    const { trainerId } = useParams();

    const todayDate = useMemo(() => new Date(), []);


    const subscriptionStatus = useMemo(() => {
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



    const clickOnSaveBtn = useCallback(function () {
        let isAnyValueChange: boolean = true;


        if (
            trainerDetails?.firstName == getFirstName.value
            &&
            trainerDetails?.lastName == getLastName.value
            &&
            Number(trainerDetails?.phone) == Number(getPhone.value)
            &&
            trainerDetails?.address == getAddress.value
            &&
            trainerDetails?.trainerType == getTrainerType
            &&
            trainerDetails?.notes == getNotes
            &&
            trainerDetails?.subscriptionName == getSubscriptionName.value
            &&
            trainerDetails?.sessionsCount == getSessions.value
            &&
            trainerDetails?.price == getPrice.value
            &&
            trainerDetails?.debt == getDebt
            &&
            trainerDetails?.subscriptionStart == getSubscriptionStart
            &&
            trainerDetails?.subscriptionEnd == getSubscriptionEnd
            &&
            (
                trainerDetails?.subscriptionStatus == statusIsActive
                ||
                trainerDetails?.subscriptionStatus == statusIsPending
            )
        ) {
            normalAlert({
                title: "هممم",
                text: "لا يوجد اي تغيرات للحفظ",
                icon: "info"
            });

            isAnyValueChange = false;
        }
        else if (
            !getFirstName.isTrue
            ||
            !getLastName.isTrue
            ||
            !getPhone.isTrue
            ||
            !getAddress.isTrue
            ||
            !getSubscriptionName.isTrue
            ||
            !getSessions.isTrue
            ||
            !getPrice.isTrue
            ||
            !getSubscriptionStart || !getSubscriptionEnd
        ) {
            findTheValueNotComplete();
            return;
        }

        const obj = {
            id: Number(trainerDetails?.id),
            trainerType: getTrainerType as "man" | "woman",
            firstName: getFirstName.value,
            lastName: getLastName.value,
            address: getAddress.value,
            phone: Number(getPhone.value),
            notes: getNotes,
            subscriptionName: getSubscriptionName.value,
            sessionsCount: Number(getSessions.value),
            price: Number(getPrice.value),
            debt: Number(getDebt),
            subscriptionStart: getSubscriptionStart,
            subscriptionEnd: getSubscriptionEnd,
            subscriptionStatus: subscriptionStatus
        } as trainer_Type;


        if (
            isAnyValueChange
            &&
            (
                trainerDetails?.subscriptionStatus == statusIsActive
                ||
                trainerDetails?.subscriptionStatus == statusIsPending
            )
        ) {
            saveChangesWhenSubscriptionIsActiveOrPending(obj);
        }
        else if (trainerDetails?.subscriptionStatus == statusIsFinished) {
            saveChangesWhenSubscriptionIsFinished(obj);
        }
    }, [
        trainerDetails,
        getFirstName,
        getLastName,
        getPhone,
        getAddress,
        getTrainerType,
        getNotes,
        getSubscriptionName,
        getSessions,
        getPrice,
        getDebt,
        getSubscriptionStart,
        getSubscriptionEnd,
        subscriptionStatus,
    ]);

    const clickOnBackBtn = useCallback(function () {
        if (
            trainerDetails?.firstName != getFirstName.value
            ||
            trainerDetails?.lastName != getLastName.value
            ||
            Number(trainerDetails?.phone) != Number(getPhone.value)
            ||
            trainerDetails?.address != getAddress.value
            ||
            trainerDetails?.trainerType != getTrainerType
            ||
            trainerDetails?.notes != getNotes
            ||
            trainerDetails?.subscriptionName != getSubscriptionName.value
            ||
            trainerDetails?.sessionsCount != getSessions.value
            ||
            trainerDetails?.price != getPrice.value
            ||
            trainerDetails.debt != getDebt
            ||
            trainerDetails?.subscriptionStart != getSubscriptionStart
            ||
            trainerDetails?.subscriptionEnd != getSubscriptionEnd
        ) {
            customAlert({
                titleBeforeSubmit: "انتبه",
                textBeforeSubmitAction: "هل تود بالفعل عدم الاستكمال ؟",
                runFunctionAfterConfirm: function () {
                    dispatch(changeStatusTheShowForSideBar("show"));

                    const getPage = localStorage.getItem("thisPageWhenClickOnTrainer");
                    navigate(getPage as string);
                }
            });
        }
        else {
            dispatch(changeStatusTheShowForSideBar("show"));

            const getPage = localStorage.getItem("thisPageWhenClickOnTrainer");
            navigate(getPage as string);
        }
    }, [
        trainerDetails,
        getFirstName,
        getLastName,
        getPhone,
        getAddress,
        getTrainerType,
        getNotes,
        getSubscriptionName,
        getSessions,
        getPrice,
        getDebt,
        getSubscriptionStart,
        getSubscriptionEnd,
    ]);



    async function systemForProfitesAndExpenses(subscriptionPrice: number) {
        await systemForAddYearsMonthesDaysAndItems(
            new Date(),
            {
                year: {
                    profites: subscriptionPrice
                },
                month: {
                    profites: subscriptionPrice
                },
                day: {
                    profites: subscriptionPrice
                },
                item: {
                    category: "profit",
                    additionTime: new Date().toISOString(),
                    title: "تجديد اشتراك لمتدرب",
                    price: subscriptionPrice,
                }
            }
        );
    }

    function findTheValueNotComplete() {
        const errorsMessagesList: string[] = [];


        if (!getFirstName.isTrue) {
            errorsMessagesList.push("يجب الاسم الاول يحتوي على عدد حروف لا تقل ع ثلاثه ولا تزيد عن ثلاثة عشر");
        }

        if (!getLastName.isTrue) {
            errorsMessagesList.push("يجب الاسم الثاني يحتوي على عدد حروف لا تقل ع ثلاثه ولا تزيد عن ثلاثة عشر");
        }

        if (!getPhone.isTrue) {
            errorsMessagesList.push("يجب رقم الهاتف يكون عشر ارقام ويبدا برقم واحد");
        }

        if (!getAddress.isTrue) {
            errorsMessagesList.push("يجب العنوان لا يزيد عن ثلاثين حرف");
        }

        if (!getSubscriptionName.isTrue) {
            errorsMessagesList.push("يجب اسم الاشتراك يحتوي على عدد حروف لا تقل عن ثلاثه ولا تزيد عن احدى عشر");
        }

        if (!getSessions.isTrue) {
            errorsMessagesList.push("يجب كتابة عدد الحصص");
        }

        if (!getPrice.isTrue) {
            errorsMessagesList.push("يحب كتابه سعر الاشتراك");
        }

        if (!getSubscriptionStart) {
            errorsMessagesList.push("يجب اختيار تاريخ بداية الاشتراك");
        }

        if (!getSubscriptionEnd) {
            errorsMessagesList.push("يجب اختيار تاريخ نهاية الاشتراك");
        }

        normalAlert({
            title: "يوجد بيانات غير صالحه",
            text: errorsMessagesList.join(" / "),
            icon: "error"
        });
    }

    function saveChangesWhenSubscriptionIsActiveOrPending(trainer: trainer_Type) {
        customAlert({
            iconStyleBeforeSubmit: "warning",
            titleBeforeSubmit: "قبل حفظ التغيرات",
            textBeforeSubmitAction: "في حالة تعديل عدد الحصص, سوف يتم الاعتماديه على الحصص الجديده وتحذف الحصص القديمه بالتفعيلات الخاصه بها",
            textAfterSubmitAction: `تم تحديث المتدرب رقم : ${trainer.id}`,
            runFunctionAfterConfirm: async function () {
                if (getSessions.value != trainerDetails?.sessionsCount) {
                    deleteRowsInActiveSessionsTableToLinkedTheTrainerById(Number(trainerDetails?.id));
                }


                dispatch(changeStatusTheShowForSideBar("show"));
                dispatch(updateAnyPropertyInRowInTrainersTable({
                    id: trainer.id as number,
                    values: trainer as any
                }) as any);


                const getPage = localStorage.getItem("thisPageWhenClickOnTrainer");
                navigate(getPage as string);
            }
        });
    }

    function saveChangesWhenSubscriptionIsFinished(trainer: trainer_Type) {
        if (
            todayDate.getTime() > new Date(trainer.subscriptionStart as any).getTime()
            &&
            todayDate.getTime() > new Date(trainer.subscriptionEnd as any).getTime()
        ) {
            normalAlert({
                title: "تنويه",
                text: "في حالة تجديد الاشتراك, يجب أن تاريخ البداية والنهاية لا يجعلون حالة الاشتراك منتهيه",
                icon: "info"
            });
        }
        else {
            customAlert({
                iconStyleBeforeSubmit: "warning",
                titleBeforeSubmit: "قبل التجديد",
                textBeforeSubmitAction: "هل تريد بالفعل تجديد الاشتراك ؟",
                textAfterSubmitAction: `تم تجديد الاشتراك للمتدرب رقم : ${trainer.id}`,
                runFunctionAfterConfirm: function () {
                    const subscriptionPrice = Number(trainer?.price) - Number(trainer.debt);
                    systemForProfitesAndExpenses(subscriptionPrice);


                    dispatch(changeStatusTheShowForSideBar("show"));

                    dispatch(addRowInReportsTable({
                        additionTime: new Date().toISOString(),
                        linkWithPerson: "bemo",
                        title: "تجديد اشتراك لمتدرب",
                        description: `
                            حساب رقم ${state.logInInfo?.id} قام بتجديد اشتراك لمتدرب رقم ${trainerId}
                        `,
                        reportedBy: "بيمو"
                    } as reports_Type) as any);

                    dispatch(updateAnyPropertyInRowInTrainersTable({
                        id: trainer.id as number,
                        values: {
                            ...trainer
                        } as any
                    }) as any);


                    const getPage = localStorage.getItem("thisPageWhenClickOnTrainer");
                    navigate(getPage as string);
                }
            });
        }
    }



    useEffect(function () {
        dispatch(changeStatusTheShowForSideBar("hidden"));
    }, []);

    // This for get trainer details from db using id
    useEffect(function () {
        async function x() {
            const db = await Database.load("sqlite:gym-app.db");
            const [result] = await db.select(
                "SELECT * FROM trainers WHERE id = $1",
                [trainerId]
            ) as any;

            setTrainerDetails(result);
        }

        x();
    }, [trainerId]);

    // Get old values
    useEffect(function () {
        if (!trainerDetails) return;

        const firstName = trainerDetails.firstName ?? "";
        const lastName = trainerDetails.lastName ?? "";
        const phone = Number(trainerDetails.phone ?? 0);
        const address = trainerDetails.address ?? "";
        const notes = trainerDetails.notes ?? "";
        const trainerType = trainerDetails.trainerType;
        // ====================== //
        const subscriptionName = trainerDetails.subscriptionName ?? "";
        const sessions = Number(trainerDetails.sessionsCount ?? 0);
        const price = Number(trainerDetails.price ?? 0);
        const debt = Number(trainerDetails.debt ?? 0);
        // ====================== //
        const subscriptionStart = trainerDetails.subscriptionStart;
        const subscriptionEnd = trainerDetails.subscriptionEnd;



        setGetTrainerType(trainerType);
        setGetFirstName({
            value: firstName,
            isTrue: true,
        });

        setGetLastName({
            value: lastName,
            isTrue: true,
        });

        setGetPhone({
            value: phone,
            isTrue: true,
        });

        setGetAddress({
            value: address,
            isTrue: true,
        });
        setGetNotes(notes);
        // ====================== //
        setGetSubscriptionName({
            value: subscriptionName,
            isTrue: true,
        });

        setGetSessions({
            value: sessions,
            isTrue: true,
        });

        setGetPrice({
            value: price,
            isTrue: true,
        });
        setGetDebt(debt);
        // ====================== //
        setGetSubscriptionStart(subscriptionStart);
        setGetSubscriptionEnd(subscriptionEnd);
    }, [trainerDetails]);




    if (!trainerDetails) return null;

    return <section className="h-screen flex justify-center items-center">
        <div className="w-full h-[91vh] overflow-y-scroll shadow-2xl shadow-gray-900 p-5">
            <h3 className="text-center text-3xl font-bold">
                {trainerDetails.firstName} {trainerDetails.lastName} ({trainerDetails.id})
            </h3>

            <Sessions
                trainerId={Number(trainerId)}
                sessionsCount={trainerDetails.sessionsCount}
                subscriptionStatus={trainerDetails.subscriptionStatus}
            />

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
                </div>
            </div>

            {/* Trainer info & Subscription info & Date info */}
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
                    <SwiperSlide className="w-full!">
                        <Trainer_Info_Form
                            trainerType={getTrainerType}
                            firstName={getFirstName.value}
                            lastName={getLastName.value}
                            phone={getPhone.value}
                            address={getAddress.value}
                            notes={getNotes}
                            onGetFirstName={setGetFirstName}
                            onGetLastName={setGetLastName}
                            onGetPhone={setGetPhone}
                            onGetAddress={setGetAddress}
                            onGetTrainerType={setGetTrainerType}
                            onGetNotes={setGetNotes}
                        />
                    </SwiperSlide>
                }

                {/* Subscription info & Date info*/}
                <SwiperSlide className="pb-6 w-full!">
                    <Subscription_Info_Form
                        subscriptionName={getSubscriptionName.value}
                        price={getPrice.value}
                        sessions={getSessions.value}
                        debt={getDebt}
                        subscriptionStart={getSubscriptionStart}
                        subscriptionEnd={getSubscriptionEnd}
                        onGetSubscriptionName={setGetSubscriptionName}
                        onGetPrice={setGetPrice}
                        onGetSessions={setGetSessions}
                        onGetDebt={setGetDebt}
                    />

                    <Date_Info_Form
                        SubscriptionStart={trainerDetails.subscriptionStart}
                        SubscriptionEnd={trainerDetails.subscriptionEnd}
                        sessions={getSessions.value}
                        subscriptionStatus={trainerDetails.subscriptionStatus}
                        onGetSubscriptionStart={setGetSubscriptionStart}
                        onGetSubscriptionEnd={setGetSubscriptionEnd}
                    />
                </SwiperSlide>
            </Swiper>

            {/* Warning zone */}
            <div className="bg-red-100/50 p-3 rounded-lg border border-red-300" >
                <h3 className="text-red-500 font-bold mb-3">
                    منطقة الإجراءات
                </h3>

                <div className="flex gap-2">
                    {
                        trainerDetails.subscriptionStatus != statusIsFinished ?
                            <Btn_Cancel_Subscription
                                trainerId={Number(trainerDetails.id)}
                                subscriptionPrice={trainerDetails.price}
                                pay={trainerDetails.price - trainerDetails.debt}
                            />
                            :
                            null
                    }

                    <Btn_Delete_Trainer
                        trainerId={trainerDetails.id as any}
                        subscriptionPrice={trainerDetails.price}
                        pay={trainerDetails.price - trainerDetails.debt}
                    />
                </div>
            </div>

            {/* Save data or save changes btn and cancel btn */}
            <div className="flex items-center gap-3 mt-15">
                <Custom_Btn
                    className="border-emerald-600! bg-emerald-500! flex gap-2 items-center font-bold"
                    onClick={clickOnSaveBtn}
                >
                    {
                        trainerDetails.subscriptionStatus == statusIsFinished ?
                            <RefreshCcw size={20} />
                            :
                            null
                    }

                    {
                        trainerDetails.subscriptionStatus != statusIsFinished ?
                            "حفظ التغيرات"
                            :
                            " تجديد الاشتراك"
                    }
                </Custom_Btn>

                <Custom_Btn
                    className="font-bold"
                    onClick={clickOnBackBtn}
                >
                    <span>
                        الرجوع
                    </span>
                </Custom_Btn>
            </div>
        </div>
    </section>
}