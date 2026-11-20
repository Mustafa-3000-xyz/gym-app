import { store_Type } from "@/Rtk/types";
import { shallowEqual, useSelector } from "react-redux";
import Account_Card from "./Account-card/Account_Card";
import Not_Found from "../Not-found/Not_Found";
// ========================================================== //
export default function All_Accounts() {
    const state = useSelector(function (state: store_Type) {
        return {
            accounts: state.accounts,
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);







    if (state.accounts?.length == 1 && state.logInInfo?.id) {
        return <Not_Found
            srcImg="/not_found_for_boxes.svg"
            title="لايوجد حسابات كباتن"
        />
    }

    return <div className="flex justify-center items-center flex-wrap gap-3">
        {
            state.accounts?.map(ele => {
                if (state.logInInfo?.id != ele.id) {
                    return <Account_Card
                        key={ele.id}
                        account={ele}
                    />
                }
            })
        }
    </div>
}