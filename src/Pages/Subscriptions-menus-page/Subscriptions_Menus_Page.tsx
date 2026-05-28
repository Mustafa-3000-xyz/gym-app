import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Box from "@/Global-components/Box/Box";
import { Captions, Users } from "lucide-react";
import Subscription_Menu_Card from "./Components/Subscription_Menu_Card";
import { useEffect, useMemo, useState } from "react";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { addRowInSubscriptionsMenusTable } from "@/Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { normalAlert } from "@/Lib/functions";
// ========================================================== //
export default function Subscriptions_Menu_Page() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);

    const [isSaveData, setIsSaveData] = useState(false);
    const [isShowAddNewSubscriptionType, setIsShowAddNewSubscriptionType] = useState(false);


    const [getSubscriptionName, setGetSubscriptionName] = useState("");
    const [getSessionCount, setGetSessionCount] = useState(0);
    const [getPrice, setGetPrice] = useState(0);




    function addNewSubscriptionMenu() {
        if (state.subscriptionsMenus.length == 6) {
            normalAlert({
                title: "المعذره",
                text: "لقد وصلت للحد الاقصى",
                icon: "error"
            });
        }
        else {
            setIsShowAddNewSubscriptionType(true);
        }
    }



    function saveData() {
        dispatch(addRowInSubscriptionsMenusTable({
            subscriptionName: getSubscriptionName,
            sessionsCount: getSessionCount,
            price: getPrice,
            trainersTotal: 0,
            isActive: "true"
        }) as any);

        normalAlert({
            title: "تمت العمليه بنجاح",
            text: "لقد تم إضافة قائمة جديده",
            icon: "success"
        })

        setIsShowAddNewSubscriptionType(false);
    }




    useEffect(function () {
        if (!getSubscriptionName || getSessionCount == 0 || getPrice == 0) {
            setIsSaveData(false);
        }
        else if (getSubscriptionName && getSessionCount > 0 && getPrice > 0) {
            setIsSaveData(true);
        }
        else {
            setIsSaveData(false);
        }
    }, [getSubscriptionName, getSessionCount, getPrice]);




    const trainersTotal = useMemo(function () {
        return state.subscriptionsMenus.reduce((sum, ele) => sum + ele.trainersTotal, 0);
    }, [state.subscriptionsMenus.length]);





    return <section>
        {/* Box */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<Captions size={30} />}
                title="مجموع قوائم الاشتراكات"
                total={`${state.subscriptionsMenus.length} من اصل 6`}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
            />

            <Box
                icon={<Users size={30} />}
                title="مجموع المشتركين في كل قوائم الاشتراك"
                total={trainersTotal}
                styleIcon="bg-neutral-200 text-neutral-500"
            />
        </div>

        {/* Add new subscription menu */}
        <div className="mb-20">
            <Add_Btn
                title="إضافة قائمة اشتراك"
                styleBtn="cursor-pointer"
                onClick={addNewSubscriptionMenu}
            />
        </div>

        {/* All subscriptions menu */}
        <div className="flex justify-center items-center flex-wrap gap-3">
            {
                state.subscriptionsMenus.length == 0 ?
                    <Not_Found
                        srcImg="not_found_in_subscription_menu.svg"
                        title="لا يوجد قوائم الان"
                    />
                    :
                    state.subscriptionsMenus.map(ele => <Subscription_Menu_Card
                        key={ele.id}
                        id={ele.id}
                        subscriptionName={ele.subscriptionName}
                        sessionsCount={ele.sessionsCount}
                        trainersTotal={ele.trainersTotal}
                        price={ele.price}
                        isActive={JSON.parse(ele.isActive)}
                    />)
            }
        </div>


        {
            isShowAddNewSubscriptionType ?
                <Popup_Form
                    titel="إضافة قائمة اشتراك جديد"
                    discription="الان, يمكنك إضافة قائمة اشتراك جديد"
                    isSave={isSaveData}
                    clickOnSaveBtn={saveData}
                    clickOnCancel={() => setIsShowAddNewSubscriptionType(false)}
                >
                    <div className="grid grid-cols-2 gap-3 mb-5 px-10">
                        <Inp_With_Label
                            valueOrDefaultValue="default value"
                            labelName="اسم الاشتراك"
                            onWriteInInput={(e) => setGetSubscriptionName(e.target.value)}
                        />

                        <Inp_With_Label
                            valueOrDefaultValue="default value"
                            labelName="عدد الحصص"
                            onWriteInInput={(e) => setGetSessionCount(+e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center">
                        <div className="w-2/5">
                            <Inp_With_Label
                                valueOrDefaultValue="default value"
                                labelName="السعر"
                                onWriteInInput={(e) => setGetPrice(+e.target.value)}
                            />
                        </div>
                    </div>
                </Popup_Form>
                :
                null
        }
    </section>
}