import React, { useEffect, useRef, useState } from 'react';
import { trainer } from "@/Pages/types";
import Search_Result from './Search-result/Search_Result';
import Input_Search from '@/Global-components/Input-search/Input_Search';
// ========================================================== //
export default function Search_Trainer(
    { trainersList }: {trainersList: trainer[]}
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
            <Input_Search 
                onGetValue={setSearchValue}
                placeholder='البحث عن متدرب من خلال الاسم او الرقم'
            />

        {
            isShowSearchResult ?
                <Search_Result
                    searchInpRef={searchInpRef}
                    searchResult={searchResult}
                    onIsShowSearchResult={setIsShowSearchResult}
                    onGetSearchResult={setSearchResult}
                    onGetSearchValue={setSearchValue}
                />
                :
                null
        }
    </div>
}