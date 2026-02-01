import { ListFilter, Plus, Search } from "lucide-react";
import Add_Trainer from "../../Components/Trainers-page/Add-trainer/Add_Trainer";
import { useEffect, useState } from "react";
import All_Trainers from "@/Components/Trainers-page/All-trainers/All_Trainers";
import { getTrainers } from "@/db/trainerDb";
import { trainer } from "./trainersTypes";
import Show_Traine_Details from "@/Components/Trainers-page/Show-traine-details/Show_Traine_Details";
// ========================================================== //
export default function Trainers_Page() {
    const [isShowAddTrainer, setIsShowAddTrainer] = useState<boolean>(false);
    const [isShowTrainerDetails, setIsShowTrainerDetails] = useState<boolean>(false);

    const [trainersList, setTrainersList] = useState<trainer[]>([]);
    const [getTrainerDetails, setGetTrainerDetails] = useState<trainer | null>(null);


    function addTrianer() {
        setIsShowAddTrainer(true);
    }

    async function getAllTrainers() {
        const data = await getTrainers();
        setTrainersList(data as trainer[]);
    }


    useEffect(function () {
        getAllTrainers();
    }, []);

    return <section>
        {/* Title and discription and add new trainer */}
        <div className="select-none flex mb-5 justify-between items-center w-full">
            <div>
                <h3 className="text-2xl font-bold">صفحة المتدربين</h3>
                <p className="opacity-45">
                    اهلا بك يا كابتن عمرو , تلك الصفحه لمعرفة التفاصيل الخاصه بالمشتركين
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={addTrianer}
                    className={`
                        transition duration-500 hover:bg-blue-600
                        flex items-center gap-2 bg-[var(--primary)] cursor-pointer text-white py-2 px-5 rounded-sm
                    `}
                >
                    <Plus strokeWidth={1.75} />

                    <span>
                        إضافة متدرب جديد
                    </span>
                </button>
            </div>
        </div>

        {/* Search and filter */}
        <div className="flex items-center gap-4">
            <div className="w-full flex relative">
                <input
                    type="text"
                    placeholder="البحث عن المتدرب من خلال الاسم او ID"
                    className={`
                        transition duration-300 focus:outline-0 focus:shadow-2xl
                        bg-slate-100 p-2 w-full rounded-lg border border-slate-300 ps-10 pt-2
                    `}
                />

                <Search size={23} className="absolute top-2 ms-3 opacity-40" />
            </div>

            <button className={`
                    transition duration-500 hover:bg-slate-200
                    flex items-center gap-2 cursor-pointer bg-slate-100 p-3 px-4 border border-slate-300 rounded-lg
                `}
            >
                <ListFilter size={23} />

                <span className=" font-medium">
                    فلتر
                </span>
            </button>
        </div>

        {/* Table for show some trainers */}
        <All_Trainers
            trainersList={trainersList}
            setGetTrainerDetails={setGetTrainerDetails}
            setIsShowTrainerDetails={setIsShowTrainerDetails}
        />

        {
            isShowAddTrainer ?
                <Add_Trainer
                    getAllTrainers={getAllTrainers}
                    setIsShowAddTrainer={setIsShowAddTrainer}
                />
                : null
        }

        {
            isShowTrainerDetails ?
                <Show_Traine_Details
                    trainer={getTrainerDetails as trainer}
                    setIsShowTrainerDetails={setIsShowTrainerDetails}
                />
                : null
        }
    </section>
}