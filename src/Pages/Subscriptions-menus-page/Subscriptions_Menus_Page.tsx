import Box from "@/Global-components/Box/Box";
import { Captions, Pen, Plus, Save, ShieldCheck, Trash, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import Popup_Component from "@/Global-components/Popup-component/Popup_Component";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { addRowInSubscriptionsMenusTable, deleteRowInSubscriptionsMenusTableById, updateAnyPropertyInRowInSubscriptionsMenusTable } from "@/Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { customAlert, normalAlert } from "@/Lib/functions";
import { regexSubscriptionName } from "@/Lib/REGEX";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { maxSessions, maxSubscriptionPrice } from "@/Lib/constants";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { InputText } from "primereact/inputtext";
import Toggle_Btn from "@/Global-components/Toggle-btn/Toggle_Btn";
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
    const [isEditing, setIsEditing] = useState(false);

    const [subscriptionMenuId, setSubscriptionMenuId] = useState(-1);

    const [subscriptionName, setSubscriptionName] = useState<string>("");
    const [sessionCount, setSessionCount] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);


    const totalActivesMenu = useMemo(function () {
        return state.subscriptionsMenus?.filter(ele => ele.isActive == "true" && ele).length || 0;
    }, [state.subscriptionsMenus]);


    const handleAddNewSubscriptionMenu = useCallback(function () {
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
    }, [state.subscriptionsMenus?.length]);

    const handleSaveData = useCallback(function () {
        const errorsMessagesList = [];

        if (!subscriptionName.match(regexSubscriptionName)) {
            errorsMessagesList.push("يجب اسم القائمه لا تقل عن ثلاثة احرف ولا تزيد عن احدى عشر حرف");
        }

        if (!sessionCount) {
            errorsMessagesList.push("يجب كتابة عدد الحصص");
        }

        if (!price) {
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
                subscriptionName: subscriptionName,
                sessionsCount: sessionCount,
                price: price,
                isActive: "true"
            }) as any);

            normalAlert({
                title: "تمت العمليه بنجاح",
                text: "لقد تم إضافة قائمة جديده",
                icon: "success"
            })

            setIsShowAddNewSubscriptionType(false);
        }
    }, [subscriptionName, sessionCount, price]);

    const handleCancel = useCallback(function () {
        if (subscriptionName || sessionCount || price) {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل عدم استكمال كتابة البيانات ؟",
                runFunctionAfterConfirm: () => {
                    setIsShowAddNewSubscriptionType(false);
                    setSubscriptionName("");
                    setSessionCount(0);
                    setPrice(0);
                }
            })
        }
        else {
            setIsShowAddNewSubscriptionType(false);
            setSubscriptionName("");
            setSessionCount(0);
            setPrice(0);
        }
    }, [subscriptionName, sessionCount, price]);

    const handleClickOnTrash = useCallback(function (id: number) {
        customAlert({
            textBeforeSubmitAction: `هل انت متأكد من انك تريد حذف تلك القائمة ؟`,
            textAfterSubmitAction: "تم حذف القائمه بنجاح",
            runFunctionAfterConfirm: function () {
                dispatch(deleteRowInSubscriptionsMenusTableById(id) as any);
            }
        })
    }, []);

    const handleClickOnCancelChanges = useCallback(function () {
        setIsEditing(false);
        setSubscriptionMenuId(-1);

        setSubscriptionName("");
        setSessionCount(0);
        setPrice(0);
    }, []);

    const handleClickOnSaveChangesBtn = useCallback(function (id: number, name: string, sessions: number, thePrice: number) {
        if (
            name == subscriptionName
            &&
            sessions == sessionCount
            &&
            thePrice == price
        ) {
            normalAlert({
                title: "هممم",
                text: "لا يوجد اي تغيرات",
                icon: "info"
            });

            return;
        }


        const errorsMessagesList = [];

        if (!subscriptionName.match(regexSubscriptionName)) {
            errorsMessagesList.push("يجب اسم القائمه لا تقل عن ثلاثة احرف ولا تزيد عن احدى عشر حرف");
        }

        if (!sessionCount) {
            errorsMessagesList.push("يجب كتابة عدد الحصص");
        }

        if (!price) {
            errorsMessagesList.push("يجب كتابة سعر القائمه");
        }



        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات خاطئه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });
        }
        else {
            customAlert({
                textBeforeSubmitAction: "هل تود بالفعل حفظ التغيرات الجديده ؟",
                textAfterSubmitAction: "تم الحفظ بنجاح",
                runFunctionAfterConfirm: function () {
                    dispatch(updateAnyPropertyInRowInSubscriptionsMenusTable({
                        id: id as any,
                        values: {
                            subscriptionName: subscriptionName,
                            sessionsCount: sessionCount,
                            price: price
                        }
                    }) as any);


                    setIsEditing(false);
                    setSubscriptionMenuId(-1);

                    setSubscriptionName("");
                    setSessionCount(0);
                    setPrice(0);
                }
            });
        }
    }, [subscriptionName, sessionCount, price]);

    const handleClickOnActiveBtn = useCallback(function (id: number, value: boolean) {
        dispatch(updateAnyPropertyInRowInSubscriptionsMenusTable({
            id: id as any,
            values: {
                isActive: JSON.stringify(value) as any
            }
        }) as any);

    }, []);



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
                onClick={handleAddNewSubscriptionMenu}
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
                    state.subscriptionsMenus?.map(ele => <div
                        key={ele.id}
                        className="w-105 p-10 rounded-lg select-none bg-slate-100 shadow-md"
                    >
                        {/* Subscription name */}
                        <div className="flex flex-col justify-center mb-5 px-4 w-full">
                            {isEditing && subscriptionMenuId == ele.id ?
                                <>
                                    <InputText
                                        type="text"
                                        value={subscriptionName}
                                        onChange={(e) => setSubscriptionName(e.target.value)}
                                        className="text-3xl text-center border-2 border-slate-200 p-2 focus:outline-0 font-bold w-full! rounded-lg"
                                    />

                                    <Max_Min_Length
                                        isGreenFlag={subscriptionName.match(regexSubscriptionName) ? true : false}
                                        maxLength={11}
                                        minLength={subscriptionName.length}
                                    />
                                </>
                                :
                                <h3 className="text-3xl text-center font-bold w-full">{ele.subscriptionName}</h3>
                            }
                        </div>

                        <ul className="font-bold space-y-3">
                            <li className="flex items-center gap-2">
                                <span>عدد الحصص :</span>

                                {isEditing && subscriptionMenuId == ele.id ?
                                    <InputText
                                        type="number"
                                        className="text-center border-b-2 focus:outline-0 w-40 font-bold"
                                        value={sessionCount == 0 ? "" : sessionCount as any}
                                        onChange={(e) => {
                                            if (Number(e.target.value) >= maxSessions) {
                                                setSessionCount(maxSessions);
                                            }
                                            else {
                                                setSessionCount(Number(e.target.value));
                                            }
                                        }}
                                    />
                                    :
                                    <span>{ele.sessionsCount}</span>
                                }
                            </li>

                            <li className="flex items-center gap-2">
                                <span>السعر : </span>

                                {isEditing && subscriptionMenuId == ele.id ?
                                    <InputText
                                        type="number"
                                        className="text-center border-b-2 focus:outline-0 w-40 font-bold"
                                        value={price == 0 ? "" : price as any}
                                        onChange={(e) => {
                                            if (Number(e.target.value) >= maxSubscriptionPrice) {
                                                setPrice(maxSubscriptionPrice);
                                            }
                                            else {
                                                setPrice(Number(e.target.value));
                                            }
                                        }}
                                    />
                                    :
                                    <span>{ele.price}</span>
                                }
                            </li>

                            <li>
                                حالة الاشتراك :
                                <span className={`${JSON.parse(ele.isActive) ? "text-emerald-500" : "text-red-500"} ms-1`}>
                                    {JSON.parse(ele.isActive) ? "مفعل" : "غير مفعل"}
                                </span>
                            </li>
                        </ul>

                        <div className="flex items-center justify-between mt-10">
                            <Toggle_Btn
                                value={JSON.parse(ele.isActive)}
                                disabled={false}
                                onGetValue={(value) => handleClickOnActiveBtn(Number(ele.id), value)}
                            />

                            {/* Btns */}
                            <div className="flex items-center gap-2 justify-end mt-5">
                                {
                                    isEditing && subscriptionMenuId == ele.id ?
                                        <>
                                            <Custom_Btn
                                                onClick={handleClickOnCancelChanges}
                                            >
                                                <X size={25} />
                                            </Custom_Btn>

                                            <Custom_Btn
                                                className="bg-emerald-500! border-emerald-600! px-7!"
                                                onClick={() => handleClickOnSaveChangesBtn(Number(ele.id), ele.subscriptionName, ele.sessionsCount, ele.price)}
                                            >
                                                <Save size={25} />
                                            </Custom_Btn>
                                        </>
                                        :
                                        <>
                                            <Custom_Btn
                                                onClick={() => handleClickOnTrash(Number(ele.id))}
                                            >
                                                <Trash size={25} />
                                            </Custom_Btn>

                                            <Custom_Btn
                                                className="bg-emerald-500! border-emerald-600! px-4!"
                                                onClick={() => {
                                                    setSubscriptionName(ele.subscriptionName);
                                                    setSessionCount(ele.sessionsCount);
                                                    setPrice(ele.price);
                                                    setIsEditing(true);
                                                    setSubscriptionMenuId(Number(ele.id));
                                                }}
                                            >
                                                <Pen size={25} />
                                            </Custom_Btn>
                                        </>
                                }
                            </div>
                        </div>
                    </div>)
            }
        </div>


        {/* Add new subscription menu */}
        {
            isShowAddNewSubscriptionType ?
                <Popup_Component
                    title="إضافة قائمه جديده"
                    classNameForContainer="h-fit"
                    clickOnSaveBtn={handleSaveData}
                    clickOnCancel={handleCancel}
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
                                value={subscriptionName}
                                onChange={(e) => setSubscriptionName(e.target.value)}
                            />

                            <small
                                id="username-help"
                                className="text-[15px] font-bold"
                            >
                                <Max_Min_Length
                                    isGreenFlag={subscriptionName.match(regexSubscriptionName) ? true : false}
                                    maxLength={11}
                                    minLength={subscriptionName?.length}
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
                                value={sessionCount == 0 ? "" : sessionCount as any}
                                onChange={(e) => {
                                    if (Number(e.target.value) >= maxSessions) {
                                        setSessionCount(maxSessions);
                                    } else {
                                        setSessionCount(Number(e.target.value));
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
                                value={price == 0 ? "" : price as any}
                                onChange={(e) => {
                                    if (Number(e.target.value) >= maxSubscriptionPrice) {
                                        setPrice(maxSubscriptionPrice);
                                    } else {
                                        setPrice(Number(e.target.value))
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