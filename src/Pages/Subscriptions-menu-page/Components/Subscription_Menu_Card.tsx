import Toggle_Btn from "@/Global-components/Toggle-btn/Toggle_Btn";
import { alert } from "@/Lib/functions";
import { subscriptionsMenu } from "@/Pages/types";
import { deleteSubscriptionMenuById, updatePropertyInSubscriptionMenu, updateSomePropertiesInSubscriptionMenu } from "@/Rtk/Slices/subscriptionsMenuSlice";
import { ArrowDownToLine, Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Subscription_Menu_Card(
    {
        id,
        subscriptionName,
        sessionsCount,
        price,
        trainersTotal,
        isActive
    }: subscriptionsMenu
) {
    const dispatch = useDispatch();

    const [getValueForIsActive, setGetValueForIsActive] = useState(isActive);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaveChanges, setIsSaveChanges] = useState(false);

    const [nameVal, setNameVal] = useState(subscriptionName);
    const [sessionsVal, setSessionsVal] = useState(sessionsCount);
    const [priceVal, setPriceVal] = useState(price);




    function removeMenu() {
        alert({
            titleBeforeClickOnOk: `${subscriptionName} <= هل انت متأكد من انك تريد حذف تلك القائمة`,
            titleAfterClickOnOk: "تم حذف القائمه بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(deleteSubscriptionMenuById(id as any) as any);
            }
        })
    }


    function clickOnSaveBtn() {
        if (!isSaveChanges) return;

        if (nameVal != subscriptionName || sessionsVal != sessionsCount || priceVal != price) {
            alert({
                titleBeforeClickOnOk: "هل انت متأكد من حفظ البيانات الجديده ؟",
                titleAfterClickOnOk: "تم التحديث بنجاح",
                funRunWhenClickOnOk: function () {
                    dispatch(updateSomePropertiesInSubscriptionMenu({
                        id: id as any,
                        values: {
                            subscriptionName: nameVal,
                            sessionsCount: sessionsVal,
                            price: priceVal
                        }
                    }) as any);
                }
            })
        }


        setIsEditing(false);
    }




    useEffect(function () {
        dispatch(updatePropertyInSubscriptionMenu({
            id: id as any,
            value: getValueForIsActive,
            column: "isActive"
        }) as any);
    }, [getValueForIsActive]);



    useEffect(function () {
        if (nameVal != "" && sessionsVal != 0 && priceVal != 0) {
            setIsSaveChanges(true);
        }
        else {
            setIsSaveChanges(false);
        }
    }, [nameVal, sessionsVal, priceVal]);




    return <div className="w-[420px] p-10 rounded-lg select-none bg-slate-100 shadow-md">
        <div className="flex justify-center text-3xl mb-10">
            {isEditing ?
                <input
                    type="text"
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    className="text-center border-b-2 focus:outline-0 w-2/3 font-bold"
                />
                :
                <h3 className="text-center font-bold">{subscriptionName}</h3>
            }
        </div>

        <ul className="font-bold space-y-3">
            <li className="flex items-center gap-2">
                <span>عدد الحصص :</span>

                {isEditing ?
                    <input
                        type="number"
                        value={sessionsVal}
                        onChange={(e) => setSessionsVal(e.target.value as any)}
                        className="text-center border-b-2 focus:outline-0 w-20 font-bold"
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
                        value={priceVal}
                        onChange={(e) => setPriceVal(e.target.value as any)}
                        className="text-center border-b-2 focus:outline-0 w-20 font-bold"
                    />
                    :
                    <span>{price}</span>
                }
            </li>

            <li>إجمالي المشتركين : {trainersTotal}</li>
        </ul>

        <hr className="my-10" />

        <div className="flex justify-between items-center">
            <Toggle_Btn
                value={getValueForIsActive as any}
                onGetValue={setGetValueForIsActive as any}
            />

            <div className="flex items-center gap-2">
                {isEditing ?
                    <ArrowDownToLine
                        size={25}
                        className={`
                            duration-300 
                            ${isSaveChanges ? "text-emerald-500 cursor-pointer hover:scale-125" : "text-gray-400 cursor-not-allowed"}
                        `}
                        onClick={clickOnSaveBtn}
                    />
                    :
                    <Pen
                        size={25}
                        className="duration-300 hover:text-emerald-300 hover:scale-125 cursor-pointer text-emerald-500"
                        onClick={() => setIsEditing(true)}
                    />
                }

                <Trash
                    size={25}
                    className="duration-300 hover:text-red-600 hover:scale-125 cursor-pointer text-red-500"
                    onClick={removeMenu}
                />
            </div>
        </div>
    </div>
}