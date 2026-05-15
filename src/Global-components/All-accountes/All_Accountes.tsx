import { getAllAccounts } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account_Card from "./Account-card/Account_Card";
import Not_Found from "../Not-found/Not_Found";
// ========================================================== //
export default function All_Accountes() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);



    useEffect(function () {
        dispatch(getAllAccounts() as any);
    }, []);



    if (state.accountes.length == 1 && state.logInInfo != null) {
        return <Not_Found
            srcImg="/not_found_in_accounts.svg"
            title="لايوجد حسابات كباتن"
        />
    }


    return <div className="flex justify-center items-center gap-3 flex-wrap">
        {
            state.accountes.map(ele => {
                return <Account_Card
                    key={ele.id}
                    account={ele}
                    isShowAccountCard={!state.logInInfo || state.logInInfo.id != ele.id}
                />
            })
        }
    </div>
}