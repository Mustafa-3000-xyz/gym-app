import { useRef, useState } from "react";
import Search_Result from "./Search-result/Search_Result";
import { Search } from "lucide-react";
import { trainer } from "@/Pages/types";
// ========================================================== //
export default function Search_Box_For_Trainers(
    { arrayForSearch }: { arrayForSearch: trainer[] }
) {
    const searchInpRef = useRef<HTMLInputElement | null>(null);

    const [searchValue, setSearchValue] = useState("");
    const [trainersList, setTrainersList] = useState<trainer[]>([]);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);




    function clickOnEnter(e: React.KeyboardEvent) {
        if (e.key == "Enter" && searchValue != "") {
            const result = arrayForSearch.filter(function (ele) {
                return ele.firstName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                    ||
                    ele.lastName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                    ||
                    String(ele.trainerId).includes(searchValue)
            });

            setIsShowSearchResult(true);
            setTrainersList(result);
        }
        else if (e.key == "Backspace") {
            setIsShowSearchResult(false);
        }
    }




    return <div className="flex relative col-span-3 ">
        <div className="w-full h-full flex relative">
            <input
                type="text"
                disabled={arrayForSearch.length == 0 ? true : false}
                className={`
                    pr-10 w-full h-full p-4 focus:outline-2 focus:outline-amber-500 border border-slate-300 rounded-lg text-center
                    ${arrayForSearch.length == 0 ? "cursor-not-allowed opacity-45" : ""}
                `}
                placeholder={`
                    ${arrayForSearch.length == 0 ?"لا يوجد متدربين للبحث" : "البحث عن المتدرب من خلال الاسم او الرقم الخاص به"}
                `}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => clickOnEnter(e as any)}
            />

            <Search
                size={23}
                className="absolute z-20 top-3.5 ms-3 text-slate-400"
            />
        </div>

        {
            isShowSearchResult ?
                <Search_Result
                    arrayContainsTrainers={trainersList}
                    searchInpRef={searchInpRef.current as any}
                    onIsShowSearchResult={setIsShowSearchResult}
                />
                :
                null
        }
    </div>
}