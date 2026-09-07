import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Profits_And_Expenses_Page from "./Pages/Profits-and-expenses-page/Profits_And_Expenses_Page";
import Authentication_Page from "./Pages/Authentication-page/Authentication_Page";
import { useEffect, useMemo, useState } from "react";
import { accountesPagePath, attendanceRecordePagePath, authenticationPagePath, errorInAppPagePath, profilePagePath, profitsAndExpensesPagePath, settingsPagePath, stepsForBuyAppPage, subscriptionsMenuPath, trainerPagePath, tryOrBuyAppPagePath } from "./Lib/constants";
import Profile_Page from "./Pages/Profile-page/Profile_Page";
import Subscriptions_Menu_Page from "./Pages/Subscriptions-menus-page/Subscriptions_Menus_Page";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "./Rtk/types";
import { getAllRowsInAccountsTable } from "./Rtk/Slices/Db-slices/accountsSlice";
import { changeLogInInfo } from "./Rtk/Slices/UI-slices/logInInfoSlice";
import { accountsTable, activeSessionsTable, attendanceTable, daysProfitsAndExpensesTable, itemsTable, monthsProfitsAndExpensesTable, settingsTable, subscriptionsMenusTable, trainerTable, yearsProfitsAndExpensesTable } from "./Lib/tables";
import { invoke } from "@tauri-apps/api/core";
import { licensingInfo_Type } from "./Pages/types";
import Try_Or_Buy_App_Page from "./Pages/Try-or-buy-app-page/Try_Or_Buy_App_Page";
import Error_In_App_Page from "./Pages/Error-in-app-page/Error_In_App_Page";
import Steps_For_Buy_App_Page from "./Pages/Try-or-buy-app-page/Nested-pages/Steps_For_Buy_App_Page";
import Database from "@tauri-apps/plugin-sql";
import { normalAlert } from "./Lib/functions";
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

  const [contentErrorPage, setContentErrorPage] = useState("");
  const [isUsingApp, setIsUsingApp] = useState(false);
  const [licensingInfo, setLicensingInfo] = useState<null | licensingInfo_Type>(null);

  const todayDate = useMemo(() => new Date(), []);

  const navigation = useNavigate();




  async function initJsonFile() {
    try {
      const res: any = await invoke('manage_gym_procedures', { newData: null });

      setLicensingInfo(res.data);
      await aroundTheApplication(res.data);
    } catch (err) {
      console.error(err);
      setContentErrorPage("حدث خطأ في ملف JSON، من فضلك قم بمسح الملف");
      navigation(errorInAppPagePath);
    }
  }

  async function aroundTheApplication(licensingInfo: licensingInfo_Type) {
    // This conditional for check the user is new in app
    if (
      (!licensingInfo.testInfo.isTest && !licensingInfo.testInfo.activationDate && !licensingInfo.testInfo.endDate)
      &&
      !licensingInfo.licenseKey
    ) {
      // I put this because maybe the user remove the json file for get 30 days test app again :)
      await deleteAllDataInDb();
      navigation(tryOrBuyAppPagePath);
      return;
    }

    if (licensingInfo.licenseKey) {
      setIsUsingApp(true);
      return;
    }

    // This conditional for check the date in pc is before the activation date test
    if (todayDate.getTime() < new Date(licensingInfo?.testInfo.activationDate as any).getTime()) {
      setContentErrorPage("من فضلك, قم بتعديل تاريخ وتوقيت الجهاز لكي يتوافق مع تاريخ وتوقيت اليوم في مصر");
      navigation(errorInAppPagePath);
      return;
    }

    // This conditional for check the test app is finished or no
    if (
      licensingInfo?.testInfo.isTest
      &&
      todayDate.getTime() >= new Date(licensingInfo?.testInfo.endDate as any).getTime()
    ) {
      await invoke('manage_gym_procedures', {
        newData: {
          "testInfo": {
            "isTest": false,
            "endDate": licensingInfo?.testInfo.endDate,
            "activationDate": licensingInfo?.testInfo.activationDate
          },
          "licenseKey": null
        }
      });

      setLicensingInfo({
        testInfo: {
          "isTest": false,
          "endDate": licensingInfo?.testInfo.endDate,
          "activationDate": licensingInfo?.testInfo.activationDate
        },
        licenseKey: null
      });

      setIsUsingApp(false);
      navigation(tryOrBuyAppPagePath);
    }
    else if (
      licensingInfo?.testInfo.isTest
      &&
      todayDate.getTime() < new Date(licensingInfo?.testInfo.endDate as any).getTime()
    ) {
      setIsUsingApp(true);
    }
    else {
      setIsUsingApp(false);
    }
  }

  async function deleteAllDataInDb() {
    const database = await Database.load("sqlite:gym-app.db");


    try {
      await database.execute(`
        PRAGMA foreign_keys = OFF;

        DELETE FROM trainers;
        DELETE FROM activeSessions;
        DELETE FROM accounts; 
        DELETE FROM subscriptionsMenus;
        DELETE FROM attendance;
        DELETE FROM yearsProfitsAndExpenses;
        DELETE FROM monthsProfitsAndExpenses;
        DELETE FROM daysProfitsAndExpenses;
        DELETE FROM items;

        DELETE FROM sqlite_sequence;

        PRAGMA foreign_keys = ON;
      `);
    }
    catch (err) {
      normalAlert({
        title: "error",
        text: String(err),
        icon: "error"
      });

      console.log(err);
    }
  }

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
    initJsonFile();
    dispatch(changeLogInInfo(null));
  }, []);

  useEffect(function () {
    if (!isUsingApp) return;


    async function startAppSetup() {
      await runTables();
      dispatch(getAllRowsInAccountsTable() as any);
      dispatch(getAllRowsInSubscriptionsMenusTable() as any);
      dispatch(getAllRowsInYearsProfitsAndExpensesTable() as any);
      dispatch(getAllRowsInSettingsTable() as any);
      navigation(authenticationPagePath);
    }

    startAppSetup();
  }, [isUsingApp]);

  useEffect(function () {
    if (!isUsingApp) return;

    if (!state.logInInfo) {
      navigation(authenticationPagePath);
    }
  }, [state.logInInfo, isUsingApp]);




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
        <Route path={tryOrBuyAppPagePath} element={<Try_Or_Buy_App_Page licensingInfo={licensingInfo} />}>
          <Route path={stepsForBuyAppPage} element={<Steps_For_Buy_App_Page />} />
        </Route>
        <Route path={errorInAppPagePath} element={<Error_In_App_Page errorMessage={contentErrorPage} />} />
      </Routes>
    </div>
  </main>
}

export default App;