import { Navigate, Route, Routes } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Profits_And_Expenses_Page from "./Pages/Profits-and-expenses-page/Profits_And_Expenses_Page";
import Accountes_Page from "./Pages/Accountes-page/Accountes_Page";
import Authentication_Page from "./Pages/Authentication-page/Authentication_Page";
import { useAtomValue } from "jotai";
import isLogin_Atom from "./Atoms/Is/isLogin_Atom";
import { useEffect } from "react";
import { accountesPagePath, attendanceRecordePagePath, expalinAppPagePath, profilePagePath, profitsAndExpensesPagePath, settingsPagePath, trainerPagePath } from "./Lib/constants";
import Explain_App_Page from "./Pages/Explain-app-page/Explain_App_Page";
import Profile_Page from "./Pages/Profile-page/Profile_Page";
import { logOutFromOldAccount } from "./Lib/functions";
// ========================================================== //
function App() {
  const isLoginAtom = useAtomValue(isLogin_Atom);



  async function logOutWhenCloseApp() {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const appWindow = getCurrentWindow();

    await appWindow.listen('tauri://close-requested', async () => {
      if (isLoginAtom) {
        logOutFromOldAccount(isLoginAtom.id);
      }

      localStorage.setItem("theAccount", JSON.stringify(null));
      await appWindow.destroy();
    });
  }


  useEffect(function () {
    logOutWhenCloseApp();
  }, []);

  useEffect(function () {
    localStorage.setItem("theAccount", JSON.stringify(isLoginAtom));
  }, [isLoginAtom]);



  return isLoginAtom ?
    <main dir="rtl" className="flex">
      <SideBar />

      <div className="mt-7 w-full px-10">
        <Routes>
          <Route path="/" element={<Navigate to="/trainers-page" replace />} />

          <Route path={trainerPagePath} element={<Trainers_Page />} />
          <Route path={accountesPagePath} element={<Accountes_Page />} />
          <Route path={attendanceRecordePagePath} element={<Attendance_Recorde_Page />} />
          <Route path={profitsAndExpensesPagePath} element={<Profits_And_Expenses_Page />} />
          <Route path={settingsPagePath} element={<Settings_Page />} />
          <Route path={expalinAppPagePath} element={<Explain_App_Page />} />
          <Route path={profilePagePath} element={<Profile_Page />} />
        </Routes>
      </div>
    </main>
    :
    <Authentication_Page />
}

export default App;