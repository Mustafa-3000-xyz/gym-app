import { Route, Routes } from "react-router-dom";
import Home_page from "./Pages/Home-page/Home_Page";
import Trainers_Page from "./Pages/Trainers-page/Trainers_Page";
import Notifications_Page from "./Pages/Notifications-page/Notifications_Page";
import Settings_Page from "./Pages/Settings-page/Settings_Page";
import Profits_Page from "./Pages/Profits-page/Profits_Page";
import Expenses_page from "./Pages/Expenses-page/Expenses_Page";
import { ToastContainer } from "react-toastify";
import SideBar from "./Components/Constants/SideBar";
// ========================================================== //
function App() {
  return <main dir="rtl" className="flex">
    <SideBar />

    <div className="mt-7 w-full px-10">
      <Routes>
        <Route path="/" element={<Home_page />} />
        <Route path="/trainers-page" element={<Trainers_Page />} />
        <Route path="/notifications-page" element={<Notifications_Page />} />
        <Route path="/settings-page" element={<Settings_Page />} />
        <Route path="/profits-page" element={<Profits_Page />} />
        <Route path="/expenses-page" element={<Expenses_page />} />
      </Routes>
    </div>

    <div dir="ltr">
      <ToastContainer />
    </div>
  </main>
}

export default App;