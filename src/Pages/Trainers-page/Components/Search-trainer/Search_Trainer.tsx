import { Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Search_Trainer_Props, trainer } from '../../types';
import Search_Result from './Search-result/Search_Result';
// ========================================================== //
export default function Search_Trainer(
    { trainersList, onIsShowTrainerDetails }: Search_Trainer_Props
) {
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);
    const [searchResult, setSearchResult] = useState<trainer[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const searchInpRef = useRef<HTMLInputElement>(null);


    function clickOnEnter(e: React.KeyboardEvent) {
        if (e.key == "Enter" && searchValue != "") {
            const result = trainersList.filter(ele => (
                ele.firstName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                || ele.lastName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                || String(ele.trainerId).includes(searchValue)
            ));

            setIsShowSearchResult(true);
            setSearchResult(result);
        }
    }


    useEffect(function () {
        if (!searchValue) {
            setIsShowSearchResult(false);
            setSearchResult([]);
        }

        window.addEventListener("keydown", clickOnEnter as any)
        return () => window.removeEventListener("keydown", clickOnEnter as any);
    }, [searchValue]);



    return <div className="flex relative col-span-3 ">
        <div className='w-full h-full'>
            <input
                ref={searchInpRef}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={trainersList.length <= 1 ? true : false}
                value={searchValue}
                type="text"
                placeholder="البحث عن المتدرب من خلال الاسم او من خلال رقم المتدرب"
                className={`
                    focus:outline-0
                    h-full w-full z-20 relative
                    bg-slate-100 border border-slate-300 ps-10 py-2
                    ${isShowSearchResult ? "rounded-lg rounded-b-none" : ""}
                    ${trainersList.length <= 1 ? "opacity-35 cursor-not-allowed" : "opacity-100"}
                `}
            />

            <Search size={23} className="absolute z-20 top-3 ms-3 opacity-40" />
        </div>

        {
            isShowSearchResult ?
                <Search_Result
                    searchInpRef={searchInpRef}
                    searchResult={searchResult}
                    onIsShowTrainerDetails={onIsShowTrainerDetails}
                    onIsShowSearchResult={setIsShowSearchResult}
                    onGetSearchResult={setSearchResult}
                    onGetSearchValue={setSearchValue}
                />
                :
                null
        }
    </div>
}