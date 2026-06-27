import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Box from "@/Global-components/Box/Box";
import { Captions, Users } from "lucide-react";
import Subscription_Menu_Card from "./Components/Subscription_Menu_Card";
import { useEffect, useMemo, useState } from "react";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { addRowInSubscriptionsMenusTable } from "@/Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { checkThePermissionIsHere, normalAlert } from "@/Lib/functions";
import { regexSubscriptionName } from "@/Lib/REGEX";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { ADD_NEW_SUBSCRIPTION_MENU, maxSessions, maxSubscriptionPrice } from "@/Lib/constants";
// ========================================================== //
export default function Subscriptions_Menu_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            trainerDetails: state.trainerDetails,
            subscriptionsMenus: state.subscriptionsMenus,
        }
    }, shallowEqual);

    const [isSaveData, setIsSaveData] = useState(false);
    const [isShowAddNewSubscriptionType, setIsShowAddNewSubscriptionType] = useState(false);


    const [getSubscriptionName, setGetSubscriptionName] = useState<string>("");
    const [getSessionCount, setGetSessionCount] = useState<number>(0);
    const [getPrice, setGetPrice] = useState<number>(0);

    const checkAddMenuPermission = checkThePermissionIsHere({
        accountId: Number(state.logInInfo?.id),
        permissionType: ADD_NEW_SUBSCRIPTION_MENU
    });



    function addNewSubscriptionMenu() {
        if (checkAddMenuPermission && Number(state.subscriptionsMenus?.length) < 6) {
            setIsShowAddNewSubscriptionType(true);
        }
        else if (checkAddMenuPermission && Number(state.subscriptionsMenus?.length) >= 6) {
            normalAlert({
                title: "المعذره",
                text: "لقد وصلت للحد الاقصى",
                icon: "error"
            });

            setIsShowAddNewSubscriptionType(false);
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحيه لإضافة قائمة اشتراك جديده",
                icon: "error"
            });

            setIsShowAddNewSubscriptionType(false);
        }
    }

    function saveData() {
        if (!isSaveData) return;

        dispatch(addRowInSubscriptionsMenusTable({
            subscriptionName: getSubscriptionName!,
            sessionsCount: getSessionCount!,
            price: getPrice!,
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
        if (!isShowAddNewSubscriptionType) {
            setGetSubscriptionName("");
            setGetSessionCount(0);
            setGetPrice(0);
        }
    }, [isShowAddNewSubscriptionType]);

    useEffect(function () {
        if (
            !getSubscriptionName?.match(regexSubscriptionName) ||
            getSessionCount == 0 ||
            getPrice == 0
        ) {
            setIsSaveData(false);
        }
        else {
            setIsSaveData(true);
        }
    }, [getSubscriptionName, getSessionCount, getPrice]);


    const totalActivesMenu = useMemo(function () {
        return state.subscriptionsMenus?.filter(ele => ele.isActive == "true" && ele).length || 0;
    }, [state.subscriptionsMenus]);





    return <section>
        {/* Box */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<Captions size={30} />}
                title="مجموع قوائم الاشتراكات"
                total={`${state.subscriptionsMenus?.length} من اصل 6`}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
            />

            <Box
                icon={<Users size={30} />}
                title="مجموع الاشتراكات المفعله"
                total={totalActivesMenu as any}
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
                state.subscriptionsMenus?.length == 0 ?
                    <Not_Found
                        srcImg="not_found_in_subscription_menu.svg"
                        title="لا يوجد قوائم الان"
                    />
                    :
                    state.subscriptionsMenus?.map(ele => <Subscription_Menu_Card
                        key={ele.id}
                        id={ele.id}
                        subscriptionName={ele.subscriptionName}
                        sessionsCount={ele.sessionsCount}
                        price={ele.price}
                        isActive={JSON.parse(ele.isActive)}
                    />)
            }
        </div>


        {/* Add new subscription menu */}
        {
            isShowAddNewSubscriptionType ?
                <Popup_Form
                    titel="إضافة قائمة اشتراك جديد"
                    discription="الان, يمكنك إضافة قائمة اشتراك جديد"
                    className="h-[50vh] flex flex-col justify-between"
                    isSave={isSaveData}
                    clickOnSaveBtn={saveData}
                    clickOnCancel={() => setIsShowAddNewSubscriptionType(false)}
                >
                    <div className="grid grid-cols-2 gap-3 mb-5 px-10">
                        <div>
                            <Inp_With_Label
                                valueOrDefaultValue="value"
                                labelName="اسم الاشتراك"
                                inpValue={getSubscriptionName}
                                onWriteInInput={(e) => setGetSubscriptionName(e.target.value)}
                            />

                            <Max_Min_Length
                                isGreenFlag={getSubscriptionName?.length < 3 || getSubscriptionName?.length > 11}
                                maxLength={11}
                                minLength={getSubscriptionName?.length}
                            />
                        </div>

                        <div>
                            <Inp_With_Label
                                valueOrDefaultValue="value"
                                labelName="عدد الحصص"
                                inpType="number"
                                inpValue={getSessionCount == 0 ? "" : getSessionCount}
                                onWriteInInput={(e) => {
                                    if (+e.target.value >= maxSessions) {
                                        setGetSessionCount(maxSessions);
                                    } else {
                                        setGetSessionCount(+e.target.value);
                                    }
                                }}
                            />

                            <p className="font-bold">
                                الحد الاقصى : {maxSessions}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-2/5">
                            <Inp_With_Label
                                valueOrDefaultValue="value"
                                labelName="السعر"
                                inpType="number"
                                inpValue={getPrice == 0 ? "" : getPrice}
                                onWriteInInput={(e) => {
                                    if (+e.target.value >= maxSubscriptionPrice) {
                                        setGetPrice(maxSubscriptionPrice);
                                    } else {
                                        setGetPrice(+e.target.value)
                                    }
                                }}
                            />

                            <p className="font-bold">
                                الحد الاقصى : {maxSubscriptionPrice}
                            </p>
                        </div>
                    </div>
                </Popup_Form>
                :
                null
        }
    </section>
}