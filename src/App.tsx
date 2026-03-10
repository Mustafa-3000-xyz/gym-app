import { Navigate, Route, Routes } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Profits_And_Expenses_Page from "./Pages/Profits-and-expenses-page/Profits_And_Expenses_Page";
import Accountes_Page from "./Pages/Accountes-page/Accountes_Page";
import Authentication_Page from "./Pages/Authentication-page/Authentication_Page";
import { useAtomValue } from "jotai";
import isLogin_Atom from "./Atoms/isLogin_Atom";
// ========================================================== //
function App() {
  const isLoginAtom = useAtomValue(isLogin_Atom)
  const getaccountId = JSON.parse(localStorage.getItem("accountId") as any);


  return isLoginAtom || getaccountId ?
    <main
      dir="rtl"
      className="flex"
    >
      <SideBar />

      <div className="mt-7 w-full px-10">
        <Routes>
          <Route path="/" element={<Navigate to="/trainers-page" replace />} />

          <Route path="/trainers-page" element={<Trainers_Page />} />
          <Route path="/settings-page" element={<Settings_Page />} />
          <Route path="/accountes-page" element={<Accountes_Page />} />
          <Route path="/attendance-recorde-page" element={<Attendance_Recorde_Page />} />
          <Route path="/profits-and-expenses-page" element={<Profits_And_Expenses_Page />} />
        </Routes>
      </div>
    </main>
    :
    <Authentication_Page />
}

export default App;