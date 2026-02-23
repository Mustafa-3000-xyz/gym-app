import { X } from "lucide-react";
import { styleForSubscriptionState } from '@/Lib/customs';
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { Search_Result_Props, trainer } from "@/Pages/Trainers-page/types";
import { useAtom } from "jotai";
import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
// ========================================================== //
export default function Search_Result(
    {
        isShowSearchResult,
        searchResult,
        onIsShowTrainerDetails,
        onIsShowSearchResult,
        onGetSearchResult,
        onGetSearchValue,
    }: Search_Result_Props
) {
    const [, setTrainerDetailsAtom] = useAtom(trainerDetails_Atom);


    function close() {
        onIsShowSearchResult(false);
        onGetSearchResult([]);
        onGetSearchValue("");
    }


    function showTrainer(trainer: trainer) {
        setTrainerDetailsAtom(trainer);
        onIsShowSearchResult(false);
        onIsShowTrainerDetails(true);
        onGetSearchResult([]);
        onGetSearchValue("");
    }



    return <div className={`
            transform overflow-auto  z-10 flex flex-col gap-2
            absolute border border-black/15 bg-slate-100 p-3
            ${isShowSearchResult ? " transition-all duration-500 translate-y-12 h-52 w-full shadow-2xl"
            : "translate-y-0 h-0 rounded-t-lg w-72"} 
        `}
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
    </div>
}