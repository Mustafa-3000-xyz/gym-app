import { stateIsActive, stateIsFinished, stateIsPending, styleDate } from "@/Lib/constants";
import { alert, getAllAttendanceInSpecificDate, incrementOrDecrementForTotalSessionsInAccount, theTodayDate } from "@/Lib/functions";
import { activeSessionsList_Type, attendanceDetails, sessionListForRead } from "@/Pages/types";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { updatePropertyInRowInTrainersTable, updateSomePropertiesInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { store_Type } from "@/Rtk/types";
import { Presentation } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { format, addDays } from "date-fns";
import { removeSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { removeSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
import { removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { addRowInAttendanceTable, deleteRowInAttendanceTableById, updatePropertyInRowInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
// ========================================================== //
export default function Sessions(
    { onGetActiveSessionsList }: { onGetActiveSessionsList: (x: activeSessionsList_Type[]) => void }
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            attendance: state.attendance,
            trainerDetails: state.trainerDetails,
            accountes: state.accountes,
        }
    }, shallowEqual);


    const containerRef = useRef<HTMLDivElement | null>(null);

    const [activeSessionsList, setActiveSessionsList] = useState<activeSessionsList_Type[]>([]);
    const [nextDay, setNextDay] = useState<null | string>(null);

    const [popoverInfo, setPopoverInfo] = useState({ date: null, name: "" as string | "removed" });
    const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 });
    const [showPopover, setShowPopover] = useState(false);


    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);




    function finishedSubscriptionUsingLastSession() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            titleAfterClickOnOk: `تم إنهاء الاشتراك للمتدرب رقم : ${state.trainerDetails?.id}`,
            funRunWhenClickOnOk: function () {
                incrementOrDecrementForTotalSessionsInAccount(
                    Number(state.logInInfo?.id),
                    1,
                    "increment"
                );

                dispatch(updateSomePropertiesInRowInTrainersTable({
                    id: state.trainerDetails?.id as any,
                    values: {
                        activeSessionsList: JSON.stringify([]),
                        subscriptionState: stateIsFinished,
                    } as any
                }) as any);
                dispatch(removeSubscriptionStart());
                dispatch(removeSubscriptionEnd());
                dispatch(removeAllSessions());
                dispatch(removeTrainerDetails());
            }
        });
    }

    function clickOnSession(sessionNum: number | null) {
        if (
            sessionNum == null
            ||
            (
                state.trainerDetails?.subscriptionState == stateIsPending
                ||
                state.trainerDetails?.subscriptionState == stateIsFinished
            )
        ) return;

        const findSession = activeSessionsList.find(ele => ele.sessionNumber == sessionNum);
        let copyActiveSessionsList: activeSessionsList_Type[] = [...activeSessionsList];


        // If this sessions is last, so run finishedSubscriptionUsingLastSession
        if (
            copyActiveSessionsList.length + 1 == state.trainerDetails?.sessionsCount
            &&
            !findSession
        ) {
            finishedSubscriptionUsingLastSession();
            return;
        }

        // Add session
        if (!findSession) {
            const obj = {
                accountId: state.logInInfo?.id,
                sessionNumber: sessionNum,
                activationDate: todayDate.toISOString()
            } as activeSessionsList_Type


            attendance(true);
            incrementOrDecrementForTotalSessionsInAccount(
                Number(state.logInInfo?.id),
                1,
                "increment"
            );

            copyActiveSessionsList.push(obj);
        }

        // Remove session
        else if (
            findSession
            &&
            (
                findSession.accountId == state.logInInfo?.id
                ||
                state.logInInfo?.type == "manager"
            )
        ) {
            attendance(false);
            incrementOrDecrementForTotalSessionsInAccount(
                Number(state.logInInfo?.id),
                1,
                "decrement"
            );

            copyActiveSessionsList = copyActiveSessionsList.filter(ele => ele.sessionNumber != sessionNum);
        }

        setActiveSessionsList(copyActiveSessionsList);
        dispatch(updatePropertyInRowInTrainersTable({
            id: state.trainerDetails?.id as any,
            column: "activeSessionsList",
            value: JSON.stringify(copyActiveSessionsList),
        }) as any);
    }

    async function attendance(isAttend: boolean) {
        const trainerId = state.trainerDetails?.id;

        const getAllAttendanceDetails = await getAllAttendanceInSpecificDate(todayDate) as attendanceDetails[];
        const findTrainer = getAllAttendanceDetails.find(ele => ele.trainers.includes(trainerId as any));
        const findAccount = getAllAttendanceDetails.find(ele => ele.accountId == state.logInInfo?.id);


        // Remove trainer from trainers array
        if (!isAttend) {
            const convertToArray = JSON.parse(findTrainer?.trainers as any) as number[];
            const removeTrainer = convertToArray.filter(ele => ele != trainerId);


            // After removed the trainer in array, if the trainers array is empty, remove the row
            if (removeTrainer.length == 0) {
                dispatch(deleteRowInAttendanceTableById(Number(findTrainer?.id)) as any);
            }
            else {
                dispatch(updatePropertyInRowInAttendanceTable({
                    id: Number(findTrainer?.id),
                    column: "trainers",
                    value: removeTrainer
                }) as any);
            }

            return;
        }

        /*
            If the trainer is attend and the account not exsist in today date and the trainer not exsist in today date,
            create new row
        */
        if (isAttend && !findAccount && !findTrainer) {
            await dispatch(addRowInAttendanceTable({
                date: todayDate.toISOString(),
                accountId: Number(state.logInInfo?.id),
                trainers: [Number(trainerId)]
            }) as any);
        }

        /*
            If the trainer is attend and the account is exsist in today date and the trainer not exsist in today date,
            add this trainer in trainers array
        */
        else if (isAttend && findAccount && !findTrainer) {
            dispatch(updatePropertyInRowInAttendanceTable({
                id: Number(findAccount.id),
                column: "trainers",
                value: [...JSON.parse(findAccount.trainers as any), Number(trainerId)]
            }) as any);
        }
    }

    function hoverOnSession(e: React.MouseEvent<HTMLParagraphElement>, sessionInfo: sessionListForRead) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();



        setPopoverCoords({
            top: rect.top + window.scrollY - 220,
            left: rect.left + window.scrollX - 155
        });


        setShowPopover(true);
        setPopoverInfo({
            date: sessionInfo.date,
            name: sessionInfo.account != "removed" ? sessionInfo.account.name : "removed"
        });
    }

    function outOnSession() {
        setShowPopover(false);
        setPopoverCoords({
            top: 0,
            left: 0
        });
    }




    useEffect(function () {
        if (!state.trainerDetails) return;

        setActiveSessionsList(JSON.parse(state.trainerDetails?.activeSessionsList as any));
    }, [state.trainerDetails]);

    // This for alert
    useEffect(function () {
        if (activeSessionsList.length == 0) {
            onGetActiveSessionsList([]);
            return
        };

        const lastSession = activeSessionsList[activeSessionsList.length - 1];
        const sessionDate = new Date(lastSession?.activationDate);

        if (sessionDate.getTime() != todayDate.getTime()) return;


        const nextDayDate = addDays(sessionDate, 1);
        const formating = format(nextDayDate, styleDate);

        setNextDay(formating);
        onGetActiveSessionsList(activeSessionsList);
    }, [activeSessionsList, todayDate]);


    const readSessions = useMemo(() => {
        const sessionsList: sessionListForRead[] = [];


        if (activeSessionsList.length != 0) {
            const lastSession = activeSessionsList.length - 1;


            activeSessionsList.forEach((ele, i) => {
                const getAccount = state.accountes?.find(acc => acc.id == ele?.accountId);
                const theAccount = getAccount ? getAccount : "removed";

                // If the ele is before the lastSession, so this is not active
                if (i != lastSession) {
                    const oldSession = {
                        account: theAccount,
                        session: ele.sessionNumber,
                        date: ele.activationDate,
                        isActive: false
                    }

                    sessionsList.push(oldSession as any);
                }

                /*
                    If the ele is the last session and today's date is after the activation date,
                    make the next session is active.
                */
                else if (
                    i == lastSession
                    &&
                    new Date(ele.activationDate).getTime() < todayDate.getTime()
                ) {
                    const oldSession = {
                        account: theAccount,
                        session: ele.sessionNumber,
                        date: ele.activationDate,
                        isActive: false
                    }

                    const sessionNow = {
                        account: null,
                        session: ele.sessionNumber + 1,
                        date: null,
                        isActive: true
                    }

                    sessionsList.push(oldSession as any, sessionNow as any);
                }

                /*
                    If the ele is the last session but  today's date is equal the activation date,
                    so this session will be active
                */
                else if (
                    i == lastSession
                    &&
                    new Date(ele.activationDate).getTime() == todayDate.getTime()
                ) {
                    const sessionNow = {
                        account: theAccount,
                        session: ele.sessionNumber,
                        date: ele.activationDate,
                        isActive: true
                    }

                    sessionsList.push(sessionNow as any);
                }
            });
        }


        // Add the remaining unactivated sessions to the sessionsList
        for (let i = sessionsList.length; i < (state.trainerDetails?.sessionsCount as number); i++) {
            if (activeSessionsList.length == 0) {
                const session = {
                    account: null,
                    session: i,
                    date: null,
                    isActive: i == 0 ? true : false
                }

                sessionsList.push(session as any);
            }
            else {
                const unactivatedSession = {
                    account: null,
                    session: i,
                    date: null,
                    isActive: false,
                }

                sessionsList.push(unactivatedSession as any);
            }
        }

        return sessionsList;
    }, [state.trainerDetails?.sessionsCount, state.accountes, activeSessionsList, todayDate]);





    return <div>
        {/* Alert */}
        {
            new Date(activeSessionsList[activeSessionsList.length - 1]?.activationDate).getTime() == todayDate.getTime() ?
                <div className="text-center p-3 bg-emerald-500 absolute end-50 start-50 top-0 rounded-lg text-white">
                    <p className="font-bold text-lg">
                        تم تفعيل حصة اليوم بنجاح
                    </p>

                    <p className="font-bold">
                        إنتظر يوم <span className="underline text-black">{nextDay}</span> لكي تقوم بتفعيل حصه جديده
                    </p>
                </div>
                :
                null
        }

        {/* Title for sessions */}
        <div className="mb-1">
            <div className="flex items-center gap-2 text-(--thirdColor)">
                <Presentation strokeWidth={1.75} size={23} />
                <h3 className="font-bold mb-1">الحصص</h3>
            </div>

            <div className="opacity-60 mb-4">
                {
                    state.trainerDetails?.subscriptionState == stateIsActive ?
                        <p>
                            <span> تم إكمال </span>
                            <span className="font-bold me-1">
                                {activeSessionsList.length}
                            </span>
                            <span>  من اصل </span>
                            <span className="font-bold">
                                {state.trainerDetails?.sessionsCount}
                            </span>
                        </p>
                        :
                        state.trainerDetails?.subscriptionState == stateIsPending ?
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

        {/* Session info */}
        <div
            className={`
                opacity-0 -z-50
                ${showPopover ? "opacity-100 z-50" : "opacity-0 -z-50"}
                absolute bg-gray-300 p-3 rounded-2xl rounded-bl-none text-center
            `}
            style={{
                top: `${popoverCoords.top}px`,
                left: `${popoverCoords.left}px`
            }}
        >
            <p className="font-bold whitespace-nowrap">
                {
                    popoverInfo.name != "removed" ?
                        popoverInfo.name.slice(0, 7)
                        :
                        "الحساب محذوف"
                }
            </p>

            <p>
                {format(new Date(popoverInfo.date as any), styleDate)}
            </p>
        </div>

        {/* Sessions */}
        <div
            ref={containerRef}
            className={`
                transition duration-500 my-6
                flex gap-4 flex-wrap overflow-auto
                ${containerRef.current?.clientHeight as any > 100 ? "h-30" : "h-auto"}
            `}
        >
            {
                readSessions.map((ele, i) => {
                    return <div
                        key={i}
                        className={`
                            duration-300
                            flex justify-center items-center border border-neutral-300 w-12 h-12 rounded-full
                            ${ele.isActive ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-20"}
                            ${ele.account != "removed" && ele.account?.type == "manager" ? "bg-(--managerColor) text-white border-0! font-bold" : ""}
                            ${ele.account != "removed" && ele.account?.type == "captain" || ele.account == "removed" ? "bg-(--captainColor) text-white border-0!" : ""}
                            ${ele.account != "removed" && ele.account?.type == "manager" && state.logInInfo?.type == "captain" ? "cursor-not-allowed!" : ""}

                            ${state.trainerDetails?.subscriptionState == stateIsFinished ? "bg-red-500! text-white! cursor-not-allowed! opacity-100!" : ""}
                            ${state.trainerDetails?.subscriptionState == stateIsPending ? "bg-amber-500! text-white! cursor-not-allowed! opacity-100!" : ""}
                        `}
                        onClick={() => clickOnSession(ele.isActive ? ele.session : null)}
                        onMouseEnter={ele.date ? (e) => hoverOnSession(e, ele) : () => null}
                        onMouseOut={outOnSession}
                    >
                        {i + 1}
                    </div>
                })
            }
        </div>
    </div>
}