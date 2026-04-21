import { BicepsFlexed, ShieldCheck, ShieldOff, ShieldQuestionMark, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { filter, trainer } from "@/Pages/types";
import Trainer_Details from "./Components/Trainer-details/Trainer_Details";
import Add_Trainer from "./Components/Add-trainer/Add_Trainer";
import Search_Trainer from "./Components/Search-trainer/Search_Trainer";
import Btn_Filter from "./Components/Btn-filter/Btn_Filter";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrainers } from "@/Rtk/Slices/trainersSlice";
import { store_Type } from "@/Rtk/types";
import Box from "@/Global-components/Box/Box";
import { activeSubscriptions, allSubscriptions, finishedSubscriptions, pendingSubscriptions, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import { useAtomValue } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import Table_For_Trainers from "@/Global-components/Table-for-trainers/Table_For_Trainers";
// ========================================================== //
export default function Trainers_Page() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);


    const [TrainersListAfterFilter, setTrainersListAfterFilter] = useState<trainer[]>([]);
    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);
    const [getFilter, setGetFilter] = useState<filter | null>(null);
    const [boxInfo, setBoxInfo] = useState({
        name: "",
        total: 0,
        styleBg: "",
        icon: <ShieldCheck size={30} />
    });



    useEffect(function () {
        dispatch(getAllTrainers() as any);
    }, []);


    useEffect(function () {
        if (!getFilter) return;

        if (getFilter.subscriptionType == allSubscriptions || getFilter.subscriptionType == activeSubscriptions) {
            setBoxInfo({
                name: "مجموع الاشتراكات المفعله",
                styleBg: "bg-emerald-100 text-emerald-500",
                total: state.trainers.filter(ele => ele.subscriptionState == stateIsActive).length,
                icon: <ShieldCheck size={30} />
            });
        }
        else if (getFilter.subscriptionType == pendingSubscriptions) {
            setBoxInfo({
                name: "مجموع الاشتراكات المُعلقه",
                styleBg: "bg-amber-100 text-amber-500",
                total: state.trainers.filter(ele => ele.subscriptionState == stateIsPending).length,
                icon: <ShieldQuestionMark size={30} />
            });
        }
        else if (getFilter.subscriptionType == finishedSubscriptions) {
            setBoxInfo({
                name: "مجموع الاشتراكات المنتهيه",
                styleBg: "bg-red-100 text-red-500",
                total: state.trainers.filter(ele => ele.subscriptionState == stateIsFinished).length,
                icon: <ShieldOff size={30} />
            });
        }
    }, [state.trainers, getFilter]);




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

            <div className="flex justify-end gap-1 col-span-1">
                <Btn_Filter
                    trainersList={state.trainers}
                    onGetFilter={setGetFilter}
                    onGetTrainerListAfterFilter={setTrainersListAfterFilter}
                />

                <Add_Btn
                    styleBtn="cursor-pointer"
                    paddingY="py-2"
                    title="إضافة متدرب جديد"
                    onClick={() => setIsShowAddTrainer(true)}
                />
            </div>
        </div>

        {/* Table for show all trainers */}
        <Table_For_Trainers trainersList={TrainersListAfterFilter} />

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