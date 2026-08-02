import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import { subscriptionsMenus_Type } from "@/Pages/types";
import { Subscriptions_Menu_Props } from "@/Pages/typesProps";
import { addSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { store_Type } from "@/Rtk/types";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// ========================================================== //
export default function Subscriptions_Menu(
    {
        onGetSubscriptionName,
        onGetPrice
    }: Subscriptions_Menu_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            trainerDetails: state.trainerDetails,
            subscriptionsMenus: state.subscriptionsMenus,
        }
    }, shallowEqual);

    const [isShowMenu, setIsShowMenu] = useState(false);
    const [menusList, setMenusList] = useState<subscriptionsMenus_Type[] | null>(null);



    function clickOnSubscriptionMenu(subscriptionInfo: subscriptionsMenus_Type) {
        onGetSubscriptionName(subscriptionInfo.subscriptionName);
        onGetPrice(subscriptionInfo.price);

        dispatch(addSessions(subscriptionInfo.sessionsCount));
        setIsShowMenu(false);
    }



    useEffect(function () {
        if (state.subscriptionsMenus?.length == 0) return;
        const arr: subscriptionsMenus_Type[] = [];


        state.subscriptionsMenus?.forEach(ele => ele.isActive == "true" && arr.push(ele));
        setMenusList(arr.length == 0 ? null : arr);
    }, [state.subscriptionsMenus]);



    return <Drop_Menu
        classNameForMenu="w-full"
        messageForNotAddChildren="لا يوجد قوائم اشتراك"
        isShowTheMenu={isShowMenu}
        onGetCurrentIsShowMenu={setIsShowMenu}
    >
        <Top_Content_For_The_Drop className="flex gap-3 items-center p-2"> 
            <Menu size={23} />
            <h4 className="text-lg font-bold">قوائم الاشتراكات</h4>
        </Top_Content_For_The_Drop>

        <Bottom_Content_For_The_Drop className={`${state.subscriptionsMenus?.length as any >= 4 ? "h-[209px] overflow-auto p-3" : ""}`}>
            {
                menusList?.map(ele => (
                    <div
                        key={ele.id}
                        className={`
                            duration-300
                            flex justify-between mb-3 items-center p-3 bg-slate-200 rounded-lg cursor-pointer
                            hover:bg-slate-200/60
                        `}
                        onClick={() => clickOnSubscriptionMenu(ele)}
                    >
                        <ul className=" list-disc ms-5">
                            <li className="text-lg font-bold">
                                {ele.subscriptionName}
                            </li>

                            <li className="font-bold">
                                عدد الحصص : {ele.sessionsCount}
                            </li>
                        </ul>


                        <h3 className="text-emerald-500 font-bold underline">
                            ${ele.price}
                        </h3>
                    </div>
                ))
            }
        </Bottom_Content_For_The_Drop>
    </Drop_Menu>
}