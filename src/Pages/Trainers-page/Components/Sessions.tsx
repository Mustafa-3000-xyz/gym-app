import { statusIsActive, statusIsFinished, statusIsPending, styleDate } from "@/Lib/constants";
import { Sessions_Props } from "@/Pages/typesProps";
import { Presentation } from "lucide-react";
import React, { useEffect, useState } from "react";
import { sessionInActiveSeeionsTable, sessionListForRead_Type } from "@/Pages/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Database from "@tauri-apps/plugin-sql";
import { updateAnyPropertyInRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import { customAlert, incrementOrDecrementForTotalSessionsInAccount } from "@/Lib/functions";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { addRowInActiveSessionsTable, deleteRowInActiveSessionsTableById, deleteRowsInActiveSessionsTableToLinkedTheTrainerById, systemForAttendance } from "@/Lib/functionsWithDb";
import { changeStatusTheShowForSideBar } from "@/Rtk/Slices/UI-slices/sideBarSlice";
// ========================================================== //
export default function Sessions(
  { trainerId, sessionsCount, subscriptionStatus }: Sessions_Props
) {
  const dispatch = useDispatch();
  const { isActiveMoreSessionInDay, accountId } = useSelector(function (state: store_Type) {
    return {
      accountId: Number(state.logInInfo?.id),
      isActiveMoreSessionInDay: JSON.parse(state.settings.isActiveMoreSessionInDay as any)
    }
  }, shallowEqual);


  const [activeSessionsTotal, setActiveSessionsTotal] = useState(0);
  const [activeSessionsList, setActiveSessionsList] = useState<sessionInActiveSeeionsTable[]>([]);
  const [readSessions, setReadSessions] = useState<sessionListForRead_Type[]>([]);

  // These for session info
  const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0 });
  const [showPopover, setShowPopover] = useState(false);
  const [popoverInfo, setPopoverInfo] = useState({
    name: "",
    date: "",
  });


  const navigate = useNavigate();



  async function getAccountName(accountId: number) {
    const db = await Database.load("sqlite:gym-app.db");

    try {
      const [{ name }] = await db.select(
        "SELECT * FROM accounts WHERE id = $1",
        [accountId]
      ) as any;

      return name;
    }
    catch (err) {
      return "removed";
    }
  }

  async function getActiveSessions() {
    const db = await Database.load("sqlite:gym-app.db");
    const result = await db.select(
      "SELECT * FROM activeSessions WHERE linkWithTrainer = $1",
      [trainerId]
    ) as any;

    setActiveSessionsList(result);
    setActiveSessionsTotal(result.length);
  }

  async function systemForReadSessions() {
    let accountId;
    let accountName = "";
    const arr: sessionListForRead_Type[] = [];


    if (isActiveMoreSessionInDay) {
      // This for loop for get active sessions in first
      for (let i = 0; i < activeSessionsList?.length; i++) {
        // This logic for don't repat run the getAccountName
        if (accountId != activeSessionsList[i].accountId) {
          accountId = activeSessionsList[i].accountId;

          const getName = await getAccountName(Number(accountId)) as any;
          accountName = getName;
        }

        arr.push({
          id: Number(activeSessionsList[i].id),
          sessionNum: activeSessionsList[i].sessionNumber,
          date: activeSessionsList[i].activationDate,
          accountId: accountId,
          accountName: accountName
        });
      }

      // This for loop for get not active sessions
      for (let i = 0; i < sessionsCount; i++) {
        const isSessionActive = arr.find(ele => ele.sessionNum == i);

        if (!isSessionActive) {
          arr.push({
            sessionNum: i,
            accountName: null,
            date: null
          });
        }
      }
    }
    else {
      let isSessionUsed = false;


      // This for loop for get active sessions in first
      for (let i = 0; i < activeSessionsList?.length; i++) {
        // This logic for don't repat run the getAccountName
        if (accountId != activeSessionsList[i].accountId) {
          accountId = activeSessionsList[i].accountId;

          const getName = await getAccountName(Number(accountId)) as any;
          accountName = getName;
        }

        isSessionUsed = format(new Date(), styleDate) == format(new Date(activeSessionsList[i].activationDate), styleDate);

        arr.push({
          id: Number(activeSessionsList[i].id),
          sessionNum: activeSessionsList[i].sessionNumber,
          date: activeSessionsList[i].activationDate,
          accountId: accountId,
          accountName: accountName,
          isUsingThisSession: isSessionUsed
        });

      }

      // This for loop for get not active sessions
      for (let i = 0; i < sessionsCount; i++) {
        const isSessionActive = arr.find(ele => ele.sessionNum == i);

        if (!isSessionActive) {
          arr.push({
            sessionNum: i,
            accountName: null,
            date: null,
            isUsingThisSession: isSessionUsed ? false : true
          });

          isSessionUsed = true;
        }
      }
    }


    arr.sort(function (a, b) {
      return a.sessionNum - b.sessionNum
    });


    setReadSessions(arr);
  }

  async function clickOnSession(
    accountIdInActiveSession: number,
    sessionId: number,
    sessionNum: number,
    sessionDate: string,
    clickOnSession: boolean
  ) {
    if (
      subscriptionStatus == statusIsPending
      ||
      subscriptionStatus == statusIsFinished
      ||
      (
        /*
          This for when active the active one session in day setting
          and click on session not have primission click on it.
        */
        !isActiveMoreSessionInDay && !clickOnSession
      )
    ) return;

    const formatDate = format(new Date(), styleDate).replace(/[-]/g, "/");


    // sessionId using for check the session is last session.
    if (isNaN(sessionId) && activeSessionsList.length + 1 == sessionsCount) {
      customAlert({
        textBeforeSubmitAction: "هل تريد بالفعل إنهاء اشتراك ذلك المتدرب ؟؟",
        textAfterSubmitAction: `تم إنهاء الاشتراك للمتدرب رقم : ${trainerId}`,
        runFunctionAfterConfirm: async function () {
          await deleteRowsInActiveSessionsTableToLinkedTheTrainerById(trainerId);

          // I using format for get the date without the time
          systemForAttendance(
            Number(trainerId),
            accountId,
            formatDate,
            null
          )
          incrementOrDecrementForTotalSessionsInAccount(
            accountId,
            1,
            "increment"
          );



          dispatch(updateAnyPropertyInRowInTrainersTable({
            id: Number(trainerId),
            values:{
              subscriptionStatus: statusIsFinished
            }
          }) as any);

          dispatch(changeStatusTheShowForSideBar("show"));

          const getPage = localStorage.getItem("thisPageWhenClickOnTrainer");
          navigate(getPage as string);
        }
      });

      return;
    }

    // Doese session is active ?
    const getSession = activeSessionsList.find(ele => ele.sessionNumber == sessionNum);


    // Add session
    if (!getSession) {
      await addRowInActiveSessionsTable({
        linkWithTrainer: Number(trainerId),
        accountId: Number(accountId),
        sessionNumber: sessionNum,
        activationDate: new Date().toISOString()
      })


      incrementOrDecrementForTotalSessionsInAccount(
        Number(accountId),
        1,
        "increment"
      );



      getActiveSessions();
      systemForAttendance(
        Number(trainerId),
        accountId,
        formatDate,
        null
      )
    }

    // Remove session
    else if (getSession.accountId == accountId) {
      // This for how many sessions active in date follow to sessionDate.
      const sessionsActiveNow = activeSessionsList.filter(ele => format(new Date(ele.activationDate), styleDate) == format(new Date(sessionDate), styleDate)).length - 1;


      await deleteRowInActiveSessionsTableById(Number(sessionId));
      incrementOrDecrementForTotalSessionsInAccount(
        accountIdInActiveSession,
        1,
        "decrement"
      );


      getActiveSessions();
      systemForAttendance(
        Number(trainerId),
        accountId,
        null,
        sessionsActiveNow == 0 ? format(new Date(sessionDate), styleDate) : null
      )
    }
  }

  function hoverOnSession(e: React.MouseEvent<HTMLParagraphElement>, { date, accountName }: any) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    setPopoverCoords({
      top: rect.top - 90,
      left: rect.left - 36
    });

    setShowPopover(true);
    setPopoverInfo({
      name: accountName != "removed" ? accountName.slice(0, 7) : "الحساب محذوف",
      date: date
    });
  }

  function outOnSession() {
    setShowPopover(false);
    setPopoverCoords({
      top: 0,
      left: 0
    });
  }



  // This for get active sessions when get trainer id
  useEffect(function () {
    getActiveSessions();
  }, [trainerId]);

  useEffect(function () {
    systemForReadSessions();
  }, [activeSessionsList, sessionsCount]);





  return <div className="mb-7">
    {/* Title */}
    <div className="flex flex-col items-start gap-2 text-(--thirdColor) mb-3">
      <div className="flex items-center gap-2">
        <Presentation
          strokeWidth={1.75}
          size={23}
        />
        <h3 className="font-bold">الحصص</h3>
      </div>

      <div className="opacity-60">
        {
          subscriptionStatus == statusIsActive ?
            <p>
              <span> تم إكمال </span>

              <span className="font-bold me-1">
                {activeSessionsTotal}
              </span>

              <span>  من اصل </span>

              <span className="font-bold">
                {sessionsCount}
              </span>
            </p>
            :
            <p>
              {
                subscriptionStatus == statusIsPending ? "الاشتراك معلق" : "تم إنهاء الاشتراك"
              }
            </p>
        }
      </div>
    </div>

    {/* Session info */}
    {
      subscriptionStatus == statusIsActive &&
      <div
        style={{
          top: `${popoverCoords.top}px`,
          left: `${popoverCoords.left}px`,
        }}
        className={`
          absolute p-3 rounded-lg text-center
          bg-emerald-500 text-white font-bold w-32
          ${showPopover ? "opacity-100 z-50" : "opacity-0 -z-50"}
        `}
      >
        {/* Session info */}
        <div>
          <p className="whitespace-nowrap">
            {popoverInfo.name}
          </p>

          <p>
            {
              popoverInfo.date && format(popoverInfo.date, styleDate)
            }
          </p>
        </div>

        {/* Triangle */}
        <div
          className={`
            absolute -bottom-2 left-1/2 -translate-x-1/2  w-0 h-0 
            border-x-8 border-x-transparent border-t-8 border-t-emerald-500
          `}
        ></div>
      </div>
    }

    {/*  All Sessions  */}
    <div className="flex gap-3 flex-wrap overflow-auto h-20">
      {
        readSessions.map(function (ele, i) {
          return <div
            key={i}
            className={`
                  flex justify-center items-center
                  border-2 border-neutral-300 rounded-full
                  duration-300 w-12 h-12 text-black cursor-pointer hover:scale-90

                  ${!isActiveMoreSessionInDay && !ele.isUsingThisSession ? "opacity-45 cursor-not-allowed! hover:scale-100!" : ""} // this for active one session in day

                  ${ele.id ? "bg-emerald-500 text-white font-bold" : ""}
                  ${ele.id && accountId != ele.accountId ? "cursor-not-allowed! hover:scale-100!" : ""}
                  ${subscriptionStatus == statusIsFinished ? "bg-red-500! text-white! cursor-not-allowed! opacity-100! hover:scale-100!" : ""}
                  ${subscriptionStatus == statusIsPending ? "bg-amber-500! text-white! cursor-not-allowed! opacity-100! hover:scale-100!" : ""}
              `}
            onMouseEnter={
              ele.id ?
                (e) => hoverOnSession(e, { date: ele.date, accountName: ele.accountName })
                :
                () => null
            }
            onMouseLeave={outOnSession}
            onClick={() => clickOnSession(
              Number(ele.accountId),
              Number(ele.id),
              ele.sessionNum,
              ele.date as any,
              ele.isUsingThisSession as boolean
            )}
          >
            {i + 1}
          </div>
        })
      }
    </div>
  </div>
}