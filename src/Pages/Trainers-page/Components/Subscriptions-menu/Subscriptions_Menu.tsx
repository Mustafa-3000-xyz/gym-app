import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import { Subscriptions_Menu_Props, subscriptionsMenu } from "@/Pages/types";
import { store_Type } from "@/Rtk/types";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// ========================================================== //
export default function Subscriptions_Menu(
    {
        onGetSubscriptionName,
        onGetSessionsCount,
        onGetPrice
    }: Subscriptions_Menu_Props
) {
    const state = useSelector(state => state as store_Type);


    const [isShowMenu, setIsShowMenu] = useState(false);
    const [menusList, setMenusList] = useState<subscriptionsMenu[] | null>(null);



    function clickOnSubscriptionMenu(subscriptionInfo: subscriptionsMenu) {
        onGetSubscriptionName(subscriptionInfo.subscriptionName);
        onGetSessionsCount(subscriptionInfo.sessionsCount);
        onGetPrice(subscriptionInfo.price);

        setIsShowMenu(false);
    }



    useEffect(function () {
        if (state.subscriptionsMenu.length == 0) return;
        const arr: subscriptionsMenu[] = [];


        state.subscriptionsMenu.forEach(ele => ele.isActive == "true" && arr.push(ele));
        setMenusList(arr.length == 0 ? null : arr);
    }, [state.subscriptionsMenu]);



    return <Drop_Menu
        title="قوائم الاشتراكات"
        menuHeight="fixed"
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