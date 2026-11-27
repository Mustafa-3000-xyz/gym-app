import { BicepsFlexed, Mars, Plus, ShieldCheck, ShieldOff, ShieldQuestionMark, Venus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { subscriptionStatusBox_Type, trainer_Type, trainersTypeBox_Type } from "@/Pages/types";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Box from "@/Global-components/Box/Box";
import { activeSubscriptions, addTrainerPagePath, allSubscriptions, allTrainers, pendingSubscriptions, statusIsFinished } from "@/Lib/constants";
import Custom_Table_For_Trainers from "@/Global-components/Custom-Table-for-trainers/Table_For_Trainers";
import Search_Box_For_Trainers from "@/Global-components/Search-box-for-trainers/Search_Box_For_Trainers";
import { normalAlert } from "@/Lib/functions";
import Filter from "./Components/Filter";
import { getAllRowsInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import Database from "@tauri-apps/plugin-sql";
import { useNavigate } from "react-router-dom";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { deleteRowsInActiveSessionsTableToLinkedTheTrainerById } from "@/Lib/functionsWithDb";
// ========================================================== //
export default function Trainers_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            trainers: state.trainers,
            subscriptionsMenus: state.subscriptionsMenus,
            settings: state.settings
        }
    }, shallowEqual);

    const [subscriptionStatusBox, setSubscriptionStatusBox] = useState<subscriptionStatusBox_Type | null>(null);
    const [trainersTypeBox, setTrainersTypeBox] = useState<trainersTypeBox_Type | null>(null);

    const [getTrainersAfterFilter, setGetTrainersAfterFilter] = useState<trainer_Type[]>([]);

    const navigate = useNavigate();


    const handelAddTrainer = useCallback(function () {
        navigate(addTrainerPagePath);
    }, []);



    async function checkTheSubscriptionStatusInTrainer() {
        const db = await Database.load("sqlite:gym-app.db");


        try {
            interface TrainerIdRow {
                id: number;
            }

            const resultActuive = await db.execute(`
                UPDATE trainers
                SET subscriptionStatus = 'active'
                WHERE subscriptionStatus = 'pending'
                    AND DATE(subscriptionStart, 'localtime') <= DATE('now', 'localtime')
                    AND DATE(subscriptionEnd, 'localtime') > DATE('now', 'localtime');
            `);

            const getRowsFinished = await db.select(`
                SELECT id FROM trainers
                WHERE subscriptionStatus != 'finished'
                    AND DATE(subscriptionEnd, 'localtime') <= DATE('now', 'localtime');
            `) as TrainerIdRow[];



            if (getRowsFinished.length > 0) {
                await db.execute(`
                    UPDATE trainers SET subscriptionStatus = 'finished'
                    WHERE subscriptionStatus != 'finished'
                        AND DATE(subscriptionEnd, 'localtime') <= DATE('now', 'localtime');
                `);

                for (const ele of getRowsFinished) {
                    await deleteRowsInActiveSessionsTableToLinkedTheTrainerById(ele.id);
                }

                dispatch(getAllRowsInTrainersTable() as any);
            }

            if (resultActuive.rowsAffected > 0) {
                dispatch(getAllRowsInTrainersTable() as any);
            }
        }
        catch (error) {
            normalAlert({
                title: "لا نستطيع التحقق من حالة الاشتراكات الخاصه بالمتدربين",
                text: String(error),
                icon: "error"
            });
        }
    }

    // This for remove some traines who not renwal after six month
    async function checkTheForWhoTrainerIsRemove() {
        const db = await Database.load("sqlite:gym-app.db");

        try {
            await db.execute(
                `DELETE FROM trainers WHERE subscriptionStatus = ?
                    AND DATE (subscriptionEnd, 'localtime') <= DATE('now', 'localtime', '-6 months');
            `, [statusIsFinished]);

            dispatch(getAllRowsInTrainersTable() as any);
        }
        catch (error) {
            normalAlert({
                title: "لا نستطيع حذف المتدربين القدامى",
                text: String(error),
                icon: "error"
            });
        }
    }

    // This fixed bug in version 1.0.0
    async function fixTrainerType() {
        try {
            const db = await Database.load("sqlite:gym-app.db");
            const result = await db.execute(`
                UPDATE trainers
                SET trainerType = 'woman' WHERE trainerType = 'women';
            `);

            if (result.rowsAffected > 0) {
                dispatch(getAllRowsInTrainersTable() as any);
            }
        } catch (error) {
            normalAlert({
                icon: "error",
                title: "حدث خطأ اثناء تحديث نوع المتدرب",
                text: String(error)
            });
        }
    }





    useEffect(function () {
        let today = new Date();
        const tomorrow = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1,
            0, 0, 0, 0
        );


        const timer = setTimeout(function () {
            today = tomorrow;
            checkTheSubscriptionStatusInTrainer();
        }, tomorrow.getTime() - today.getTime());


        fixTrainerType();
        checkTheSubscriptionStatusInTrainer();
        return () => clearTimeout(timer);
    }, []);

    useEffect(function () {
        if (
            state.settings.isDeleteSomeTrainersWhoNotRenwal == "false"
            ||
            !JSON.parse(state.settings.isDeleteSomeTrainersWhoNotRenwal as any ?? "false")
        ) return;


        checkTheForWhoTrainerIsRemove();
    }, [state.settings.isDeleteSomeTrainersWhoNotRenwal]);






    return <section className="mt-10">
        {/* Boxes */}
        <div className="mb-7 grid grid-cols-3 gap-3">
            <Box
                icon={<BicepsFlexed size={30} />}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                title="مجموع المتدربين"
                total={state.trainers?.length || 0}
            />

            {/* trainers type */}
            <div className={`
                    bg-slate-100 rounded-lg p-5 flex items-center select-none
                    ${trainersTypeBox?.type == allTrainers ? "justify-center gap-3" : ""}
                `}
            >
                {
                    trainersTypeBox?.type == "allTrainers" ?
                        <>
                            <div className="flex flex-col items-center">
                                <Mars
                                    size={60}
                                    className="bg-blue-100 text-blue-500 p-3 rounded-lg"
                                />

                                <p>{(trainersTypeBox.total as number[])[0]}</p>
                            </div>

                            <div className="bg-black h-5 w-0.5"></div>

                            <div className="flex flex-col items-center">
                                <Venus
                                    size={60}
                                    className="bg-pink-100 text-pink-500 p-3 rounded-lg"
                                />

                                <p>{(trainersTypeBox.total as number[])[1]}</p>
                            </div>
                        </>
                        :
                        <div className="flex items-center gap-3">
                            <div className={`${trainersTypeBox?.styleBgForIcon} p-3 rounded-lg w-fit`}>
                                {trainersTypeBox?.icon}
                            </div>

                            <div>
                                <h3 className="opacity-65 text-lg font-bold">
                                    {
                                        trainersTypeBox?.type == "men" ? "الرجال" : "الإناث"
                                    }
                                </h3>

                                <p className="font-bold">
                                    {trainersTypeBox?.total}
                                </p>
                            </div>
                        </div>
                }
            </div>

            {/* Subscription status */}
            <div className={`
                    bg-slate-100 rounded-lg p-5 flex items-center select-none
                    ${subscriptionStatusBox?.type == allSubscriptions ? "justify-center gap-3" : ""}
                `}
            >
                {
                    subscriptionStatusBox?.type == allSubscriptions ?
                        <>
                            <div className="flex flex-col items-center">
                                <ShieldCheck
                                    size={60}
                                    className="bg-emerald-100 text-emerald-500 p-3 rounded-lg"
                                />

                                <p>{(subscriptionStatusBox.total as number[])[0]}</p>
                            </div>

                            <div className="bg-black h-5 w-0.5"></div>

                            <div className="flex flex-col items-center">
                                <ShieldQuestionMark
                                    size={60}
                                    className="bg-amber-100 text-amber-500 p-3 rounded-lg"
                                />

                                <p>{(subscriptionStatusBox.total as number[])[1]}</p>
                            </div>

                            <div className="bg-black h-5 w-0.5"></div>

                            <div className="flex flex-col items-center">
                                <ShieldOff
                                    size={60}
                                    className="bg-red-100 text-red-500 p-3 rounded-lg"
                                />

                                <p>{(subscriptionStatusBox.total as number[])[2]}</p>
                            </div>
                        </>
                        :
                        <div className="flex items-center gap-3">
                            <div className={`${subscriptionStatusBox?.styleBgForIcon} p-3 rounded-lg w-fit`}>
                                {subscriptionStatusBox?.icon}
                            </div>

                            <div>
                                <h3 className="opacity-65 text-lg font-bold">
                                    {
                                        subscriptionStatusBox?.type == activeSubscriptions ?
                                            "الاشتراكات المفعله"
                                            :
                                            subscriptionStatusBox?.type == pendingSubscriptions ?
                                                "الاشتراكات المعلقه" : "الاشتراكات المنتهيه"
                                    }
                                </h3>

                                <p className="font-bold">
                                    {subscriptionStatusBox?.total}
                                </p>
                            </div>
                        </div>
                }
            </div>
        </div>

        {/* Search & filter & add trainer */}
        <div className="flex flex-col justify-center gap-4 mb-7 bg-slate-100 rounded-lg py-5 px-3">
            {/* Search */}
            <div className="h-[70px]">
                <Search_Box_For_Trainers arrayForSearch={getTrainersAfterFilter} />
            </div>

            {/* filter & add trainer */}
            <div className="flex justify-center gap-5 items-center">
                <div>
                    <Filter
                        onGetTrainers={setGetTrainersAfterFilter}
                        onGetSubscriptionStatusBox={setSubscriptionStatusBox}
                        onGetTrainersTypeBox={setTrainersTypeBox}
                    />
                </div>


                <Custom_Btn
                    className="flex cursor-pointer whitespace-nowrap py-2 px-24 !bg-emerald-500 !border-emerald-600"
                    onClick={handelAddTrainer}
                >
                    <div className="flex items-center gap-2">
                        <Plus size={20} strokeWidth={3} />

                        <h3 className="text-lg font-bold mb-1">
                            إضافة متدرب جديد
                        </h3>
                    </div>
                </Custom_Btn>
            </div>
        </div>

        <Custom_Table_For_Trainers
            trainersList={getTrainersAfterFilter}
            countRowsInSlide={Number(state.settings.rowsInTrainerTable)}
        />
    </section>
}