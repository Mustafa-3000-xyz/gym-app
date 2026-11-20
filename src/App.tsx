import { Route, Routes, useNavigate } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Profits_And_Expenses_Page from "./Pages/Profits-and-expenses-page/Profits_And_Expenses_Page";
import { useEffect } from "react";
import { accountesPagePath, addTrainerPagePath, anotherSettingsPagePath, attendanceRecordePagePath, logInPagePath, preferencesPagePath, profilePagePath, profitsAndExpensesPagePath, reportsPagePath, settingsPagePath, statusIsFinished, subscriptionsMenuPath, trainerDetailsPagePath, trainerPagePath } from "./Lib/constants";
import Profile_Page from "./Pages/Profile-page/Profile_Page";
import Subscriptions_Menu_Page from "./Pages/Subscriptions-menus-page/Subscriptions_Menus_Page";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "./Rtk/types";
import { getAllRowsInAccountsTable } from "./Rtk/Slices/Db-slices/accountsSlice";
import { changeLogInInfo } from "./Rtk/Slices/UI-slices/logInInfoSlice";
import { accountsTable, activeSessionsTable, attendanceTable, daysProfitsAndExpensesTable, itemsTable, monthsProfitsAndExpensesTable, reportsTable, settingsTable, subscriptionsMenusTable, trainerTable, yearsProfitsAndExpensesTable } from "./Lib/tables";
import { getAllRowsInSubscriptionsMenusTable } from "./Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import Accounts_Page from "./Pages/Accounts-page/Accounts_Page";
import { getAllRowsInYearsProfitsAndExpensesTable } from "./Rtk/Slices/Db-slices/yearsProfitsAndExpensesSlice";
import { getAllRowsInSettingsTable } from "./Rtk/Slices/Db-slices/settingsSlice";
import Sing_Up_Page from "./Pages/Sing-up-page/Sing_Up_Page";
import Login_Page from "./Pages/Login-page/Login_Page";
import Add_Trainer_Page from "./Pages/Trainers-page/Nested-pages/Add_Trainer_Page";
import Preferences_Page from "./Pages/Settings-page/Nested-pages/Preferences_Page";
import Another_Settings_Page from "./Pages/Settings-page/Nested-pages/Another_Settings_Page";
import Database from "@tauri-apps/plugin-sql";
import { normalAlert } from "./Lib/functions";
import Trainer_Details_Page from "./Pages/Trainers-page/Nested-pages/Trainer_Details_Page";
import Reports_Page from "./Pages/Reports-page/Reports_Page";
import { getAllRowsInTrainersTable } from "./Rtk/Slices/Db-slices/trainersSlice";
import { getAllRowsInAttendanceTable } from "./Rtk/Slices/Db-slices/attendanceSlice";
// ========================================================== //
function App() {
  const dispatch = useDispatch();
  const state = useSelector(function (state: store_Type) {
    return {
      logInInfo: state.logInInfo,
      trainers: state.trainers,
      accounts: state.accounts,
      settings: state.settings,
      sideBar: state.sideBar
    }
  }, shallowEqual);

  const navigate = useNavigate();



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
    await reportsTable();
    await settingsTable();
  }

  // This for remove some traines who not renwal after six month
  async function checkTheForWhoTrainerIsRemove() {
    if (!JSON.parse(state.settings.isDeleteSomeTrainersWhoNotRenwal as any ?? "false")) return;

    const db = await Database.load("sqlite:gym-app.db");

    try {
      await db.execute(
        `
          DELETE FROM trainers WHERE subscriptionStatus = ?
            AND DATE(subscriptionEnd, 'localtime') <= DATE('now', 'localtime', '-6 months');
        `,
        [statusIsFinished]
      );
    }
    catch (error) {
      normalAlert({
        title: "لا نستطيع حذف المتدربين القدامى",
        text: String(error),
        icon: "error"
      });
    }
  }


  /*
    - This function replaces old ISO/UTC dates with the new format (yyyy/mm/dd)
    - The ISO/UTC in version 1.0.0
  */
  async function updateDatesFormat() {
    try {
      const db = await Database.load("sqlite:gym-app.db");
      await db.execute(`
          UPDATE attendance
          SET date = REPLACE(SUBSTR(date, 1, 10), '-', '/')
          WHERE date LIKE '%T%';
      `);
    } catch (error) {
      normalAlert({
        icon: "error",
        title: "حدث خطأ اثناء تحديث التواريخ",
        text: String(error)
      })
    }
  }




  useEffect(function () {
    runTables();
    updateDatesFormat();

    dispatch(changeLogInInfo(null));
    dispatch(getAllRowsInTrainersTable() as any);
    dispatch(getAllRowsInAttendanceTable() as any);
    dispatch(getAllRowsInAccountsTable() as any);
    dispatch(getAllRowsInSubscriptionsMenusTable() as any);
    dispatch(getAllRowsInYearsProfitsAndExpensesTable() as any);
    dispatch(getAllRowsInSettingsTable() as any);

    navigate(logInPagePath);
  }, []);

  useEffect(function () {
    checkTheForWhoTrainerIsRemove();
  }, [state.settings.isDeleteSomeTrainersWhoNotRenwal]);



  if (state.accounts?.length == 0) return <Sing_Up_Page />

  return <main dir="rtl" className="flex">
    {
      state.logInInfo && state.sideBar == "show" ?
        <SideBar />
        :
        null
    }

    <div className="w-full px-10">
      <Routes>
        <Route path={trainerPagePath} element={<Trainers_Page />} />
        <Route path={attendanceRecordePagePath} element={<Attendance_Recorde_Page />} />
        <Route path={subscriptionsMenuPath} element={<Subscriptions_Menu_Page />} />

        <Route path={accountesPagePath} element={<Accounts_Page />} />
        <Route path={profilePagePath} element={<Profile_Page />} />
        <Route path={profitsAndExpensesPagePath} element={<Profits_And_Expenses_Page />} />

        <Route path={reportsPagePath} element={<Reports_Page />} />
        <Route path={settingsPagePath} element={<Settings_Page />} />

        <Route path={logInPagePath} element={<Login_Page />} />
        <Route path={addTrainerPagePath} element={<Add_Trainer_Page />} />
        <Route path={trainerDetailsPagePath} element={<Trainer_Details_Page />} />
        <Route path={preferencesPagePath} element={<Preferences_Page />} />
        <Route path={anotherSettingsPagePath} element={<Another_Settings_Page />} />
      </Routes>
    </div>
  </main>
}

export default App;