import { X } from "lucide-react";
import { styleForSubscriptionState } from '@/Lib/functions';
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { Search_Result_Props, trainer } from "@/Pages/types";
import { useSetAtom } from "jotai";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
import Animation from "@/Global-components/Animation/Animation";
import { useEffect, useRef } from "react";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
// ========================================================== //
export default function Search_Result(
    {
        searchInpRef,
        searchResult,
        onIsShowSearchResult,
        onGetSearchResult,
        onGetSearchValue,
    }: Search_Result_Props
) {
    const setIsShowTrainerDetailsAtom = useSetAtom(isShowTrainerDetails_Atom);
    const setTrainerDetailsAtom = useSetAtom(trainerDetails_Atom);
    
    const searchResultRef = useRef<HTMLDivElement>(null);



    function close() {
        onIsShowSearchResult(false);
        onGetSearchResult([]);
        onGetSearchValue("");
    }


    function showTrainer(trainer: trainer) {
        setTrainerDetailsAtom(trainer);
        onIsShowSearchResult(false);
        setIsShowTrainerDetailsAtom(true);
        onGetSearchResult([]);
        onGetSearchValue("");
    }


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                (!searchInpRef.current?.contains(e.target as any))
                &&
                (searchResultRef.current != e.target &&
                    !searchResultRef.current?.contains(e.target as any))
            ) {
                close();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchInpRef, searchResultRef]);



    return <Animation
        ref={searchResultRef}
        className={`
            h-52 w-full
            translate-y-10  shadow-2xl
            transform overflow-auto  z-10 flex flex-col gap-2
            absolute border border-black/15 bg-slate-100 p-3
        `}

        initial={{
            y: -30
        }}

        animate={{
            y: 10
        }}
    >
        <div className='flex justify-end my-2'>
            <X
                onClick={close}
                size={18}
                className='cursor-pointer text-red-500'
            />
        </div>

        <div className='flex flex-col justify-center items-center gap-3'>
            {
                searchResult.length == 0 ?
                    <Not_Found
                        srcImg='not_found_in_search.svg'
                        title=' لا يوجد نتائج'
                        className='w-28'
                    />
                    :
                    searchResult.map(ele => (
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
                                        ${styleForSubscriptionState(ele).style}
                                    `}
                                >
                                    {
                                        styleForSubscriptionState(ele).title
                                    }
                                </p>
                            </div>
                        </button>
                    ))
            }
        </div>
    </Animation>
}