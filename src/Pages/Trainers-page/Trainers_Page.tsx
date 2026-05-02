import { ArrowDown, ArrowUp, BicepsFlexed, ListFilter, ShieldCheck, ShieldOff, ShieldQuestionMark, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { filter, trainer } from "@/Pages/types";
import Trainer_Details from "./Components/Trainer-details/Trainer_Details";
import Add_Trainer from "./Components/Add-trainer/Add_Trainer";
import Search_Trainer from "./Components/Search-trainer/Search_Trainer";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrainers } from "@/Rtk/Slices/trainersSlice";
import { store_Type } from "@/Rtk/types";
import Box from "@/Global-components/Box/Box";
import { activeSubscriptions, allSubscriptions, finishedSubscriptions, fromNewToOld, fromOldToNew, pendingSubscriptions, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import { useAtomValue } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import Table_For_Trainers from "@/Global-components/Table-for-trainers/Table_For_Trainers";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
// ========================================================== //
export default function Trainers_Page() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);


    const [trainersListAfterFilter, setTrainersListAfterFilter] = useState<trainer[]>([]);
    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);


    const [filterObj, setFilterObj] = useState<filter>({
        arrange: JSON.parse(localStorage.getItem("filter") as any ?? "{}").arrange ?? fromOldToNew,
        subscriptionType: JSON.parse(localStorage.getItem("filter") as any ?? "{}").subscriptionType ?? allSubscriptions
    });
    const [boxInfo, setBoxInfo] = useState({
        name: "",
        total: 0,
        styleBg: "",
        icon: <ShieldCheck size={30} />
    });


    const [
        allActiveSubscriptions,
        allPendingSubscriptions,
        allFinishedSubscriptions
    ] = useMemo(function () {
        const allActiveSubscriptions = state.trainers.filter(ele => ele.subscriptionState == stateIsActive).length;
        const allPendingSubscriptions = state.trainers.filter(ele => ele.subscriptionState == stateIsPending).length;
        const allFinishedSubscriptions = state.trainers.filter(ele => ele.subscriptionState == stateIsFinished).length;


        return [allActiveSubscriptions, allPendingSubscriptions, allFinishedSubscriptions];
    }, [state.trainers]);






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

    function makeBoxInfo() {
        if (!filterObj) return;

        if (filterObj.subscriptionType == allSubscriptions || filterObj.subscriptionType == activeSubscriptions) {
            setBoxInfo({
                name: "مجموع الاشتراكات المفعله",
                styleBg: "bg-emerald-100 text-emerald-500",
                total: allActiveSubscriptions,
                icon: <ShieldCheck size={30} />
            });
        }
        else if (filterObj.subscriptionType == pendingSubscriptions) {
            setBoxInfo({
                name: "مجموع الاشتراكات المُعلقه",
                styleBg: "bg-amber-100 text-amber-500",
                total: allPendingSubscriptions,
                icon: <ShieldQuestionMark size={30} />
            });
        }
        else if (filterObj.subscriptionType == finishedSubscriptions) {
            setBoxInfo({
                name: "مجموع الاشتراكات المنتهيه",
                styleBg: "bg-red-100 text-red-500",
                total: allFinishedSubscriptions,
                icon: <ShieldOff size={30} />
            });
        }
    }

    function getTrainersListAfterFilter(): trainer[] {
        let arr: trainer[] = [];


        // clone the list before sorting to avoid mutating props or frozen data
        const resultArrange = [...state.trainers].sort(function (a, b) {
            if (filterObj.arrange == fromOldToNew) {
                return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            }
            else {
                return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            }
        });



        if (filterObj.subscriptionType == allSubscriptions) {
            resultArrange.forEach(ele => arr.push(ele));
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
        dispatch(getAllTrainers() as any);
    }, []);

    useEffect(function () {
        const result = getTrainersListAfterFilter();


        makeBoxInfo();
        setTrainersListAfterFilter(result);
        localStorage.setItem("filter", JSON.stringify(filterObj) as any);
    }, [state.trainers, filterObj]);




    return <section>
        {/* Boxes */}
        <div className="mb-7 grid grid-cols-3 gap-3">
            <Box
                icon={<BicepsFlexed size={30} />}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                title="مجموع المتدربين"
                total={state.trainers.length}
            />

            <Box
                icon={<Users size={30} />}
                styleIcon="bg-neutral-200 text-neutral-500"
                title="حضور اليوم"
                total={232344324}
            />

            <Box
                icon={boxInfo.icon}
                styleIcon={boxInfo.styleBg}
                title={boxInfo.name}
                total={boxInfo.total}
            />
        </div>

        {/* Search & filter & add trainer */}
        <div className="grid grid-cols-4 gap-2 mb-7 bg-slate-100 rounded-lg py-5 px-3">
            <div className="col-span-3">
                <Search_Trainer trainersList={state.trainers} />
            </div>

            {/* filter & add trainer */}
            <div className="flex justify-end gap-1 col-span-1">
                <Drop_Menu
                    title="تصنيف"
                    icon={<ListFilter size={23} />}
                >
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
                            p-3
                            flex items-center justify-between
                            transition duration-300 font-bold my-2 rounded-md cursor-pointer
                            ${filterObj.subscriptionType == allSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                        `}
                        >
                            <div className='  flex gap-1 items-center'>
                                <Users size={23} />

                                <p>
                                    كل المتدربين
                                </p>
                            </div>

                            <p>
                                ( {state.trainers.length >= 99 ? `99+` : state.trainers.length} )
                            </p>
                        </li>

                        <li
                            onClick={() => clickOnSubscription(activeSubscriptions)}
                            className={`
                            p-3
                            flex items-center justify-between
                            transition duration-300 font-bold my-2 rounded-md cursor-pointer
                            ${filterObj.subscriptionType == activeSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                        `}
                        >
                            <div className='flex gap-1 items-center'>
                                <ShieldCheck size={23} />

                                <p>
                                    الاشتراكات المُفعله
                                </p>
                            </div>

                            <p>
                                ( {allActiveSubscriptions >= 99 ? `99+` : allActiveSubscriptions} )
                            </p>
                        </li>

                        <li
                            onClick={() => clickOnSubscription(pendingSubscriptions)}
                            className={`
                            p-3
                            flex items-center justify-between
                            transition duration-300 font-bold my-2 rounded-md cursor-pointer
                            ${filterObj.subscriptionType == pendingSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                        `}
                        >
                            <div className='flex gap-1 items-center'>
                                <ShieldQuestionMark size={23} />

                                <p>
                                    الاشتراكات المُعلقه
                                </p>
                            </div>

                            <p>
                                ( {allPendingSubscriptions >= 99 ? `99+` : allPendingSubscriptions} )
                            </p>
                        </li>

                        <li
                            onClick={() => clickOnSubscription(finishedSubscriptions)}
                            className={`
                                p-3
                                flex items-center justify-between
                                transition duration-300 font-bold my-2 rounded-md cursor-pointer
                                ${filterObj.subscriptionType == finishedSubscriptions ? "bg-(--thirdColor) text-white" : "hover:bg-(--thirdColor) hover:text-white"}
                            `}
                        >
                            <div className='flex gap-1 items-center'>
                                <ShieldOff size={23} />

                                <p>
                                    الاشتراكات المنتهيه
                                </p>
                            </div>

                            <p>
                                ( {allFinishedSubscriptions >= 99 ? `99+` : allFinishedSubscriptions} )
                            </p>
                        </li>
                    </ul>
                </Drop_Menu>


                <Add_Btn
                    styleBtn="cursor-pointer"
                    paddingY="py-2"
                    title="إضافة متدرب جديد"
                    onClick={() => setIsShowAddTrainer(true)}
                />
            </div>
        </div>

        {/* Table for show all trainers */}
        <Table_For_Trainers trainersList={trainersListAfterFilter} />

        {
            isShowAddTrainer ?
                <Add_Trainer onIsShowAddTrainer={setIsShowAddTrainer} />
                : null
        }

        {
            isShowTrainerDetailsAtom ?
                <Trainer_Details />
                : null
        }
    </section>
}