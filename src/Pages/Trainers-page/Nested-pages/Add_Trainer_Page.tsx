import { Presentation, UserRound } from "lucide-react";
import Trainer_Info_Form from "../Components/Trainer_Info_Form";
import { useCallback, useEffect, useMemo, useState } from "react";
import Subscription_Info_Form from "../Components/Subscription_Info_Form";
import Date_Info_Form from "../Components/Date_Info_Form";
import { customAlert, incrementOrDecrementForTotalSessionsInAccount, normalAlert } from "@/Lib/functions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { attendanceDetails_Type, trainer_Type } from "../../types";
import { addRowInAttendanceTable, updatePropertyInRowInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
import { addDays, format } from "date-fns";
import { updateAnyPropertyInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { addRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { useNavigate } from "react-router-dom";
import { changeStatusTheShowForSideBar } from "@/Rtk/Slices/UI-slices/sideBarSlice";
import { statusIsActive, statusIsFinished, statusIsPending, styleDate, trainerPagePath } from "@/Lib/constants";
import { addRowInActiveSessionsTable, systemForAddYearsMonthesDaysAndItems, getAllAttendanceInSpecificDate } from "@/Lib/functionsWithDb";
import { addRowInReportsTable } from "@/Rtk/Slices/Db-slices/reportsSlice";
// ========================================================== //
export default function Add_Trainer_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            accounts: state.accounts
        }
    }, shallowEqual);


    // Get trainer_Type info
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
        isTrue: true,
    });
    const [getAddress, setGetAddress] = useState({
        value: "",
        isTrue: true,
    });
    const [getNotes, setGetNotes] = useState("");



    // Get subscription info
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
    const [getActiveSomeSessions, setGetActiveSomeSessions] = useState<number>(0);


    // Date info
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<string | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<string | null>(null);

    const navigate = useNavigate();


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
        else {
            return statusIsFinished;
        }
    }, [getSubscriptionStart, getSubscriptionEnd, todayDate]);



    const handleSaveTrainerInfo = useCallback(async function () {
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

        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات غير صالحه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });
        }
        else {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل إضافة ذلك المتدرب ؟",
                textAfterSubmitAction: "تمت إضافة المتدرب بنجاح",
                runFunctionAfterConfirm: async function () {
                    dispatch(updateAnyPropertyInRowInAccountsTable({
                        id: Number(state.logInInfo?.id),
                        values: {
                            trainersTotal: Number(state.accounts?.find(ele => ele.id == state.logInInfo?.id)?.trainersTotal) + 1
                        }
                    }) as any);

                    const getTrainerId = await dispatch(
                        addRowInTrainersTable({
                            trainerType: getTrainerType,
                            firstName: getFirstName.value,
                            lastName: getLastName.value,
                            phone: Number(getPhone.value),
                            address: getAddress.value,
                            notes: getNotes,
                            subscriptionName: getSubscriptionName.value,
                            sessionsCount: getSessions.value,
                            price: Number(getPrice.value),
                            subscriptionStart: getSubscriptionStart,
                            subscriptionEnd: getSubscriptionEnd,
                            subscriptionStatus: statusTheSubscription,
                            debt: getDebt
                        } as trainer_Type) as any
                    ).unwrap() as trainer_Type;

                    dispatch(addRowInReportsTable({
                        linkWithPerson: "bemo",
                        additionTime: new Date().toISOString(),
                        title: "إضافة متدرب جديد",
                        description: `لقد قام الحساب رقم ${state.logInInfo?.id} بإضافة متدرب جديد الذي يحمل رقم ${getTrainerId.id}`,
                        reportedBy: "بيمو"
                    }) as any);

                    await systemForAddYearsMonthesDaysAndItems(
                        new Date(),
                        {
                            year: { profites: getPrice.value - getDebt },
                            month: { profites: getPrice.value - getDebt },
                            day: { profites: getPrice.value - getDebt },
                            item: {
                                additionTime: new Date().toISOString(),
                                category: "profit",
                                title: "إضافة متدرب جديد",
                                price: getPrice.value - getDebt
                            }
                        }
                    );

                    if (getActiveSomeSessions && getTrainerId.id) {
                        await activeSomeSessions(Number(getTrainerId.id));
                    }

                    navigate(trainerPagePath);
                    dispatch(changeStatusTheShowForSideBar("show"));
                }
            });
        }
    }, [
        getFirstName,
        getLastName,
        getPhone,
        getAddress,
        getSubscriptionName,
        getSessions,
        getPrice,
        getSubscriptionStart,
        getSubscriptionEnd,
        getTrainerType,
        getNotes,
        getDebt,
        statusTheSubscription,
        getActiveSomeSessions,
        state.logInInfo?.id,
        state.accounts,
    ]);

    const handleCanceleChanges = useCallback(function () {
        if (
            getFirstName.value ||
            getLastName.value ||
            getPhone.value ||
            getAddress.value ||
            getSubscriptionName.value ||
            getSessions.value ||
            getPrice.value ||
            getSubscriptionStart != null ||
            getSubscriptionEnd != null
        ) {
            customAlert({
                textBeforeSubmitAction: "هل تود بالفعل عدم استكمال كتابة البيانات ؟",
                runFunctionAfterConfirm: function () {
                    navigate(trainerPagePath);
                    dispatch(changeStatusTheShowForSideBar("show"));
                }
            });
        }
        else {
            navigate(trainerPagePath);
            dispatch(changeStatusTheShowForSideBar("show"));
        }
    }, [
        getFirstName.value,
        getLastName.value,
        getPhone.value,
        getAddress.value,
        getSubscriptionName.value,
        getSessions.value,
        getPrice.value,
        getSubscriptionStart,
        getSubscriptionEnd,
    ]);




    async function activeSomeSessions(trainerId: number) {
        let dateNow: any = new Date(getSubscriptionStart as any).toISOString();


        for (let i = 0; i < getActiveSomeSessions; i++) {
            const getAllAttendanceDetails = await getAllAttendanceInSpecificDate(format(dateNow, styleDate)) as attendanceDetails_Type[];
            const findAccount = getAllAttendanceDetails.find(ele => ele.accountId == state.logInInfo?.id);


            if (!findAccount) {
                const getAccountId = await dispatch(addRowInAttendanceTable({
                    date: format(dateNow, styleDate),
                    accountId: Number(state.logInInfo?.id),
                    trainers: [Number(trainerId)]
                }) as any).unwrap() as attendanceDetails_Type;

                await addRowInActiveSessionsTable({
                    linkWithTrainer: trainerId,
                    accountId: Number(getAccountId.accountId),
                    sessionNumber: i,
                    activationDate: dateNow
                })
            }
            else {
                dispatch(updatePropertyInRowInAttendanceTable({
                    id: Number(findAccount.id),
                    column: "trainers",
                    value: [...JSON.parse(findAccount.trainers as any), Number(trainerId)]
                }) as any);

                await addRowInActiveSessionsTable({
                    linkWithTrainer: trainerId,
                    accountId: Number(findAccount.accountId),
                    sessionNumber: i,
                    activationDate: dateNow
                });
            }


            dateNow = new Date(addDays(dateNow, 1)).toISOString();
        }


        incrementOrDecrementForTotalSessionsInAccount(Number(state.logInInfo?.id), getActiveSomeSessions, "increment");
    }



    useEffect(function () {
        dispatch(changeStatusTheShowForSideBar("hidden"));
    }, []);




    return <section className="h-screen flex justify-center items-center">
        <div className="w-full h-[90vh] overflow-y-scroll shadow-2xl shadow-gray-900 p-5">
            {/* Title */}
            <h1 className="font-bold text-3xl text-center select-none">
                إضافة متدرب جديد
            </h1>

            {/* Trainer info */}
            <div>
                <div className="flex items-center gap-2 text-(--thirdColor) font-bold mb-2">
                    <UserRound size={23} />
                    <p className="leading-none pt-0.5">المعلومات الشخصيه</p>
                </div>

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
            </div>

            {/* Subscription info and date info */}
            <div>
                <div className="flex items-center gap-2 text-(--thirdColor) font-bold mb-5">
                    <Presentation size={23} />
                    <p className="leading-none pt-0.5">معلومات الاشتراك</p>
                </div>

                <Subscription_Info_Form
                    subscriptionName={getSubscriptionName.value}
                    price={getPrice.value}
                    sessions={getSessions.value}
                    debt={getDebt}
                    activeSomeSessions={getActiveSomeSessions}
                    subscriptionStart={getSubscriptionStart}
                    subscriptionEnd={getSubscriptionEnd}
                    onGetSubscriptionName={setGetSubscriptionName}
                    onGetPrice={setGetPrice}
                    onGetSessions={setGetSessions}
                    onGetActiveSomeSessions={setGetActiveSomeSessions}
                    onGetDebt={setGetDebt}
                />

                <Date_Info_Form
                    sessions={getSessions.value}
                    onGetSubscriptionStart={setGetSubscriptionStart}
                    onGetSubscriptionEnd={setGetSubscriptionEnd}
                />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center gap-3">
                <button
                    className={`
                        transition-all px-6 py-2 rounded-lg cursor-pointer
                        border-emerald-600 bg-emerald-500 text-white
                        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
                        border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    `}
                    onClick={handleSaveTrainerInfo}
                >
                    حفظ البيانات
                </button>


                <button
                    className={`
                        border-red-600 bg-red-500 text-white
                        cursor-pointer transition-all px-6 py-2 rounded-lg
                        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
                        border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    `}
                    onClick={handleCanceleChanges}
                >
                    الرجوع
                </button>
            </div>
        </div>
    </section>
}