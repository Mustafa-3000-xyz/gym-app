import All_Accountes from "@/Global-components/All-accountes/All_Accountes";
import Discription from "@/Global-components/Description/Discription";
import { IdCardLanyard, Plus, Shell } from "lucide-react";
import { useState } from "react";
import Add_Account from "./Components/Add-account/Add_Account";
import Box from "@/Global-components/Box/Box";
import { useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
// ========================================================== //
export default function Accountes_Page() {
    const state = useSelector(state => state as store_Type);
    const [isShowAddAccount, setIsShowAddAccount] = useState<boolean>(false);


    function clickOnAddAccount() {
        setIsShowAddAccount(true);
    }


    return <section>
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

        {/* Add new account btn */}
        <div className="flex justify-center">
            <button
                onClick={clickOnAddAccount}
                className="w-3/3 flex gap-3 justify-center items-center cursor-pointer transition-all bg-emerald-500 text-white px-6 py-6 rounded-lg border-emerald-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
                <h3 className="text-lg font-bold">إنشاء حساب جديد</h3>
                <p>
                    <Plus size={20} strokeWidth={3} />
                </p>
            </button>
        </div>

        {/* All accountes */}
        <div className="mt-20">
            <All_Accountes />
        </div>

        {
            isShowAddAccount ?
                <Add_Account onIsShowAddAccount={setIsShowAddAccount} />
                :
                null
        }
    </section>
}