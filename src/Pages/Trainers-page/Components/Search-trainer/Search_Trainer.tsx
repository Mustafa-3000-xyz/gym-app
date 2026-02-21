import { Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Search_Trainer_Props, trainer } from '../../trainersTypes';
import { stateIsActive, stateIsFinished, stateIsPending } from '@/Lib/customs';
import { useAtom } from 'jotai';
import trainerDetails_Atom from '@/Atoms/trainerDetails_Atom';
import Not_Found from '@/Global-components/Not-found/Not_Found';
// ========================================================== //
export default function Search_Trainer(
    { trainersList, onIsShowTrainerDetails }: Search_Trainer_Props
) {
    const [, setTrainerDetailsAtom] = useAtom(trainerDetails_Atom);

    const [isShowResultSearch, setIsShowResultSearch] = useState(false);
    const [resultSearch, setResultSearch] = useState<trainer[]>([]);
    const [searchValue, setSearchValue] = useState("");



    function clickOnEnter(e: React.KeyboardEvent) {
        if (e.key == "Enter" && searchValue != "") {
            const result = trainersList.filter(ele => (
                ele.firstName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                || ele.lastName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
                || String(ele.trainerId).includes(searchValue)
            ));

            setIsShowResultSearch(true);
            setResultSearch(result);
        }
    }


    function showTrainer(trainer: trainer) {
        setTrainerDetailsAtom(trainer);
        setIsShowResultSearch(false);
        onIsShowTrainerDetails(true);
        setResultSearch([]);
        setSearchValue("");
    }


    useEffect(function () {
        if (!searchValue) {
            setIsShowResultSearch(false);
            setResultSearch([]);
        }

        window.addEventListener("keydown", clickOnEnter as any)
        return () => window.removeEventListener("keydown", clickOnEnter as any);
    }, [searchValue]);




    return <div className="flex relative col-span-3 ">
        {/* Inp search */}
        <div className='w-full h-full'>
            <input
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={trainersList.length <= 1 ? true : false}
                value={searchValue}
                type="text"
                placeholder="البحث عن المتدرب من خلال الاسم او من خلال رقم المتدرب"
                className={`
                    focus:outline-0
                    h-full w-full z-20 relative
                    bg-slate-100 border border-slate-300 ps-10 py-2
                    ${isShowResultSearch ? "rounded-lg rounded-b-none" : ""}
                    ${trainersList.length <= 1 ? "opacity-35 cursor-not-allowed" : "opacity-100"}
                `}
            />

            <Search size={23} className="absolute z-20 top-3 ms-3 opacity-40" />
        </div>

        {
            trainersList.length <= 1 ?
                null
                :
                // Result search
                <div className={`
                    transform 
                    ${isShowResultSearch ? " transition-all duration-500 translate-y-12 h-52 w-full shadow-2xl"
                        : "translate-y-0 h-0 rounded-t-lg w-72"} 
                        overflow-auto  z-10
                        absolute border border-black/15 bg-slate-100 p-3
                        flex flex-col gap-2
                    `}
                >
                    <div className='flex justify-end my-2'>
                        <X
                            onClick={() => {
                                setIsShowResultSearch(false);
                                setResultSearch([]);
                                setSearchValue("");
                            }}
                            size={18}
                            className='cursor-pointer text-red-500'
                        />
                    </div>

                    <div className='flex flex-col justify-center items-center gap-3'>
                        {
                            resultSearch.length == 0 ?
                                <Not_Found
                                    srcImg='not_found_in_search.svg'
                                    title=' لا يوجد نتائج'
                                    className='w-28'
                                />
                                :
                                resultSearch.map(ele => (
                                    <button
                                        key={ele.trainerId}
                                        onClick={() => showTrainer(ele)}
                                        className={`
                                            flex justify-between items-center w-full bg-slate-200
                                            p-3 rounded-md cursor-pointer
                                        `}
                                    >
                                        {/* First name & last name & id */}
                                        <div className='flex flex-col items-start'>
                                            <h3 className=' font-bold mb-1'>
                                                {ele.firstName} {ele.lastName}
                                            </h3>
                                            <p className='underline'>
                                                {ele.trainerId}
                                            </p>
                                        </div>

                                        {/* Subscription state */}
                                        <div>
                                            <p className={`
                                            px-3 py-1 rounded-full font-bold
                                                    ${ele.subscriptionState == stateIsActive ?
                                                    "bg-emerald-100 text-emerald-500"
                                                    : ele.subscriptionState == stateIsPending ?
                                                        "bg-amber-100 text-amber-500"
                                                        : ele.subscriptionState == stateIsFinished && "bg-red-100 text-red-500"
                                                }
                                            `}
                                            >
                                                {ele.subscriptionState == stateIsActive ?
                                                    "مفعل"
                                                    : ele.subscriptionState == stateIsPending ?
                                                        "معلق"
                                                        : ele.subscriptionState == stateIsFinished && "منتهي"
                                                }
                                            </p>
                                        </div>
                                    </button>
                                ))
                        }
                    </div>
                </div>
        }
    </div>
}