import { BicepsFlexed, ShieldCheck, ShieldOff, ShieldQuestionMark, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { attendanceDetails_Type, boxInfoInTrainersPage_Type, trainer_Type } from "@/Pages/types";
import Add_Trainer from "./Components/Add-trainer/Add_Trainer";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Box from "@/Global-components/Box/Box";
import { allSubscriptions } from "@/Lib/constants";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Table_For_Trainers from "@/Global-components/Table-for-trainers/Table_For_Trainers";
import Search_Box_For_Trainers from "@/Global-components/Search-box-for-trainers/Search_Box_For_Trainers";
import { normalAlert, theTodayDate } from "@/Lib/functions";
import Filter from "./Components/Filter/Filter";
import Trainer_Details from "./Components/Trainer-details/Trainer_Details";
import { getAllAttendanceInSpecificDate } from "@/Lib/functionsWithDb";
import { getAllRowsInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import Database from "@tauri-apps/plugin-sql";
import { removeTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
// ========================================================== //
export default function Trainers_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            attendance: state.attendance,
            trainers: state.trainers,
            trainerDetails: state.trainerDetails,
            settings: state.settings
        }
    }, shallowEqual);

    const [getTrainersAfterFilter, setGetTrainersAfterFilter] = useState<trainer_Type[]>([]);
    const [getBoxInfo, setGetBoxInfo] = useState<boxInfoInTrainersPage_Type | null>(null);

    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);
    const [attendanceTodayTotal, setAttendanceTodayTotal] = useState(0);
    const [todayDate, setTodayDate] = useState(new Date());



    const handelAddTrainer = useCallback(function () {
        setIsShowAddTrainer(true);
    }, []);



    // I want when open trainers page, get attendance total
    async function attendanceTotal() {
        // Dont't change the startingInHalfNight value 
        const todayDate = theTodayDate({ startingInHalfNight: true });
        const dayDetails = await getAllAttendanceInSpecificDate(todayDate) as attendanceDetails_Type[];

        if (!dayDetails) {
            setAttendanceTodayTotal(0);
            return;
        }

        let total = 0;

        dayDetails.forEach(function (row) {
            const convertToArray = JSON.parse(row.trainers as any ?? "[]") as number[];
            total += convertToArray.length;
        });

        setAttendanceTodayTotal(total);
    }

    async function checkTheSubscriptionStatusInTrainer() {
        const db = await Database.load("sqlite:gym-app.db");



        try {
            const resultActuive = await db.execute(`
                UPDATE trainers
                SET subscriptionStatus = 'active'
                WHERE subscriptionStatus = 'pending'
                    AND DATE(subscriptionStart, 'localtime') <= DATE('now', 'localtime')
                    AND DATE(subscriptionEnd, 'localtime') > DATE('now', 'localtime');
            `);

            const resultFinished = await db.execute(`
                UPDATE trainers
                SET subscriptionStatus = 'finished'
                WHERE subscriptionStatus != 'finished'
                    AND DATE(subscriptionEnd, 'localtime') <= DATE('now', 'localtime');
            `);


            if (resultActuive.rowsAffected > 0 || resultFinished.rowsAffected > 0) {

                if (state.trainerDetails) {
                    dispatch(removeTrainerDetails());
                }

                dispatch(getAllRowsInTrainersTable() as any);
            }

        } catch (error) {
            normalAlert({
                title: "حدث خطا",
                text: "لا نستطيع التحقق من حالة الاشتراكات الخاصه بالمتدربين",
                icon: "error"
            })
            console.error(error);
        }
    }



    useEffect(function () {
        checkTheSubscriptionStatusInTrainer();

        const tomorrow = new Date();
        tomorrow.setDate(todayDate.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const timer = setTimeout(function () {
            checkTheSubscriptionStatusInTrainer();
            setTodayDate(tomorrow);
        }, tomorrow.getTime() - todayDate.getTime());


        return () => clearTimeout(timer);
    }, [todayDate]);

    useEffect(function () {
        attendanceTotal();
    }, [state.attendance]);

    useEffect(function () {
        if (state.trainers?.length == 0) {
            dispatch(getAllRowsInTrainersTable() as any);
        }
    }, [state.trainers?.length]);






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
                getBoxInfo?.type == allSubscriptions ?
                    <div className="flex justify-center items-center gap-5 bg-slate-100 rounded-lg h-40 select-none">
                        <div className="flex flex-col items-center">
                            <ShieldCheck
                                size={60}
                                className="bg-emerald-100 text-emerald-500 p-3 rounded-lg"
                            />

                            <p>{Array.isArray(getBoxInfo.total) && getBoxInfo.total[0]}</p>
                        </div>

                        <div className="bg-black h-5 w-0.5"></div>

                        <div className="flex flex-col items-center">
                            <ShieldQuestionMark
                                size={60}
                                className="bg-amber-100 text-amber-500 p-3 rounded-lg"
                            />

                            <p>{Array.isArray(getBoxInfo.total) && getBoxInfo.total[1]}</p>
                        </div>

                        <div className="bg-black h-5 w-0.5"></div>

                        <div className="flex flex-col items-center">
                            <ShieldOff
                                size={60}
                                className="bg-red-100 text-red-500 p-3 rounded-lg"
                            />

                            <p>{Array.isArray(getBoxInfo.total) && getBoxInfo.total[2]}</p>
                        </div>
                    </div>
                    :
                    <Box
                        icon={getBoxInfo?.icon}
                        styleIcon={getBoxInfo?.styleBgForIcon as any}
                        total={typeof getBoxInfo?.total == "number" ? getBoxInfo.total : 0}
                        title={
                            getBoxInfo?.type == "activeSubscriptions" ?
                                "كل الاشتراكات المفعله"
                                :
                                getBoxInfo?.type == "pendingSubscriptions" ? "كل الاشتراكات المعلقه" : "كل الاشتراكات المنتهيه"
                        }
                    />
            }
        </div>

        {/* Search & filter & add trainer_Type */}
        <div className="grid grid-cols-4 gap-2 mb-7 bg-slate-100 rounded-lg py-5 px-3">
            {/* Search */}
            <div className="col-span-4 sm:col-span-2 xl:col-span-3">
                <Search_Box_For_Trainers arrayForSearch={getTrainersAfterFilter} />
            </div>

            {/* filter & add trainer_Type */}
            <div className="flex justify-end gap-1 col-span-4 sm:col-span-2 xl:col-span-1">
                <Filter
                    onGetTrainers={setGetTrainersAfterFilter}
                    onGetBoxInfo={setGetBoxInfo}
                />

                <Add_Btn
                    className="cursor-pointer py-2"
                    title="إضافة متدرب جديد"
                    onClick={handelAddTrainer}
                />
            </div>
        </div>

        <Table_For_Trainers
            trainersList={getTrainersAfterFilter}
            countRowsInSlide={Number(state.settings.rowsInTrainerTable)}
        />

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