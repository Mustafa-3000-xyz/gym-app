import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import { activeSubscriptions, allMens, allSubscriptions, allTrainers, allWomens, finishedSubscriptions, fromNewToOld, fromOldToNew, pendingSubscriptions, statusIsActive, statusIsFinished, statusIsPending } from "@/Lib/constants";
import { filter_Type, trainer_Type } from "@/Pages/types";
import { Filter_For_Trainers_Props } from "@/Pages/typesProps";
import { store_Type } from "@/Rtk/types";
import { ArrowDown, ArrowUp, ListFilter, Mars, ShieldCheck, ShieldOff, ShieldQuestionMark, ShieldUser, Users, Venus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// ========================================================== //
function Filter(
    { onGetTrainers, onGetBoxInfo }: Filter_For_Trainers_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            trainers: state.trainers
        }
    }, shallowEqual);


    const [filterObj, setFilterObj] = useState<filter_Type>({
        arrange: JSON.parse(localStorage.getItem("filter") as any ?? "{}").arrange ?? fromOldToNew,
        trainers: JSON.parse(localStorage.getItem("filter") as any ?? "{}").trainers ?? allTrainers,
        subscriptionType: JSON.parse(localStorage.getItem("filter") as any ?? "{}").subscriptionType ?? allSubscriptions
    });




    function clickOnArrange(type: string) {
        const obj = {
            ...filterObj,
            arrange: type
        } as filter_Type

        localStorage.setItem("filter", JSON.stringify(obj));
        setFilterObj(obj);
    }

    function clickOnTrainersType(type: string) {
        const obj = {
            ...filterObj,
            trainers: type
        } as filter_Type

        localStorage.setItem("filter", JSON.stringify(obj));
        setFilterObj(obj);
    }

    function clickOnSubscription(type: string) {
        const obj = {
            ...filterObj,
            subscriptionType: type
        } as filter_Type

        localStorage.setItem("filter", JSON.stringify(obj));
        setFilterObj(obj);
    }

    function makeTrainersFilter() {
        if (!state.trainers) return [];

        let resultTrainers: trainer_Type[] = [];
        const resultArrange = [...state.trainers].sort((a, b) => {
            return filterObj.arrange === fromOldToNew ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id);
        });



        if (filterObj.trainers == allTrainers) {
            resultTrainers = resultArrange;
        }
        else if (filterObj.trainers == allMens) {
            resultTrainers = resultArrange.filter(ele => ele.trainerType == "man");
        }
        else {
            resultTrainers = resultArrange.filter(ele => ele.trainerType == "women");
        }
        // ========== //
        if (filterObj.subscriptionType == allSubscriptions) {
            const activeSubscriptionsLength = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsActive).length;
            const pendingSubscriptionsLength = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsPending).length;
            const finishedSubscriptionsLength = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsFinished).length;

            onGetBoxInfo({
                type: "allSubscriptions",
                total: [activeSubscriptionsLength, pendingSubscriptionsLength, finishedSubscriptionsLength],
            });

            return resultTrainers;
        }
        else if (filterObj.subscriptionType == activeSubscriptions) {
            const allActiveSubscriptions = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsActive);

            onGetBoxInfo({
                type: "activeSubscriptions",
                total: allActiveSubscriptions.length,
                styleBgForIcon: "bg-emerald-100 text-emerald-500",
                icon: <ShieldCheck size={30} />
            });

            return allActiveSubscriptions;
        }
        else if (filterObj.subscriptionType == pendingSubscriptions) {
            const allPendingSubscriptions = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsPending);

            onGetBoxInfo({
                type: "activeSubscriptions",
                total: allPendingSubscriptions.length,
                styleBgForIcon: "bg-amber-100 text-amber-500",
                icon: <ShieldQuestionMark size={30} />
            });

            return allPendingSubscriptions;
        }
        else {
            const allFinishedSubscriptions = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsFinished);

            onGetBoxInfo({
                type: "activeSubscriptions",
                total: allFinishedSubscriptions.length,
                styleBgForIcon: "bg-red-100 text-red-500",
                icon: <ShieldOff size={30} />
            });

            return allFinishedSubscriptions;
        }
    }



    useEffect(() => {
        const result = makeTrainersFilter();

        onGetTrainers(result);
    }, [state.trainers, filterObj]);




    return <Drop_Menu classNameForMenu="w-[330px] h-[370px] overflow-y-auto">
        <Top_Content_For_The_Drop className="flex gap-3 items-center ">
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
                        transition duration-300 font-bold rounded-md mb-1 cursor-pointer 
                        ${filterObj.arrange == fromOldToNew ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <ArrowDown size={23} />

                    <p>
                        من اقدم اشتراك الى الاحدث
                    </p>
                </li>

                <li
                    onClick={() => clickOnArrange(fromNewToOld)}
                    className={`
                        p-3
                        flex gap-1 items-center
                        transition duration-300 font-bold rounded-md cursor-pointer 
                        ${filterObj.arrange == fromNewToOld ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                >
                    <ArrowUp size={23} />

                    <p>
                        من احدث اشتراك الى الاقدم
                    </p>
                </li>

                <hr className="my-2" />

                <li
                    className={`
                        p-3
                        flex gap-1 items-center
                        transition duration-300 font-bold rounded-md cursor-pointer 
                        ${filterObj.trainers == allTrainers ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                    onClick={() => clickOnTrainersType(allTrainers)}
                >
                    <Users size={23} />

                    <p>
                        كل المتدربين
                    </p>
                </li>

                <li
                    className={`
                        p-3
                        flex gap-1 items-center my-1
                        transition duration-300 font-bold rounded-md cursor-pointer
                        ${filterObj.trainers == allMens ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"} 
                    `}
                    onClick={() => clickOnTrainersType(allMens)}
                >
                    <Mars size={23} />

                    <p>
                        الذكور
                    </p>
                </li>

                <li
                    className={`
                        p-3
                        flex gap-1 items-center
                        transition duration-300 font-bold rounded-md cursor-pointer 
                        ${filterObj.trainers == allWomens ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"} 
                    `}
                    onClick={() => clickOnTrainersType(allWomens)}
                >
                    <Venus size={23} />

                    <p>
                        الإناث
                    </p>
                </li>

                <hr className="my-2" />

                <li
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold rounded-md cursor-pointer
                        ${filterObj.subscriptionType == allSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                    onClick={() => clickOnSubscription(allSubscriptions)}
                >
                    <ShieldUser size={23} />

                    <p>
                        كل الاشتراكات
                    </p>
                </li>

                <li
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold my-1 rounded-md cursor-pointer
                        ${filterObj.subscriptionType == activeSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                    onClick={() => clickOnSubscription(activeSubscriptions)}
                >
                    <ShieldCheck size={23} />

                    <p>
                        الاشتراكات المُفعله
                    </p>
                </li>

                <li
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold my-1 rounded-md cursor-pointer
                        ${filterObj.subscriptionType == pendingSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                    onClick={() => clickOnSubscription(pendingSubscriptions)}
                >
                    <ShieldQuestionMark size={23} />

                    <p>
                        الاشتراكات المُعلقه
                    </p>
                </li>

                <li
                    className={`
                        p-3 flex gap-3
                        transition duration-300 font-bold rounded-md cursor-pointer
                        ${filterObj.subscriptionType == finishedSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                    `}
                    onClick={() => clickOnSubscription(finishedSubscriptions)}
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

export default React.memo(Filter);