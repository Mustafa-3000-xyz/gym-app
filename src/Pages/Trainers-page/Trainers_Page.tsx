import { ListFilter, Plus, Search } from "lucide-react";
import Add_Trainer from "../../Components/Trainers-page/Add-trainer/Add_Trainer";
import { useEffect, useState } from "react";
import { getTrainerById, getTrainers } from "@/db";
// ========================================================== //
interface trainer {
    trainerId: number;
    isSubscriptionActive: boolean;
    activeSessionsList: number[];
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    subscriptionName: string;
    sessionsCount: number;
    price: number;
    subscriptionStart: string;
    subscriptionEnd: string;
}


export default function Trainers_Page() {
    const [isShowAddTrainer, setIsShowAddTrainer] = useState(false);
    const [trainersList, setTrainersList] = useState<trainer[]>([]);
    const [allPrice, setAllPrice] = useState(0);

    function addTrianer() {
        setIsShowAddTrainer(true);
    }

    async function showDetailsTrainer(id: number) {
        const trainer = await getTrainerById(id);
        console.log(trainer);
    }

    async function getAllTrainers() {
        const data = await getTrainers();        
        setTrainersList(data as trainer[]);
    }



    useEffect(function () {
        getAllTrainers();
    }, []);

    useEffect(function () {
        if (trainersList.length == 0) return;

        const totalPrice = trainersList.reduce((sum, ele) => sum += ele.price, 0);
        setAllPrice(totalPrice);
    }, [trainersList]);

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
        <table className="w-full mt-10 border-separate select-none">
            <thead>
                <tr className="bg-black/5 text-center">
                    <td className="rounded-tr-2xl">ID</td>
                    <td className="p-2 py-4">المتدرب</td>
                    <td className="p-2 py-4">الاشتراك</td>
                    <td className="p-2 py-4">بداية الاشتراك</td>
                    <td className="p-2 py-4">نهاية الاشتراك</td>
                    <td className="p-2 py-4 rounded-tl-2xl">الحاله</td>
                </tr>
            </thead>

            <tbody>
                {
                    trainersList.map(ele => <tr
                        key={ele.trainerId}
                        onClick={() => showDetailsTrainer(ele.trainerId)}
                        className="text-center bg-slate-100 cursor-pointer transition duration-100 hover:bg-[var(--primary)] hover:text-white"
                    >
                        <td>{ele.trainerId}</td>
                        <td className="p-2 py-4">{ele.firstName} {ele.lastName}</td>
                        <td className="p-2 py-4">{ele.subscriptionName}</td>
                        <td className="p-2 py-4">{ele.subscriptionStart}</td>
                        <td className="p-2 py-4">{ele.subscriptionEnd}</td>
                        <td className="p-2 py-4">
                            <span className={`
                                    ${ele.isSubscriptionActive ?
                                    "bg-emerald-100 text-emerald-500"
                                    :
                                    "bg-yellow-100 text-yellow-500"
                                }
                                    p-1 px-2 rounded-full
                                `}
                            >
                                {
                                    ele.isSubscriptionActive ?
                                        "مفعل"
                                        :
                                        "معلق"
                                }
                            </span>
                        </td>
                    </tr>)
                }
            </tbody>

            <tfoot>
                <tr>
                    <td className="p-4 bg-black/5 rounded-b-2xl text-center" colSpan={7}>
                        <span>مجموع ارباح الاشتراكات الحاليه : </span>
                        <span className=" text-emerald-600">
                            {allPrice}$
                        </span>
                    </td>
                </tr>
            </tfoot>
        </table>

        {
            isShowAddTrainer ?
                <Add_Trainer
                    getAllTrainers={getAllTrainers}
                    setIsShowAddTrainer={setIsShowAddTrainer}
                />
                : null
        }
    </section>
}