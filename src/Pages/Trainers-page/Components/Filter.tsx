import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import { activeSubscriptions, men, allSubscriptions, allTrainers, women, finishedSubscriptions, fromNewToOld, fromOldToNew, pendingSubscriptions, statusIsActive, statusIsFinished, statusIsPending } from "@/Lib/constants";
import { filter_Type, trainer_Type } from "@/Pages/types";
import { Filter_For_Trainers_Props } from "@/Pages/typesProps";
import { store_Type } from "@/Rtk/types";
import { ArrowDown, ArrowUp, ListFilter, Mars, ShieldCheck, ShieldOff, ShieldQuestionMark, ShieldUser, Users, Venus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// ========================================================== //
function Filter(
    {
        onGetTrainers,
        onGetSubscriptionStatusBox,
        onGetTrainersTypeBox
    }: Filter_For_Trainers_Props
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
            const getMen = resultArrange.filter(ele => ele.trainerType == "man");
            const getWomen = resultArrange.filter(ele => ele.trainerType == "woman");


            onGetTrainersTypeBox({
                type: allTrainers,
                total: [getMen.length, getWomen.length],
            });


            resultTrainers = resultArrange;
        }
        else if (filterObj.trainers == men) {
            const getMen = resultArrange.filter(ele => ele.trainerType == "man");


            onGetTrainersTypeBox({
                type: men,
                total: getMen.length,
                styleBgForIcon: "bg-blue-100 text-blue-500",
                icon: <Mars size={30} />
            });


            resultTrainers = getMen;
        }
        else {
            const getWomen = resultArrange.filter(ele => ele.trainerType == "woman");


            onGetTrainersTypeBox({
                type: women,
                total: getWomen.length,
                styleBgForIcon: "bg-pink-100 text-pink-500",
                icon: <Venus size={30} />
            });


            resultTrainers = getWomen;
        }
        // ========== //
        if (filterObj.subscriptionType == allSubscriptions) {
            const activeSubscriptionsLength = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsActive).length;
            const pendingSubscriptionsLength = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsPending).length;
            const finishedSubscriptionsLength = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsFinished).length;

            onGetSubscriptionStatusBox({
                type: allSubscriptions,
                total: [activeSubscriptionsLength, pendingSubscriptionsLength, finishedSubscriptionsLength],
            });

            return resultTrainers;
        }
        else if (filterObj.subscriptionType == activeSubscriptions) {
            const allActiveSubscriptions = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsActive);

            onGetSubscriptionStatusBox({
                type: activeSubscriptions,
                total: allActiveSubscriptions.length,
                styleBgForIcon: "bg-emerald-100 text-emerald-500",
                icon: <ShieldCheck size={30} />
            });

            return allActiveSubscriptions;
        }
        else if (filterObj.subscriptionType == pendingSubscriptions) {
            const allPendingSubscriptions = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsPending);

            onGetSubscriptionStatusBox({
                type: pendingSubscriptions,
                total: allPendingSubscriptions.length,
                styleBgForIcon: "bg-amber-100 text-amber-500",
                icon: <ShieldQuestionMark size={30} />
            });

            return allPendingSubscriptions;
        }
        else {
            const allFinishedSubscriptions = resultTrainers.filter(ele => ele.subscriptionStatus == statusIsFinished);

            onGetSubscriptionStatusBox({
                type: finishedSubscriptions,
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




    return <Drop_Menu classNameForMenu="overflow-y-auto h-[400px]">
        <Top_Content_For_The_Drop className="flex gap-3 items-center py-3 px-32">
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
                        ${filterObj.trainers == men ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"} 
                    `}
                    onClick={() => clickOnTrainersType(men)}
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
                        ${filterObj.trainers == women ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"} 
                    `}
                    onClick={() => clickOnTrainersType(women)}
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