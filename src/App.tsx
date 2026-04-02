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
import isShowAccountDetails_Atom from "./Atoms/Is/isShowAccountDetails_Atom";
import Account_Details from "./Pages/Accountes-page/Components/Account-details/Account_Details";
import { accountesPagePath, attendanceRecordePagePath, expalinAppPagePath, profitsAndExpensesPagePath, settingsPagePath, trainerPagePath } from "./Lib/constants";
import Explain_App_Page from "./Pages/Explain-app-page/Explain_App_Page";
// ========================================================== //
function App() {
  const isShowAccountDetailsAtom = useAtomValue(isShowAccountDetails_Atom);
  const isLoginAtom = useAtomValue(isLogin_Atom);



  // This for when close the window, reset the log in
  useEffect(() => {
    let unlisten: any;

    const setup = async () => {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const appWindow = getCurrentWindow();

      unlisten = await appWindow.listen('tauri://close-requested', async () => {
        localStorage.setItem("theAccount", JSON.stringify(null));
        await appWindow.destroy();
      });
    };
    setup();

    return () => {
      if (unlisten) unlisten();
    };
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
        </Routes>
      </div>


      {
        isShowAccountDetailsAtom && <Account_Details />
      }
    </main>
    :
    <Authentication_Page />
}

export default App;