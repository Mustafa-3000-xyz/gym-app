import { BicepsFlexed, ShieldCheck, ShieldOff, ShieldQuestionMark, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { attendanceDetails, box_Info_In_Trainers_Page, trainer } from "@/Pages/types";
import Add_Trainer from "./Components/Add-trainer/Add_Trainer";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Box from "@/Global-components/Box/Box";
import { allSubscriptions, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Table_For_Trainers from "@/Global-components/Table-for-trainers/Table_For_Trainers";
import Search_Box_For_Trainers from "@/Global-components/Search-box-for-trainers/Search_Box_For_Trainers";
import { getAllAttendanceInSpecificDate, theTodayDate } from "@/Lib/functions";
import Filter from "./Components/Filter/Filter";
import Trainer_Details from "./Components/Trainer-details/Trainer_Details";
// ========================================================== //
export default function Trainers_Page() {
    const state = useSelector(function (state: store_Type) {
        return {
            attendance: state.attendance,
            trainers: state.trainers,
            trainerDetails: state.trainerDetails
        }
    }, shallowEqual);

    const [getTrainersAfterFilter, setGetTrainersAfterFilter] = useState<trainer[]>([]);
    const [getBoxInfo, setGetBoxInfo] = useState<box_Info_In_Trainers_Page | null>(null);
    const filterInLocalStorage = JSON.parse(localStorage.getItem("filter") || "{}" as any);

    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);
    const [attendanceTodayTotal, setAttendanceTodayTotal] = useState(0);




    function clickOnAddTrainerBtn() {
        setIsShowAddTrainer(true);
    }



    // I want when open trainers page, get attendance total
    useEffect(function () {
        async function x() {
            const dayDetails = await getAllAttendanceInSpecificDate(theTodayDate({ startingIn12Houre: true })) as attendanceDetails[];
            let total = 0;

            if (!dayDetails) return 0;

            dayDetails.forEach(function (row) {
                const convertToArray = JSON.parse(row.trainers as any) as number[];
                total += convertToArray.length;
            });

            setAttendanceTodayTotal(total);
        }
        x();
    }, [state.attendance]);


    const [
        allActiveSubscriptions,
        allPendingSubscriptions,
        allFinishedSubscriptions
    ] = useMemo(function () {
        if (state.trainers?.length == 0) {
            return [0, 0, 0]
        }
        else {
            const allActiveSubscriptions = state.trainers?.filter(ele => ele.subscriptionState == stateIsActive).length;
            const allPendingSubscriptions = state.trainers?.filter(ele => ele.subscriptionState == stateIsPending).length;
            const allFinishedSubscriptions = state.trainers?.filter(ele => ele.subscriptionState == stateIsFinished).length;


            return [allActiveSubscriptions, allPendingSubscriptions, allFinishedSubscriptions];
        }
    }, [state.trainers]);




    return <section>
        {/* Boxes */}
        <div className="mb-7 grid grid-cols-3 gap-3">
            <Box
                icon={<BicepsFlexed size={30} />}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                title="مجموع المتدربين"
                total={state.trainers?.length || 0}
            />

            <Box
                icon={<Users size={30} />}
                styleIcon="bg-neutral-200 text-neutral-500"
                title="حضور اليوم"
                total={attendanceTodayTotal as any}
            />

            {
                filterInLocalStorage.subscriptionType == allSubscriptions ?
                    <div className="flex justify-center items-center gap-10 bg-slate-100 rounded-lg h-40 select-none">
                        <div className="flex flex-col items-center">
                            <ShieldCheck
                                size={60}
                                className="bg-emerald-100 text-emerald-500 p-3 rounded-lg"
                            />
                            <p>{allActiveSubscriptions}</p>
                        </div>

                        <div className="bg-black h-5 w-0.5"></div>

                        <div className="flex flex-col items-center">
                            <ShieldQuestionMark
                                size={60}
                                className="bg-amber-100 text-amber-500 p-3 rounded-lg"
                            />
                            <p>{allPendingSubscriptions}</p>
                        </div>

                        <div className="bg-black h-5 w-0.5"></div>

                        <div className="flex flex-col items-center">
                            <ShieldOff
                                size={60}
                                className="bg-red-100 text-red-500 p-3 rounded-lg"
                            />
                            <p>{allFinishedSubscriptions}</p>
                        </div>
                    </div>
                    :
                    <Box
                        icon={getBoxInfo?.icon}
                        styleIcon={getBoxInfo?.styleBgForIcon as any}
                        title={getBoxInfo?.name as any}
                        total={getBoxInfo?.total as any}
                    />
            }
        </div>

        {/* Search & filter & add trainer */}
        <div className="grid grid-cols-4 gap-2 mb-7 bg-slate-100 rounded-lg py-5 px-3">
            {/* Search */}
            <div className="col-span-3">
                {/* Fixed bug here */}
                <Search_Box_For_Trainers arrayForSearch={getTrainersAfterFilter} />
            </div>

            {/* filter & add trainer */}
            <div className="flex justify-end gap-1 col-span-1">
                <Filter
                    onGetTrainers={setGetTrainersAfterFilter}
                    onGetBoxInfo={setGetBoxInfo}
                />

                <Add_Btn
                className="cursor-pointer py-2"
                    title="إضافة متدرب جديد"
                    onClick={clickOnAddTrainerBtn}
                />
            </div>
        </div>

        <Table_For_Trainers trainersList={getTrainersAfterFilter} />

        {
            isShowAddTrainer ?
                <Add_Trainer onIsShowAddTrainer={setIsShowAddTrainer} />
                :
                null
        }

        {
            state.trainerDetails ?
                <Trainer_Details />
                :
                null
        }
    </section>
}