import { statusIsActive, statusIsFinished, statusIsPending, styleDate } from "@/Lib/constants";
import { alert, incrementOrDecrementForTotalSessionsInAccount, theTodayDate } from "@/Lib/functions";
import { deleteRowsInActiveSessionsLinkedToTrainer, getAllAttendanceInSpecificDate } from "@/Lib/functionsWithDb";
import { activeSession_Type, attendanceDetails_Type, readSessions_Type } from "@/Pages/types";
import { addRowInAttendanceTable, deleteRowInAttendanceTableById, updatePropertyInRowInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
import { updatePropertyInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { removeSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
import { removeSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { store_Type } from "@/Rtk/types";
import Database from "@tauri-apps/plugin-sql";
import { format } from "date-fns";
import { Presentation } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// ========================================================== //
export default function Sessions() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            attendance: state.attendance,
            trainerDetails: state.trainerDetails,
            accountes: state.accountes,
        }
    }, shallowEqual);

    const [readSessions, setReadSessions] = useState<readSessions_Type[]>([]);
    const [activeSessionsCount, setActiveSessionsCount] = useState(0);

    const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 });
    const [showPopover, setShowPopover] = useState(false);
    const [popoverInfo, setPopoverInfo] = useState({
        name: "",
        accountType: "" as "manager" | "captain" | "removed",
        date: "",
    });

    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);





    async function getActiveSessionsForTrainer(trainerId: number) {
        const database = await Database.load("sqlite:app-gym-db.db");
        const query = "SELECT * FROM activeSessions WHERE linkWithTrainer = ?";
        const value = [trainerId];

        return await database.select(query, value);
    }

    async function handleSessionsForRead() {
        const activeSessions = await getActiveSessionsForTrainer(Number(state.trainerDetails?.id)) as activeSession_Type[];
        let isSessionUsed = false;
        const arr = [];


        // Handle active sessions
        for (let i = 0; i < activeSessions.length; i++) {
            const sessionObj = {
                id: activeSessions[i].id,
                sessionNumber: i,
                account: state.accountes?.find(ele => ele.id == activeSessions[i].accountId) ?? "removed",
                activationDate: activeSessions[i].activationDate,
                usingThisSession: todayDate.getTime() == new Date(activeSessions[i].activationDate).getTime()
            }

            isSessionUsed = todayDate.getTime() == new Date(activeSessions[i].activationDate).getTime();
            arr.push(sessionObj);
        }

        // Handle for not active sessions
        for (let i = activeSessions.length; i < Number(state.trainerDetails?.sessionsCount); i++) {
            const sessionObj = {
                id: null,
                sessionNumber: i,
                account: null,
                activationDate: null,
                usingThisSession: isSessionUsed ? false : true
            }

            isSessionUsed = true;
            arr.push(sessionObj);
        }

        setActiveSessionsCount(activeSessions.length);
        setReadSessions(arr as readSessions_Type[]);
    }

    async function clickOnSession(sessionNum: number) {
        if (
            state.trainerDetails?.subscriptionStatus == statusIsPending
            ||
            state.trainerDetails?.subscriptionStatus == statusIsFinished
        ) return;


        if (readSessions[readSessions.length - 1].usingThisSession == true) {
            finishedSubscriptionUsingLastSession();
            return;
        }


        const database = await Database.load("sqlite:app-gym-db.db");
        const getSession = readSessions.find(ele => ele.sessionNumber == sessionNum);


        // Add session if the session is not active
        if (getSession?.account == null) {
            const query = `
                INSERT INTO activeSessions (
                    linkWithTrainer, accountId, sessionNumber, activationDate
                ) VALUES(?, ?, ?, ?)
            `;

            const values = [
                state.trainerDetails?.id,
                state.logInInfo?.id,
                sessionNum,
                todayDate.toISOString()
            ]

            await database.execute(query, values);
            attendance(true);
            handleSessionsForRead();
            incrementOrDecrementForTotalSessionsInAccount(
                Number(state.logInInfo?.id),
                1,
                "increment"
            );
        }

        // Remove session
        else if (
            (getSession?.account != "removed" && getSession?.account.id == state.logInInfo?.id)
            ||
            (getSession?.account == "removed" && state.logInInfo?.type == "manager")
        ) {
            const query = "DELETE FROM activeSessions WHERE id = ?";
            const value = [getSession.id];

            await database.execute(query, value);
            attendance(false);
            handleSessionsForRead();
            incrementOrDecrementForTotalSessionsInAccount(
                Number(state.logInInfo?.id),
                1,
                "decrement"
            );
        }
    }

    async function attendance(isAttend: boolean) {
        const trainerId = state.trainerDetails?.id;

        const getAllAttendanceDetails = await getAllAttendanceInSpecificDate(todayDate) as attendanceDetails_Type[];
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

    function finishedSubscriptionUsingLastSession() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
            titleAfterClickOnOk: `تم إنهاء الاشتراك للمتدرب رقم : ${state.trainerDetails?.id}`,
            funRunWhenClickOnOk: async function () {
                attendance(true);
                incrementOrDecrementForTotalSessionsInAccount(
                    Number(state.logInInfo?.id),
                    1,
                    "increment"
                );

                dispatch(updatePropertyInRowInTrainersTable({
                    id: Number(state.trainerDetails?.id),
                    column: "subscriptionStatus",
                    value: statusIsFinished
                }) as any);


                deleteRowsInActiveSessionsLinkedToTrainer(Number(state.trainerDetails?.id));
                dispatch(removeSubscriptionStart());
                dispatch(removeSubscriptionEnd());
                dispatch(removeAllSessions());
                dispatch(removeTrainerDetails());
            }
        });
    }

    function hoverOnSession(e: React.MouseEvent<HTMLParagraphElement>, sessionInfo: readSessions_Type) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();

        setPopoverCoords({
            top: rect.top - 78,
            left: rect.left + 28
        });

        setShowPopover(true);
        setPopoverInfo({
            name: sessionInfo.account != "removed" ? sessionInfo.account?.name.slice(0, 7) : "الحساب محذوف" as any,
            accountType: sessionInfo.account != "removed" ? sessionInfo.account?.type : "removed" as any,
            date: sessionInfo.activationDate as any
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
        handleSessionsForRead();
    }, [state.trainerDetails]);




    return <div className="mb-5">
        <div className="flex items-center gap-2 text-(--thirdColor)">
            <Presentation
                strokeWidth={1.75}
                size={23}
            />
            <h3 className="font-bold mb-1">الحصص</h3>
        </div>

        <div className="opacity-60 mb-7">
            {
                state.trainerDetails?.subscriptionStatus == statusIsActive ?
                    <p>
                        <span> تم إكمال </span>
                        <span className="font-bold me-1">
                            {activeSessionsCount}
                        </span>
                        <span>  من اصل </span>
                        <span className="font-bold">
                            {state.trainerDetails?.sessionsCount}
                        </span>
                    </p>
                    :
                    state.trainerDetails?.subscriptionStatus == statusIsPending ?
                        <p>
                            الاشتراك معلق
                        </p>
                        :
                        <p>
                            تم إنتهاء الاشتراك
                        </p>
            }
        </div>

        {/* Session info */}
        {
            state.trainerDetails?.subscriptionStatus == statusIsActive ?
                <div
                    className={`
                        opacity-0 -z-50
                        absolute p-3 rounded-2xl rounded-bl-none text-center
                        ${showPopover ? "opacity-100 z-50" : "opacity-0 -z-50"}
                        ${popoverInfo.accountType == "manager" ? "bg-(--managerColor) text-white font-bold" : ""}
                        ${popoverInfo.accountType == "captain" || popoverInfo.accountType == "removed" ? "bg-(--captainColor) text-white" : ""}
                    `}
                    style={{
                        top: `${popoverCoords.top}px`,
                        left: `${popoverCoords.left}px`
                    }}
                >
                    <p className="whitespace-nowrap">
                        {popoverInfo.name}
                    </p>

                    {
                        popoverInfo.date ?
                            <p>
                                {format(new Date(popoverInfo.date as string), styleDate)}
                            </p>
                            :
                            null
                    }
                </div>
                :
                null
        }


        {/* Sessions */}
        <div className="flex gap-3 flex-wrap overflow-auto h-20">
            {
                readSessions.map(function (ele, i) {
                    return <div
                        key={i}
                        className={`
                            duration-300
                            flex justify-center items-center border border-neutral-300 w-12 h-12 rounded-full
                            ${!ele.usingThisSession ? "opacity-40" : ""}
                            ${(ele.account == null && ele.usingThisSession)
                                ||
                                (ele.account != "removed" && ele.account?.id == state.logInInfo?.id && ele.usingThisSession)
                                ||
                                (ele?.account == "removed" && state.logInInfo?.type == "manager" && ele.usingThisSession)
                                ? "cursor-pointer" : "cursor-not-allowed"
                            }
                            ${ele.account != "removed" && ele.account?.type == "manager" ? "bg-(--managerColor) text-white border-0! font-bold" : ""}
                            ${(ele.account != "removed" && ele.account?.type == "captain") || ele.account == "removed" ? "bg-(--captainColor) text-white border-0! font-bold" : ""}

                            ${state.trainerDetails?.subscriptionStatus == statusIsFinished ? "bg-red-500! text-white! cursor-not-allowed! opacity-100!" : ""}
                            ${state.trainerDetails?.subscriptionStatus == statusIsPending ? "bg-amber-500! text-white! cursor-not-allowed! opacity-100!" : ""}
                        `}

                        onClick={() => {
                            if (ele.usingThisSession) {
                                clickOnSession(ele.sessionNumber);
                            }
                        }}

                        onMouseMove={ele.activationDate ? (e) => hoverOnSession(e, ele) : () => null}
                        onMouseLeave={outOnSession}
                    >
                        {ele.sessionNumber + 1}
                    </div>
                })
            }
        </div>
    </div>
}