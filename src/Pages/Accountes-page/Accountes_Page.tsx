import All_Accountes from "@/Global-components/All-accountes/All_Accountes";
import Discription from "@/Global-components/Description/Discription";
import { IdCardLanyard, Plus, Shell } from "lucide-react";
import { useState } from "react";
import Add_Account from "./Components/Add-account/Add_Account";
import Box from "@/Global-components/Box/Box";
import { useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import { useAtomValue } from "jotai";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
// ========================================================== //
export default function Accountes_Page() {
    const isLoginAtom = useAtomValue(isLogin_Atom);

    const state = useSelector(state => state as store_Type);
    const [isShowAddAccount, setIsShowAddAccount] = useState<boolean>(false);


    function clickOnAddAccount() {
        setIsShowAddAccount(true);
    }


    return <section className="mb-5">
        {/* Title & discription */}
        <div className="select-none mb-7 w-full">
            <h3 className="text-2xl font-bold">صفحة الحسابات</h3>
            <Discription discription="في تلك الصفحه يمكنك معرفة كل الحسابات وإنشاء حسابات جديده" />
        </div>

        {/* Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<IdCardLanyard size={25} />}
                title="مجموع الحسابات"
                styleIcon="bg-blue-100 text-blue-500"
                total={state.accountes.length}
            />

            <Box
                icon={<Shell size={25} />}
                title="مجموع الحصص المفعله"
                styleIcon="bg-neutral-200 text-neutral-500"
                total={3342345}
            />
        </div>

        {/* Create new account */}
        <div>
            <Add_Btn
                styleTheBgAndBorderBtn={`${isLoginAtom.type != "manager" ? "cursor-not-allowed opacity-55" : "cursor-pointer"} bg-emerald-500 border-emerald-600`}
                icon={<Plus size={20} strokeWidth={3} />}
                title="إنشاء حساب جديد"
                onClick={isLoginAtom.type != "manager" ? () => null : clickOnAddAccount}
            />
        </div>

        {/* All accountes */}
        <div className="mt-20">
            <All_Accountes />
        </div>

        {
            isShowAddAccount && <Add_Account onIsShowAddAccount={setIsShowAddAccount} />
        }
    </section>
}