import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import { activeSubscriptions, allSubscriptions, finishedSubscriptions, fromNewToOld, fromOldToNew, pendingSubscriptions, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import { box_Info_In_Trainers_Page, filter, Filter_For_Trainers_Props, trainer } from "@/Pages/types";
import { store_Type } from "@/Rtk/types";
import { ArrowDown, ArrowUp, ListFilter, ShieldCheck, ShieldOff, ShieldQuestionMark, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// ========================================================== //
export default function Filter(
    { onGetTrainers, onGetBoxInfo }: Filter_For_Trainers_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            trainers: state.trainers
        }
    }, shallowEqual);
    const [filterObj, setFilterObj] = useState<filter>({
        arrange: JSON.parse(localStorage.getItem("filter") as any ?? "{}").arrange ?? fromOldToNew,
        subscriptionType: JSON.parse(localStorage.getItem("filter") as any ?? "{}").subscriptionType ?? allSubscriptions
    });




    function makeBoxInfo(): box_Info_In_Trainers_Page | undefined {
        if (!filterObj) return;

        const obj = {
            name: "",
            styleBgForIcon: "",
            icon: <ShieldCheck size={30} />,
            total: 0 as any,
        }

        if (filterObj.subscriptionType == allSubscriptions || filterObj.subscriptionType == activeSubscriptions) {
            obj.name = "مجموع الاشتراكات المفعله";
            obj.styleBgForIcon = "bg-emerald-100 text-emerald-500";
            obj.total = state.trainers?.filter(ele => ele.subscriptionState == stateIsActive).length;
            obj.icon = <ShieldCheck size={30} />;
        }
        else if (filterObj.subscriptionType == pendingSubscriptions) {
            obj.name = "مجموع الاشتراكات المُعلقه";
            obj.styleBgForIcon = "bg-amber-100 text-amber-500";
            obj.total = state.trainers?.filter(ele => ele.subscriptionState == stateIsPending).length;
            obj.icon = <ShieldQuestionMark size={30} />;
        }
        else {
            obj.name = "مجموع الاشتراكات المنتهيه";
            obj.styleBgForIcon = "bg-red-100 text-red-500";
            obj.total = state.trainers?.filter(ele => ele.subscriptionState == stateIsFinished).length;
            obj.icon = <ShieldOff size={30} />;
        }


        return obj
    }

    function clickOnArrange(type: string) {
        const obj = {
            ...filterObj,
            arrange: type
        } as filter

        setFilterObj(obj);
    }

    function clickOnSubscription(type: string) {
        const obj = {
            ...filterObj,
            subscriptionType: type
        } as filter

        setFilterObj(obj);
    }

    function makeTrainersFilter(): trainer[] {
        let arr: trainer[] = [];
        const resultArrange = [...state.trainers as any].sort(function (a, b) {
            if (filterObj.arrange == fromOldToNew) {
                return Number(a.id) - Number(b.id);
            }
            else {
                return Number(b.id) - Number(a.id);
            }
        });



        if (filterObj.subscriptionType == allSubscriptions) {
            arr = resultArrange;
        }
        else if (filterObj.subscriptionType == activeSubscriptions) {
            resultArrange.forEach(ele => ele.subscriptionState == stateIsActive && arr.push(ele));
        }
        else if (filterObj.subscriptionType == pendingSubscriptions) {
            resultArrange.forEach(ele => ele.subscriptionState == stateIsPending && arr.push(ele));
        }
        else {
            resultArrange.forEach(ele => ele.subscriptionState == stateIsFinished && arr.push(ele));
        }

        return arr;
    }



    useEffect(function () {
        const result = makeTrainersFilter();
        const result2 = makeBoxInfo();


        onGetTrainers(result);
        onGetBoxInfo(result2 as any);
        localStorage.setItem("filter", JSON.stringify(filterObj) as any);
    }, [state.trainers, filterObj]);




    return <Drop_Menu classNameForMenu="w-[330px]">
        <Top_Content_For_The_Drop className="flex gap-3 items-center">
            <ListFilter size={23} />
            <h4 className="text-lg font-bold">تصنيف</h4>
        </Top_Content_For_The_Drop>

        <Bottom_Content_For_The_Drop>
            <ul>
                <li
                    onClick={() => clickOnArrange(fromOldToNew)}
                    className={`
                        p-3
                        flex gap-1 items-center
                        transition duration-300 font-bold rounded-md mb-2 cursor-pointer 
                        ${filterObj.arrange == fromOldToNew ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <ArrowDown size={23} className=' mt-1' />

                    <p>
                        من اقدم اشتراك الى الاحدث
                    </p>
                </li>

                <li
                    onClick={() => clickOnArrange(fromNewToOld)}
                    className={`
                        p-3
                        flex gap-1 items-center
                        transition duration-300 font-bold rounded-md mb-2 cursor-pointer 
                        ${filterObj.arrange == fromNewToOld ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <ArrowUp size={23} className=' mt-1' />

                    <p>
                        من احدث اشتراك الى الاقدم
                    </p>
                </li>

                <hr />

                <li
                    onClick={() => clickOnSubscription(allSubscriptions)}
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold my-2 rounded-md cursor-pointer
                        ${filterObj.subscriptionType == allSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <Users size={23} />

                    <p>
                        كل المتدربين
                    </p>
                </li>

                <li
                    onClick={() => clickOnSubscription(activeSubscriptions)}
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold my-2 rounded-md cursor-pointer
                        ${filterObj.subscriptionType == activeSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <ShieldCheck size={23} />

                    <p>
                        الاشتراكات المُفعله
                    </p>
                </li>

                <li
                    onClick={() => clickOnSubscription(pendingSubscriptions)}
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold my-2 rounded-md cursor-pointer
                        ${filterObj.subscriptionType == pendingSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <ShieldQuestionMark size={23} />

                    <p>
                        الاشتراكات المُعلقه
                    </p>
                </li>

                <li
                    onClick={() => clickOnSubscription(finishedSubscriptions)}
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold my-2 rounded-md cursor-pointer
                        ${filterObj.subscriptionType == finishedSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <ShieldOff size={23} />

                    <p>
                        الاشتراكات المنتهيه
                    </p>
                </li>
            </ul>
        </Bottom_Content_For_The_Drop>
    </Drop_Menu>
}