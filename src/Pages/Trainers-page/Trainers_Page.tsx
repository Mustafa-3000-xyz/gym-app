import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { trainer } from "./types";
import Trainer_Details from "./Components/Trainer-details/Trainer_Details";
import All_Trainers from "./Components/All-trainers/All_Trainers";
import Add_Trainer from "./Components/Add-trainer/Add_Trainer";
import Discription from "@/Global-components/Description/Discription";
import Attendee from "./Components/Boxes/Attendee/Attendee";
import Trainers_Total from "./Components/Boxes/Trainers-total/Trainers_Total";
import Active_Subscriptions from "./Components/Boxes/Active-subscriptions/Active_Subscriptions";
import Search_Trainer from "./Components/Search-trainer/Search_Trainer";
import Btn_Filter from "./Components/Btn-filter/Btn_Filter";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrainers } from "@/Rtk/Slices/trainersSlice";
import { store_Type } from "@/Rtk/types";
// ========================================================== //
export default function Trainers_Page() {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);

    const [trainersList, setTrainersList] = useState<trainer[]>([]);
    const [anotherTrainersList, setAnotherTrainersList] = useState<trainer[]>([]);

    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);
    const [isShowTrainerDetails, setIsShowTrainerDetails] = useState<boolean>(false);


    function btnAddTrianer() {
        setIsShowAddTrainer(true);
    }



    useEffect(function () {
        dispatch(getAllTrainers() as any);
    }, []);

    useEffect(function () {
        setTrainersList(state.trainers);
    }, [state.trainers]);



    return <section>
        {/* Title and discription and add new trainer */}
        <div className="select-none mb-7 w-full">
            <h3 className="text-2xl font-bold">صفحة المتدربين</h3>
            <Discription discription="اهلا بك يا كابتن , تلك الصفحه لمعرفة التفاصيل الخاصه بالمشتركين" />
        </div>

        {/* Boxes */}
        <div className="mb-7 grid grid-cols-3 gap-3">
            <Trainers_Total trainersList={trainersList} />
            <Attendee />
            <Active_Subscriptions trainersList={trainersList as trainer[]} />
        </div>

        {/* Search & filter & add trainer */}
        <div className="grid grid-cols-4 gap-2 mb-7">
            <Search_Trainer
                trainersList={trainersList}
                onIsShowTrainerDetails={setIsShowTrainerDetails}
            />

            <div className="flex justify-end gap-1">
                <Btn_Filter
                    trainersList={trainersList}
                    onGetFilterResult={setAnotherTrainersList}
                />

                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={btnAddTrianer}
                        className={`
                            transition duration-500 hover:bg-blue-600 whitespace-nowrap w-full
                            flex items-center justify-center gap-2 bg-[var(--primary)] cursor-pointer text-white py-3 px-5 rounded-sm
                        `}
                    >
                        <Plus strokeWidth={1.75} />

                        <span>
                            إضافة متدرب جديد
                        </span>
                    </button>
                </div>
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
                <Trainer_Details
                    getAllTrainers={getAllTrainers}
                    onIsShowTrainerDetails={setIsShowTrainerDetails}
                />
                : null
        }
    </section>
}