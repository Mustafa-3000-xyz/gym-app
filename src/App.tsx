import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Profits_And_Expenses_Page from "./Pages/Profits-and-expenses-page/Profits_And_Expenses_Page";
import Authentication_Page from "./Pages/Authentication-page/Authentication_Page";
import { useEffect } from "react";
import { accountesPagePath, attendanceRecordePagePath, authenticationPagePath, profilePagePath, profitsAndExpensesPagePath, settingsPagePath, subscriptionsMenuPath, trainerPagePath } from "./Lib/constants";
import Profile_Page from "./Pages/Profile-page/Profile_Page";
import Subscriptions_Menu_Page from "./Pages/Subscriptions-menus-page/Subscriptions_Menus_Page";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "./Rtk/types";
import { getAllRowsInAccountsTable } from "./Rtk/Slices/Db-slices/accountsSlice";
import { changeLogInInfo } from "./Rtk/Slices/UI-slices/logInInfoSlice";
import { accountsTable, activeSessionsTable, attendanceTable, daysProfitsAndExpensesTable, itemsTable, monthsProfitsAndExpensesTable, settingsTable, subscriptionsMenusTable, trainerTable, yearsProfitsAndExpensesTable } from "./Lib/tables";
import { getAllRowsInSubscriptionsMenusTable } from "./Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import Accounts_Page from "./Pages/Accounts-page/Accounts_Page";
import { getAllRowsInYearsProfitsAndExpensesTable } from "./Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { getAllRowsInSettingsTable } from "./Rtk/Slices/Db-slices/settingsSlice";
// ========================================================== //
function App() {
  const dispatch = useDispatch();
  const state = useSelector(function (state: store_Type) {
    return {
      logInInfo: state.logInInfo,
      trainers: state.trainers,
    }
  }, shallowEqual);

  const navigation = useNavigate();



  async function runTables() {
    await trainerTable()
    await activeSessionsTable();
    await accountsTable();
    await attendanceTable();
    await subscriptionsMenusTable();
    await yearsProfitsAndExpensesTable();
    await monthsProfitsAndExpensesTable();
    await daysProfitsAndExpensesTable();
    await itemsTable();
    await settingsTable();
  }





  useEffect(function () {
    runTables();

    dispatch(changeLogInInfo(null));
    dispatch(getAllRowsInAccountsTable() as any);
    dispatch(getAllRowsInSubscriptionsMenusTable() as any);
    dispatch(getAllRowsInYearsProfitsAndExpensesTable() as any);
    dispatch(getAllRowsInSettingsTable() as any);

    navigation(authenticationPagePath);
  }, []);

  useEffect(function () {
    if (!state.logInInfo) {
      navigation(authenticationPagePath);
    }
  }, [state.logInInfo]);




  return <main dir="rtl" className="flex">
    {
      state.logInInfo ?
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

        <Route path={accountesPagePath} element={<Accounts_Page />} />
        <Route path={profilePagePath} element={<Profile_Page />} />
        <Route path={profitsAndExpensesPagePath} element={<Profits_And_Expenses_Page />} />

        <Route path={settingsPagePath} element={<Settings_Page />} />

        <Route path={authenticationPagePath} element={<Authentication_Page />} />
      </Routes>
    </div>
  </main>
}

export default App;