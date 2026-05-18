import { store_Type } from "@/Rtk/types";
import { useSelector } from "react-redux";
import Account_Card from "./Account-card/Account_Card";
import Not_Found from "../Not-found/Not_Found";
// ========================================================== //
export default function All_Accountes() {
    const state = useSelector(state => state as store_Type);



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