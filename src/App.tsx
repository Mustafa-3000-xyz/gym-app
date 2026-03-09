import { Navigate, Route, Routes } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
import Attendance_Recorde_Page from "./Pages/Attendance-recorde-page/Attendance_Recorde_Page";
import Captains_Page from "./Pages/Captains-page/Captains_Page";
// ========================================================== //
function App() {
  return <main dir="rtl" className="flex">
    <SideBar />

    <div className="mt-7 w-full px-10">
      <Routes>
        <Route path="/" element={<Navigate to="/trainers-page" replace />} />

        <Route path="/trainers-page" element={<Trainers_Page />} />
        <Route path="/settings-page" element={<Settings_Page />} />
        <Route path="/captains-page" element={<Captains_Page />} />
        <Route path="/attendance-recorde-page" element={<Attendance_Recorde_Page />} />
      </Routes>
    </div>
  </main>
}

export default App;