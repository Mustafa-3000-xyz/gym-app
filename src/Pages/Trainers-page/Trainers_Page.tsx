import { Plus } from "lucide-react";
import { useState } from "react";
import { trainer } from "./trainersTypes";
import Show_Trainer_Details from "./Components/Show-trainer-details/Show_Trainer_Details";
import All_Trainers from "./Components/All-trainers/All_Trainers";
import Add_Trainer from "./Components/Add-trainer/Add_Trainer";
import Discription from "@/Global-components/Description/Discription";
import Attendee from "./Components/Boxes/Attendee/Attendee";
import Trainers_Total from "./Components/Boxes/Trainers-total/Trainers_Total";
import Active_Subscriptions from "./Components/Boxes/Active-subscriptions/Active_Subscriptions";
import Search_Trainer from "./Components/Search-trainer/Search_Trainer";
import Btn_Filter from "./Components/Btn-filter/Btn_Filter";
// ========================================================== //
export default function Trainers_Page() {
    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);
    const [isShowTrainerDetails, setIsShowTrainerDetails] = useState<boolean>(false);
    const [trainersList, setTrainersList] = useState<trainer[]>([]);


    function addTrianer() {
        setIsShowAddTrainer(true);
    }



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
                <Btn_Filter onGetTrainerList={setTrainersList} />

                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={addTrianer}
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
            trainersList={trainersList}
            setIsShowTrainerDetails={setIsShowTrainerDetails}
        />

        {
            isShowAddTrainer ?
                <Add_Trainer
                    onIsShowAddTrainer={setIsShowAddTrainer}
                />
                : null
        }

        {
            isShowTrainerDetails ?
                <Show_Trainer_Details
                    onIsShowTrainerDetails={setIsShowTrainerDetails}
                />
                : null
        }
    </section>
}