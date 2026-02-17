import { Navigate, Route, Routes } from "react-router-dom";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import SideBar from "./Global-components/Sidebar/SideBar";
// ========================================================== //
function App() {
  return <main dir="rtl" className="flex">
    <SideBar />

    <div className="mt-7 w-full px-10">
      <Routes>
        <Route path="/" element={<Navigate to="/trainers-page" replace />} />

        <Route path="/trainers-page" element={<Trainers_Page />} />
        <Route path="/settings-page" element={<Settings_Page />} />
      </Routes>
    </div>
  </main>
}

export default App;