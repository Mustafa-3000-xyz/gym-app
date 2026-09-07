import { store_Type } from "@/Rtk/types";
import { shallowEqual, useSelector } from "react-redux";
import Sing_Up_Page from "./Components/Sing-up-page/Sing_Up_Page";
import Login_Page from "./Components/Login-page/Login_Page";
// ========================================================== //
export default function Authentication_Page() {
    const state = useSelector(function (state: store_Type) {
        return {
            accounts: state.accounts,
        }
    }, shallowEqual);



    return <main
        dir="rtl"
        className="px-10 h-screen flex justify-center items-center"
    >
        {
            state.accounts?.length == 0 ?
                <Sing_Up_Page />
                :
                <Login_Page />
        }
    </main>
}