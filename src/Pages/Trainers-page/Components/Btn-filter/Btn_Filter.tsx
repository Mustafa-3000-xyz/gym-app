import { ListFilter } from "lucide-react";
import { trainer } from "../../trainersTypes";
import { useEffect, useState } from "react";
import { getTrainers } from "@/Db/trainerDb";
// ========================================================== //
export default function Btn_Filter(
    { onGetTrainerList }: { onGetTrainerList: (x: trainer[]) => void }
) {

    const [trainersList, setTrainersList] = useState<trainer[]>([]);

    async function getAllTrainers() {
        const data = await getTrainers();
        setTrainersList(data as trainer[]);
    }


    useEffect(function () {
        getAllTrainers();
    }, []);


    return <button
        disabled={trainersList.length <= 1 ? true : false}
        className={`
                ${trainersList.length <= 1 ? "opacity-35 cursor-not-allowed"
                : "opacity-100 cursor-pointer"}
                transition duration-500 hover:bg-slate-200
                flex items-center gap-2 bg-slate-100 p-3 px-4 border border-slate-300 rounded-lg
        `}
    >
        <ListFilter size={23} />

        <span className=" font-medium">
            فلتر
        </span>
    </button>
}