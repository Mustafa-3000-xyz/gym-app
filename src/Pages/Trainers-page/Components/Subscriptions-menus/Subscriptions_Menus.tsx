import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import { Subscriptions_Menu_Props, subscriptionsMenus } from "@/Pages/types";
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
    const [menusList, setMenusList] = useState<subscriptionsMenus[] | null>(null);



    function clickOnSubscriptionMenu(subscriptionInfo: subscriptionsMenus) {
        onGetSubscriptionName(subscriptionInfo.subscriptionName);
        onGetPrice(subscriptionInfo.price);

        dispatch(addSessions(subscriptionInfo.sessionsCount));
        setIsShowMenu(false);
    }



    useEffect(function () {
        if (state.subscriptionsMenus?.length == 0) return;
        const arr: subscriptionsMenus[] = [];


        state.subscriptionsMenus?.forEach(ele => ele.isActive == "true" && arr.push(ele));
        setMenusList(arr.length == 0 ? null : arr);
    }, [state.subscriptionsMenus]);



    return <Drop_Menu
        title="قوائم الاشتراكات"
        messageForNotAddChildren="لا يوجد قوائم اشتراك"
        menuHeight={Number(state.subscriptionsMenus?.length) >= 5 ? "fixed" : "auto"}
        menuIsFullWidth={true}
        isShowTheMenu={isShowMenu}
        icon={<Menu size={23} />}
        onGetCurrentIsShowMenu={setIsShowMenu}
    >
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
    </Drop_Menu>
}