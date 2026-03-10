import { store_Type } from "@/Rtk/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sing_Up_Page from "../Sing-up-page/Sing_Up_Page";
import Login_Page from "../Login-page/Login_Page";
import { getAllAccountes } from "@/Rtk/Slices/accountsSlice";
// ========================================================== //
export default function Authentication_Page() {
    const dispatch = useDispatch();
    const getAccountes = useSelector(state => state as store_Type);



    useEffect(function () {
        dispatch(getAllAccountes() as any);
        localStorage.setItem("accountId", "null");
    }, []);



    return <main
        dir="rtl"
        className="px-10 h-screen flex justify-center items-center"
    >
        {
            getAccountes.accountes.length == 0 ?
                <Sing_Up_Page />
                :
                <Login_Page />
        }
    </main>
}