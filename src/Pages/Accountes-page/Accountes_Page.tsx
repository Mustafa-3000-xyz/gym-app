import All_Accountes from "@/Global-components/All-accountes/All_Accountes";
import { IdCardLanyard, Plus, Shell } from "lucide-react";
import { useState } from "react";
import Add_Account from "./Components/Add_Account";
import Box from "@/Global-components/Box/Box";
import { useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import { useAtomValue } from "jotai";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import Swal from "sweetalert2";
// ========================================================== //
export default function Accountes_Page() {
    const isLoginAtom = useAtomValue(isLogin_Atom);

    const state = useSelector(state => state as store_Type);
    const [isShowAddAccount, setIsShowAddAccount] = useState<boolean>(false);

    const theAccount = state.accountes.find(ele => ele.id == isLoginAtom.id);


    function clickOnAddAccount() {
        if (theAccount?.type != "manager") {
            setIsShowAddAccount(false);
            return;
        }

        if (state.accountes.length == 4) {
            Swal.fire({
                icon: "error",
                title: "المعذره",
                text: "لقد وصلت للحد الاقصى لإنشاء حساب جديد",
                confirmButtonText: "تمام"
            });
        } else {
            setIsShowAddAccount(true);
        }
    }




    return <section className="mb-5">
        {/* Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<IdCardLanyard size={25} />}
                title="مجموع الحسابات"
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                total={`
                    ${state.accountes.length} من اصل 4
                `}
            />

            <Box
                icon={<Shell size={25} />}
                title="مجموع الحصص المفعله"
                styleIcon="bg-neutral-200 text-neutral-500"
                total={
                    Math.trunc(state.accountes.reduce((sum, ele) => sum + Number(ele.totalForActiveSessions), 0))
                }
            />
        </div>

        {/* Create new account */}
        <div>
            <Add_Btn
                icon={<Plus size={20} strokeWidth={3} />}
                title="إنشاء حساب جديد"
                styleTheBgAndBorderBtn={`
                    bg-emerald-500 border-emerald-600
                    ${theAccount?.type != "manager" && "cursor-not-allowed opacity-55"}
                `}
                onClick={clickOnAddAccount}
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