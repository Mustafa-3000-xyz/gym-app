import { Navigate, Route, Routes } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Profits_And_Expenses_Page from "./Pages/Profits-and-expenses-page/Profits_And_Expenses_Page";
import Accountes_Page from "./Pages/Accountes-page/Accountes_Page";
import Authentication_Page from "./Pages/Authentication-page/Authentication_Page";
import { useAtomValue, useSetAtom } from "jotai";
import isLogin_Atom from "./Atoms/Is/isLogin_Atom";
import { useEffect, useState } from "react";
import { accountesPagePath, attendanceRecordePagePath, expalinAppPagePath, profilePagePath, profitsAndExpensesPagePath, settingsPagePath, stateIsActive, stateIsFinished, stateIsPending, subscriptionsMenuPath, trainerPagePath } from "./Lib/constants";
import Explain_App_Page from "./Pages/Explain-app-page/Explain_App_Page";
import Profile_Page from "./Pages/Profile-page/Profile_Page";
import { logOutFromOldAccount, theTodayDate } from "./Lib/functions";
import Subscriptions_Menu_Page from "./Pages/Subscriptions-menu-page/Subscriptions_Menu_Page";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrainers, updatePropertyInTrainer } from "./Rtk/Slices/trainersSlice";
import { store_Type } from "./Rtk/types";
import trainerDetails_Atom from "./Atoms/Details/trainerDetails_Atom";
import { getAllAccounts } from "./Rtk/Slices/accountsSlice";
import { getAllSubscriptionsMenu } from "./Rtk/Slices/subscriptionsMenuSlice";
// ========================================================== //
function App() {
  const dispatch = useDispatch();
  const state = useSelector(state => state as store_Type);

  const isLoginAtom = useAtomValue(isLogin_Atom);
  const setTrainerDetailsAtom = useSetAtom(trainerDetails_Atom);


  const [todayDate, setTodayDate] = useState<Date>(theTodayDate({ startingIn12Houre: false }));



  async function logOutWhenCloseApp() {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const appWindow = getCurrentWindow();

    await appWindow.listen('tauri://close-requested', async () => {
      logOutFromOldAccount(isLoginAtom.id);

      localStorage.setItem("theAccount", JSON.stringify(null));

      // I using setTimeout because i want the logOutFromOldAccount function work
      setTimeout(async function () {
        await appWindow.destroy();
      }, 500);
    });
  }

  // Implement the case number 3 for finished subscription
  function checkSubscriptionsStateForTrainers() {
    if (state.trainers.length == 0 || state.trainers.includes(undefined as any)) return;


    state.trainers.forEach(function (ele) {
      const expirationDate = new Date(ele.subscriptionEnd);
      /*
        if the today date same subscription end date, so i don't want the finished,
        but i want the today date is after the subscription end date
      */
      expirationDate.setHours(23, 59, 59, 999);


      if (
        todayDate.getTime() > expirationDate.getTime()
        &&
        (ele.subscriptionState == stateIsActive || ele.subscriptionState == stateIsPending)
      ) {
        dispatch(updatePropertyInTrainer({
          trainerId: ele.trainerId as any,
          column: "subscriptionState",
          value: stateIsFinished
        }) as any);
      }
      else if (
        ele.subscriptionState == stateIsPending
        &&
        todayDate.getTime() >= new Date(ele.subscriptionStart as any).getTime()
      ) {
        dispatch(updatePropertyInTrainer({
          trainerId: ele.trainerId as any,
          column: "subscriptionState",
          value: stateIsActive
        }) as any);
      }
    });
  }




  useEffect(function () {
    dispatch(getAllTrainers() as any);
    dispatch(getAllAccounts() as any);
    dispatch(getAllSubscriptionsMenu() as any);
  }, []);

  useEffect(function () {
    logOutWhenCloseApp();
    localStorage.setItem("theAccount", JSON.stringify(isLoginAtom));
  }, [isLoginAtom]);

  useEffect(() => {
    if (state.trainers.length == 0) return;

    const tomorrow = new Date();

    tomorrow.setDate(todayDate.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);


    const timeUntilMidnight = tomorrow.getTime() - todayDate.getTime();
    const timer = setTimeout(() => {
      setTrainerDetailsAtom(null);
      setTodayDate(tomorrow);
    }, timeUntilMidnight);


    checkSubscriptionsStateForTrainers();
    return () => clearTimeout(timer);
  }, [todayDate, state.trainers]);



  return isLoginAtom ?
    <main dir="rtl" className="flex">
      <SideBar />

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