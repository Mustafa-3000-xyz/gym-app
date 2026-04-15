import { getAllAccounts } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account_Card from "./Account-card/Account_Card";
import { useAtomValue } from "jotai";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import Not_Found from "../Not-found/Not_Found";
// ========================================================== //
export default function All_Accountes() {
    const state = useSelector(state => state as store_Type);
    const isLoginAtom = useAtomValue(isLogin_Atom);
    const dispatch = useDispatch();



    useEffect(function () {
        dispatch(getAllAccounts() as any);
    }, []);



    if (state.accountes.length == 1 && isLoginAtom != null) {
        return <Not_Found
            srcImg="not_found_in_accounts.svg"
            title="لايوجد حسابات كباتن"
        />
    }


    return <div className="flex justify-center items-center gap-3 flex-wrap">
        {
            state.accountes.map(ele => {
                /* 
                    When I'm not logged in, show all accounts. 
                    After I log in, do not show the account I'm using on the accounts page.
                */
                return isLoginAtom == null ?
                    <Account_Card
                        key={ele.id}
                        account={ele}
                    />
                    :
                    ele.id != isLoginAtom.id &&
                    <Account_Card
                        key={ele.id}
                        account={ele}
                    />
            })
        }
    </div>
}