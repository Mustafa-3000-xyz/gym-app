import { BicepsFlexed, Plus, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { trainer } from "@/Pages/types";
import Trainer_Details from "./Components/Trainer-details/Trainer_Details";
import All_Trainers from "./Components/All-trainers/All_Trainers";
import Add_Trainer from "./Components/Add-trainer/Add_Trainer";
import Discription from "@/Global-components/Description/Discription";
import Search_Trainer from "./Components/Search-trainer/Search_Trainer";
import Btn_Filter from "./Components/Btn-filter/Btn_Filter";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrainers } from "@/Rtk/Slices/trainersSlice";
import { store_Type } from "@/Rtk/types";
import Box from "@/Global-components/Box/Box";
import { stateIsActive } from "@/Lib/customs";
import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
// ========================================================== //
export default function Trainers_Page() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);

    const [anotherTrainersList, setAnotherTrainersList] = useState<trainer[]>([]);
    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);
    const [isShowTrainerDetails, setIsShowTrainerDetails] = useState<boolean>(false);
    const [activeSubscriptionsTotle, setActiveSubscriptionsTotle] = useState(0);



    function btnAddTrianer() {
        setIsShowAddTrainer(true);
    }



    useEffect(function () {
        dispatch(getAllTrainers() as any);
    }, []);


    useEffect(function () {
        setActiveSubscriptionsTotle(0);

        state.trainers.forEach(ele => {
            if (ele.subscriptionState == stateIsActive) {
                setActiveSubscriptionsTotle(prev => prev + 1);
            }
        });
    }, [state.trainers]);




    return <section>
        {/* Title and discription and add new trainer */}
        <div className="select-none mb-7 w-full">
            <h3 className="text-2xl font-bold">صفحة المتدربين</h3>
            <Discription discription="اهلا بك يا كابتن , تلك الصفحه لمعرفة التفاصيل الخاصه بالمشتركين" />
        </div>

        {/* Boxes */}
        <div className="mb-7 grid grid-cols-3 gap-3">
            <Box
                icon={<BicepsFlexed size={30} />}
                styleIcon="bg-indigo-100 text-indigo-500"
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
                icon={<ShieldCheck size={30} />}
                styleIcon="bg-emerald-100 text-emerald-500"
                title="مجموع الاشتراكات المفعله"
                total={activeSubscriptionsTotle}
            />
        </div>

        {/* Search & filter & add trainer */}
        <div className="grid grid-cols-4 gap-2 mb-7">
            <Search_Trainer
                trainersList={state.trainers}
                onIsShowTrainerDetails={setIsShowTrainerDetails}
            />

            <div className="flex justify-center gap-1">
                <Btn_Filter
                    trainersList={state.trainers}
                    onGetFilterResult={setAnotherTrainersList}
                />

                <Add_Btn
                    styleTheBgAndBorderBtn="bg-emerald-500 border-emerald-600 cursor-pointer"
                    thePaddingY="py-2"
                    icon={<Plus size={20} strokeWidth={3} />}
                    title="إنشاء متدرب جديد"
                    onClick={btnAddTrianer}
                />
            </div>
        </div>

        {/* Table for show all trainers */}
        <All_Trainers
            trainersList={anotherTrainersList}
            setIsShowTrainerDetails={setIsShowTrainerDetails}
        />

        {
            isShowAddTrainer ?
                <Add_Trainer onIsShowAddTrainer={setIsShowAddTrainer} />
                : null
        }

        {
            isShowTrainerDetails ?
                <Trainer_Details onIsShowTrainerDetails={setIsShowTrainerDetails} />
                : null
        }
    </section>
}