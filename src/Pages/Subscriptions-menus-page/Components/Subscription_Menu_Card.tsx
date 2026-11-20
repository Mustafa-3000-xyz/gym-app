import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import Toggle_Btn from "@/Global-components/Toggle-btn/Toggle_Btn";
import {  maxSessions, maxSubscriptionPrice } from "@/Lib/constants";
import { customAlert } from "@/Lib/functions";
import { regexSubscriptionName } from "@/Lib/REGEX";
import { subscriptionsMenus_Type } from "@/Pages/types";
import { deleteRowInSubscriptionsMenusTableById, updateAnyPropertyInRowInSubscriptionsMenusTable } from "@/Rtk/Slices/Db-slices/subscriptionsMenusSlice";
import { Pen, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import {useDispatch } from "react-redux";
// ========================================================== //
export default function Subscription_Menu_Card(
    {
        id,
        subscriptionName,
        sessionsCount,
        price,
        isActive
    }: subscriptionsMenus_Type
) {
    const dispatch = useDispatch();



    const [isEditing, setIsEditing] = useState(false);
    const [isSaveChanges, setIsSaveChanges] = useState(false);
    const [isCardActive, setIsCardActive] = useState(isActive);

    const [nameVal, setNameVal] = useState(subscriptionName);
    const [sessionsVal, setSessionsVal] = useState(sessionsCount);
    const [priceVal, setPriceVal] = useState(price);



    function clickOnTrash() {
        customAlert({
            textBeforeSubmitAction: `${subscriptionName} <= هل انت متأكد من انك تريد حذف تلك القائمة`,
            textAfterSubmitAction: "تم حذف القائمه بنجاح",
            runFunctionAfterConfirm: function () {
                dispatch(deleteRowInSubscriptionsMenusTableById(id as any) as any);
            }
        })
    }

    function clickOnPen() {
        setIsEditing(true);
    }

    function clickOnSaveBtn() {
        if (!isSaveChanges) return;

        customAlert({
            textBeforeSubmitAction: "هل انت متأكد من حفظ البيانات الجديده ؟",
            textAfterSubmitAction: "تم التحديث بنجاح",
            runFunctionAfterConfirm: function () {
                dispatch(updateAnyPropertyInRowInSubscriptionsMenusTable({
                    id: id as any,
                    values: {
                        subscriptionName: nameVal,
                        sessionsCount: sessionsVal,
                        price: priceVal
                    }
                }) as any);

                setIsEditing(false);
                setIsSaveChanges(false);
            }
        });
    }

    function clickOnCancel() {
        setIsEditing(false);
        setIsSaveChanges(false);

        setNameVal(subscriptionName);
        setSessionsVal(sessionsCount);
        setPriceVal(price);
    }




    useEffect(function () {
        dispatch(updateAnyPropertyInRowInSubscriptionsMenusTable({
            id: id as any,
            values:{
                isActive: isCardActive
            }
        }) as any);
    }, [isCardActive]);

    useEffect(function () {
        if (
            (nameVal.match(regexSubscriptionName) && nameVal != subscriptionName) ||
            (sessionsVal != 0 && sessionsVal != sessionsCount) ||
            (priceVal != 0 && priceVal != price)
        ) {
            setIsSaveChanges(true);
        }
        else {
            setIsSaveChanges(false);
        }
    }, [nameVal, sessionsVal, priceVal]);




    return <div className="w-105 p-10 rounded-lg select-none bg-slate-100 shadow-md">
        <div className="flex flex-col justify-center mb-5 px-4 w-full">
            {isEditing ?
                <>
                    <input
                        type="text"
                        value={nameVal}
                        onChange={(e) => setNameVal(e.target.value)}
                        className="text-3xl text-center border-2 border-slate-200 p-2 focus:outline-0 font-bold w-full! rounded-lg"
                    />

                    <Max_Min_Length
                        isGreenFlag={nameVal.match(regexSubscriptionName) ? true : false}
                        maxLength={11}
                        minLength={nameVal.length}
                    />
                </>
                :
                <h3 className="text-3xl text-center font-bold w-full">{subscriptionName}</h3>
            }
        </div>

        <ul className="font-bold space-y-3">
            <li className="flex items-center gap-2">
                <span>عدد الحصص :</span>

                {isEditing ?
                    <input
                        type="number"
                        className="text-center border-b-2 focus:outline-0 w-20 font-bold"
                        value={sessionsVal == 0 ? "" : sessionsVal}
                        onChange={(e) => {
                            if (+e.target.value >= maxSessions) {
                                setSessionsVal(maxSessions);
                            }
                            else {
                                setSessionsVal(+e.target.value);
                            }
                        }}
                    />
                    :
                    <span>{sessionsCount}</span>
                }
            </li>

            <li className="flex items-center gap-2">
                <span>السعر : </span>

                {isEditing ?
                    <input
                        type="number"
                        className="text-center border-b-2 focus:outline-0 w-20 font-bold"
                        value={priceVal == 0 ? "" : priceVal}
                        onChange={(e) => {
                            if (+e.target.value >= maxSubscriptionPrice) {
                                setPriceVal(maxSubscriptionPrice);
                            }
                            else {
                                setPriceVal(+e.target.value);
                            }
                        }}
                    />
                    :
                    <span>{price}</span>
                }
            </li>

            <li>
                حالة الاشتراك :
                <span className={`${isActive ? "text-emerald-500" : "text-red-500"} ms-1`}>
                    {isActive ? "مفعل" : "غير مفعل"}
                </span>
            </li>
        </ul>

        <hr className="my-10" />

        {/* Pen & trash & save & cancel */}
        <div className="flex justify-between items-center">
            <Toggle_Btn
                value={isCardActive as any}
                disabled={false}
                onGetValue={setIsCardActive as any}
            />

            <div className="flex items-center gap-2">
                {isEditing ?
                    <>
                        <X
                            className="duration-300 cursor-pointer hover:scale-125 text-red-500"
                            onClick={clickOnCancel}
                        />

                        <Save
                            size={25}
                            className={`
                                duration-300 
                                ${isSaveChanges ? "text-emerald-500 cursor-pointer hover:scale-125" : "text-gray-400 cursor-not-allowed"}
                            `}
                            onClick={clickOnSaveBtn}
                        />
                    </>
                    :
                    <>
                        <Pen
                            size={25}
                            className={`
                                duration-300 
                                hover:text-emerald-300 hover:scale-125 cursor-pointer text-emerald-500
                            `}
                            onClick={clickOnPen}
                        />

                        <Trash
                            size={25}
                            className={`
                                duration-300
                                hover:text-red-600 hover:scale-125 cursor-pointer text-red-500
                            `}
                            onClick={clickOnTrash}
                        />
                    </>
                }
            </div>
        </div>
    </div>
}