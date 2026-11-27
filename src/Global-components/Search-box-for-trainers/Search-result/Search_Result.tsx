import Not_Found from "@/Global-components/Not-found/Not_Found";
import { Search_Result_Props } from "@/Global-components/typesProps";
import { styleDate, trainerDetailsPagePath } from "@/Lib/constants";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// ========================================================== //
export default function Search_Result(
    {
        arrayContainsTrainers,
        onIsShowSearchResult,
    }: Search_Result_Props
) {
    const navigate = useNavigate();
    const searchResultRef = useRef<HTMLDivElement>(null);



    function showTrainer(trainerId: number) {
        onIsShowSearchResult(false);
        navigate(trainerDetailsPagePath.replace(":trainerId", trainerId as any));
    }



    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                searchResultRef.current != e.target
                &&
                !searchResultRef.current?.contains(e.target as any)
            ) {
                onIsShowSearchResult(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchResultRef]);




    return <motion.div
        ref={searchResultRef}
        className={`
            h-60 w-full
            translate-y-2 shadow-2xl
            transform overflow-auto z-10 flex flex-col  items-center gap-3
            absolute border-4 border-(--thirdColor)/50 bg-slate-100 p-3 rounded-lg
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
                <div className="w-full h-full flex justify-center items-center">
                    <Not_Found
                        srcImg='/not_found_in_drop_menu.svg'
                        title=' لا يوجد نتائج'
                        className='w-28'
                    />
                </div>
                :
                arrayContainsTrainers.map(ele => (
                    <div
                        key={ele.id}
                        onClick={() => showTrainer(Number(ele.id))}
                        className="flex justify-between items-center w-full bg-slate-200 p-3 rounded-md cursor-pointer"
                    >
                        {/* First name & last name & id */}
                        <div className='flex gap-1 items-start'>
                            <h3 className=' font-bold mb-1'>
                                {ele.firstName} {ele.lastName}
                            </h3>
                            <p>
                                ({ele.id})
                            </p>
                        </div>

                        {/* Dates */}
                        <div className="flex flex-col gap-1">
                            <p className="font-bold underline">
                                {format(new Date(ele.subscriptionStart), styleDate)}
                            </p>

                            <p className="font-bold underline">
                                {format(new Date(ele.subscriptionEnd), styleDate)}
                            </p>
                        </div>
                    </div>
                ))
        }
    </motion.div>
}