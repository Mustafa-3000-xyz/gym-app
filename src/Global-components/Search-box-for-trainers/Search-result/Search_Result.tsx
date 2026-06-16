import Animation from "@/Global-components/Animation/Animation";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { Search_Result_Props } from "@/Global-components/types";
import { styleForSubscriptionState } from "@/Lib/functions";
import { trainer } from "@/Pages/types";
import { addTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Search_Result(
    {
        searchInpRef,
        arrayContainsTrainers,
        onIsShowSearchResult,
    }: Search_Result_Props
) {
    const dispatch = useDispatch();
    const searchResultRef = useRef<HTMLDivElement>(null);



    function showTrainer(trainer: trainer) {
        onIsShowSearchResult(false);
        dispatch(addTrainerDetails(trainer))
    }



    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                !searchInpRef?.contains(e.target as any)
                &&
                (
                    searchResultRef.current != e.target
                    &&
                    !searchResultRef.current?.contains(e.target as any)
                )
            ) {
                onIsShowSearchResult(false);
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
            transform overflow-auto  z-10 flex flex-col justify-center items-center gap-3
            absolute border border-black/15 bg-slate-100 p-3
        `}

        initial={{
            y: -30
        }}

        animate={{
            y: 10
        }}
    >
        {
            arrayContainsTrainers.length == 0 ?
                <Not_Found
                    srcImg='not_found_in_drop_menu.svg'
                    title=' لا يوجد نتائج'
                    className='w-28'
                />
                :
                arrayContainsTrainers.map(ele => (
                    <button
                        key={ele.id}
                        onClick={() => showTrainer(ele)}
                        className="flex justify-between items-center w-full bg-slate-200 p-3 rounded-md cursor-pointer"
                    >
                        {/* First name & last name & id */}
                        <div className='flex flex-col items-start'>
                            <h3 className=' font-bold mb-1'>
                                {ele.firstName} {ele.lastName}
                            </h3>
                            <p className='underline'>
                                {ele.id}
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
    </Animation>
}