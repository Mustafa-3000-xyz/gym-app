import Box from "@/Global-components/Box/Box";
import { Captions, Plus, ShieldCheck } from "lucide-react";
import Subscription_Menu_Card from "./Components/Subscription_Menu_Card";
import { useEffect, useMemo, useState } from "react";
import Popup_Component from "@/Global-components/Popup-component/Popup_Component";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { addRowInSubscriptionsMenusTable } from "@/Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { customAlert, normalAlert } from "@/Lib/functions";
import { regexSubscriptionName } from "@/Lib/REGEX";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { maxSessions, maxSubscriptionPrice } from "@/Lib/constants";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { InputText } from "primereact/inputtext";
// ========================================================== //
export default function Subscriptions_Menu_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            subscriptionsMenus: state.subscriptionsMenus,
        }
    }, shallowEqual);

    const [isShowAddNewSubscriptionType, setIsShowAddNewSubscriptionType] = useState(false);

    const [getSubscriptionName, setGetSubscriptionName] = useState<string>("");
    const [getSessionCount, setGetSessionCount] = useState<number>(0);
    const [getPrice, setGetPrice] = useState<number>(0);




    function addNewSubscriptionMenu() {
        if (Number(state.subscriptionsMenus?.length) < 6) {
            setIsShowAddNewSubscriptionType(true);
        }
        else if (Number(state.subscriptionsMenus?.length) >= 6) {
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
        const errorsMessagesList = [];

        if (!getSubscriptionName.match(regexSubscriptionName)) {
            errorsMessagesList.push("يجب اسم القائمه لا تقل عن ثلاثة احرف ولا تزيد عن احدى عشر حرف");
        }

        if (!getSessionCount) {
            errorsMessagesList.push("يجب كتابة عدد الحصص");
        }

        if (!getPrice) {
            errorsMessagesList.push("يجب كتابة سعر القائمه")
        }


        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات خاطئه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });
        }
        else {
            dispatch(addRowInSubscriptionsMenusTable({
                subscriptionName: getSubscriptionName,
                sessionsCount: getSessionCount,
                price: getPrice,
                isActive: "true"
            }) as any);

            normalAlert({
                title: "تمت العمليه بنجاح",
                text: "لقد تم إضافة قائمة جديده",
                icon: "success"
            })

            setIsShowAddNewSubscriptionType(false);
        }
    }

    function cancel() {
        if (getSubscriptionName || getSessionCount || getPrice) {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل عدم استكمال كتابة البيانات ؟",
                runFunctionAfterConfirm: () => setIsShowAddNewSubscriptionType(false)
            })
        }
        else {
            setIsShowAddNewSubscriptionType(false)
        }
    }




    useEffect(function () {
        if (!isShowAddNewSubscriptionType) {
            setGetSubscriptionName("");
            setGetSessionCount(0);
            setGetPrice(0);
        }
    }, [isShowAddNewSubscriptionType]);


    const totalActivesMenu = useMemo(function () {
        return state.subscriptionsMenus?.filter(ele => ele.isActive == "true" && ele).length || 0;
    }, [state.subscriptionsMenus]);





    return <section className="mt-10">
        {/* Box */}
        <div className="grid grid-cols-2 gap-3 mb-5">
            <Box
                icon={<Captions size={30} />}
                title="مجموع قوائم الاشتراكات"
                total={`${state.subscriptionsMenus?.length} من اصل 6`}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
            />

            <Box
                icon={<ShieldCheck size={30} />}
                title="مجموع الاشتراكات المفعله"
                total={totalActivesMenu as any}
                styleIcon="bg-neutral-200 text-neutral-500"
            />
        </div>

        {/* Add new subscription menu */}
        <div className="mb-20">
            <Custom_Btn
                className="flex cursor-pointer w-full py-7 !bg-emerald-500 !border-emerald-600"
                onClick={addNewSubscriptionMenu}
            >
                <div className="flex items-center justify-center w-full gap-2">
                    <Plus size={20} strokeWidth={3} />

                    <h3 className="text-lg font-bold mb-1">
                        إضافة قائمه جديده
                    </h3>
                </div>
            </Custom_Btn>
        </div>

        {/* All subscriptions menu */}
        <div className="flex justify-center items-center flex-wrap gap-3">
            {
                state.subscriptionsMenus?.length == 0 ?
                    <Not_Found
                        srcImg="/not_found_for_boxes.svg"
                        title="لا يوجد قوائم"
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
                <Popup_Component
                    title="إضافة قائمه جديده"
                    classNameForContainer="h-fit"
                    clickOnSaveBtn={saveData}
                    clickOnCancel={cancel}
                >
                    {/* Top */}
                    <div className="grid grid-cols-2 gap-3 mb-5 px-10">
                        {/* Subscription name */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-bold">
                                اسم القائمه
                            </label>

                            <InputText
                                className="h-10 text-center!"
                                value={getSubscriptionName}
                                onChange={(e) => setGetSubscriptionName(e.target.value)}
                            />

                            <small
                                id="username-help"
                                className="text-[15px] font-bold"
                            >
                                <Max_Min_Length
                                    isGreenFlag={getSubscriptionName.match(regexSubscriptionName) ? true : false}
                                    maxLength={11}
                                    minLength={getSubscriptionName?.length}
                                />
                            </small>
                        </div>

                        {/* Session count */}
                        <div className="flex flex-col">
                            <label className="mb-1 font-bold">
                                عدد الحصص
                            </label>

                            <InputText
                                type="number"
                                className="h-10 text-center!"
                                value={getSessionCount == 0 ? "" : getSessionCount as any}
                                onChange={(e) => {
                                    if (Number(e.target.value) >= maxSessions) {
                                        setGetSessionCount(maxSessions);
                                    } else {
                                        setGetSessionCount(Number(e.target.value));
                                    }
                                }}
                            />

                            <small
                                id="username-help"
                                className="text-[15px] font-bold"
                            >
                                <p className="font-bold">
                                    الحد الاقصى : {maxSessions}
                                </p>
                            </small>
                        </div>
                    </div>


                    {/* Price */}
                    <div className="flex justify-center">
                        <div className="flex flex-col w-1/2">
                            <label className="mb-1 font-bold">
                                السعر
                            </label>

                            <InputText
                                type="number"
                                className="h-10 text-center!"
                                value={getPrice == 0 ? "" : getPrice as any}
                                onChange={(e) => {
                                    if (Number(e.target.value) >= maxSubscriptionPrice) {
                                        setGetPrice(maxSubscriptionPrice);
                                    } else {
                                        setGetPrice(Number(e.target.value))
                                    }
                                }}
                            />

                            <small
                                id="username-help"
                                className="text-[15px] font-bold"
                            >
                                <p className="font-bold">
                                    الحد الاقصى : {maxSubscriptionPrice}
                                </p>
                            </small>
                        </div>
                    </div>
                </Popup_Component>
                :
                null
        }
    </section>
}