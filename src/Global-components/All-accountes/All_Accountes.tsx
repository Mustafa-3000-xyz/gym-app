import { getAllAccountes } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account_Card from "./Account-card/Account_Card";
// ========================================================== //
export default function All_Accountes() {
    const state = useSelector(state => state as store_Type);
    const dispatch = useDispatch();



    useEffect(function () {
        dispatch(getAllAccountes() as any);
    }, []);




    return <div className="flex justify-center items-center gap-3 flex-wrap">
        {
            state.accountes.map(ele => {
                return <Account_Card
                    key={ele.id}
                    account={ele}
                />
            })
        }
    </div>
}