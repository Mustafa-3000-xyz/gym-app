import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Profits_And_Expenses_Page from "./Pages/Profits-and-expenses-page/Profits_And_Expenses_Page";
import Accountes_Page from "./Pages/Accountes-page/Accountes_Page";
import Authentication_Page from "./Pages/Authentication-page/Authentication_Page";
import { useEffect, useState } from "react";
import { accountesPagePath, attendanceRecordePagePath, expalinAppPagePath, profilePagePath, profitsAndExpensesPagePath, settingsPagePath, stateIsActive, stateIsFinished, stateIsPending, subscriptionsMenuPath, trainerPagePath } from "./Lib/constants";
import Explain_App_Page from "./Pages/Explain-app-page/Explain_App_Page";
import Profile_Page from "./Pages/Profile-page/Profile_Page";
import { logOutFromOldAccount, theTodayDate } from "./Lib/functions";
import Subscriptions_Menu_Page from "./Pages/Subscriptions-menus-page/Subscriptions_Menus_Page";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getAllRowsInTrainersTable, updatePropertyInRowInTrainersTable } from "./Rtk/Slices/Db-slices/trainersSlice";
import { store_Type } from "./Rtk/types";
import { getAllRowsInAccountsTable } from "./Rtk/Slices/Db-slices/accountsSlice";
import { getAllRowsInSubscriptionsMenusTable } from "./Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import { removeTrainerDetails } from "./Rtk/Slices/UI-slices/trainerDetailsSlice";
import { changeLogInInfo, getLogInInfo } from "./Rtk/Slices/UI-slices/logInInfoSlice";
import { accountsTable, activeSessionsTable, attendanceTable, subscriptionsMenusTable, trainerTable } from "./Lib/tables";
import { getAllRowsInAttendanceTable } from "./Rtk/Slices/Db-slices/attendanceSlice";
// ========================================================== //
function App() {
  const dispatch = useDispatch();
  const state = useSelector(function (state: store_Type) {
    return {
      logInInfo: state.logInInfo,
      trainers: state.trainers,
      sideBar: state.sideBar
    }
  }, shallowEqual);

  const navigate = useNavigate();
  const [todayDate, setTodayDate] = useState<Date>(theTodayDate({ startingIn12Houre: false }));




  async function runTables() {
    await trainerTable()
    await activeSessionsTable();
    await accountsTable();
    await attendanceTable();
    await subscriptionsMenusTable();
  }

  async function logOutWhenCloseApp() {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const appWindow = getCurrentWindow();


    await appWindow.onCloseRequested(() => {
      logOutFromOldAccount(Number(state.logInInfo?.id));
    });
  }

  function checkSubscriptionsStateForTrainers() {
    if (state.trainers?.length == 0 || state.trainers?.includes(undefined as any)) return;

    state.trainers?.forEach(function (ele) {
      const expirationDate = new Date(ele.subscriptionEnd);
      /*
        if the today date same subscription end date, so i don't want the finished,
        but i want the today date is after the subscription end date
      */
      expirationDate.setHours(23, 59, 59, 999);

      if (
        ele.subscriptionState == stateIsPending
        &&
        todayDate.getTime() >= new Date(ele.subscriptionStart as any).getTime()
      ) {
        dispatch(updatePropertyInRowInTrainersTable({
          id: ele.id as any,
          column: "subscriptionState",
          value: stateIsActive
        }) as any);
      }

      else if (
        todayDate.getTime() > expirationDate.getTime()
        &&
        (ele.subscriptionState == stateIsActive || ele.subscriptionState == stateIsPending)
      ) {
        dispatch(updatePropertyInRowInTrainersTable({
          id: ele.id as any,
          column: "subscriptionState",
          value: stateIsFinished
        }) as any);
      }
    });
  }



  useEffect(function () {
    runTables();
    navigate(expalinAppPagePath);
    dispatch(changeLogInInfo(null));

    dispatch(getLogInInfo());
    dispatch(getAllRowsInTrainersTable() as any);
    dispatch(getAllRowsInAccountsTable() as any);
    dispatch(getAllRowsInSubscriptionsMenusTable() as any);
    dispatch(getAllRowsInAttendanceTable() as any);
  }, []);

  useEffect(function () {
    logOutWhenCloseApp();
  }, [state.logInInfo]);

  // Check the subscription state for all trainers
  useEffect(() => {
    if (state.trainers?.length == 0) return;

    const tomorrow = new Date();

    tomorrow.setDate(todayDate.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - todayDate.getTime();
    const timer = setTimeout(() => {
      setTodayDate(tomorrow);
      dispatch(removeTrainerDetails());
    }, timeUntilMidnight);


    checkSubscriptionsStateForTrainers();
    return () => clearTimeout(timer);
  }, [todayDate, state.trainers]);




  return state.logInInfo ?
    <main dir="rtl" className="flex">
      {
        state.sideBar as any == "show" ?
          <SideBar />
          :
          null
      }

      <div className="mt-7 w-full px-10">
        <Routes>
          <Route path="/" element={<Navigate to="/trainers-page" replace />} />

          <Route path={trainerPagePath} element={<Trainers_Page />} />
          <Route path={attendanceRecordePagePath} element={<Attendance_Recorde_Page />} />
          <Route path={subscriptionsMenuPath} element={<Subscriptions_Menu_Page />} />

          <Route path={accountesPagePath} element={<Accountes_Page />} />
          <Route path={profilePagePath} element={<Profile_Page />} />
          <Route path={profitsAndExpensesPagePath} element={<Profits_And_Expenses_Page />} />

          <Route path={settingsPagePath} element={<Settings_Page />} />
          <Route path={expalinAppPagePath} element={<Explain_App_Page />} />
        </Routes>
      </div>
    </main>
    :
    <Authentication_Page />
}

export default App;