import { Search } from 'lucide-react'
import { trainer } from '../../trainersTypes'
// ========================================================== //
export default function Search_Trainer(
    { trainersList }: { trainersList: trainer[] }
) {
    return <div className="flex relative col-span-3">
        <input
            disabled={trainersList.length <= 1 ? true : false}
            type="text"
            placeholder="البحث عن المتدرب من خلال الاسم او ID"
            className={`
                ${trainersList.length <= 1 ? "opacity-35 cursor-not-allowed"
                    : "opacity-100"}
                transition duration-300 focus:outline-0 focus:shadow-2xl
                bg-slate-100 p-2 w-full rounded-lg border border-slate-300 ps-10 pt-2
            `}
        />

        <Search size={23} className="absolute top-3 ms-3 opacity-40" />
    </div>

}
