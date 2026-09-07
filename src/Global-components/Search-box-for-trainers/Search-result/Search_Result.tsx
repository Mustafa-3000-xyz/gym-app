import Animation from "@/Global-components/Animation/Animation";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { Search_Result_Props } from "@/Global-components/typesProps";
import { styleDate, trainerPagePath } from "@/Lib/constants";
import { checkPermissionesInAccount, normalAlert } from "@/Lib/functions";
import { trainer_Type } from "@/Pages/types";
import { addTrainerDetails } from "@/Rtk/Slices/UI-slices/trainerDetailsSlice";
import { store_Type } from "@/Rtk/types";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// ========================================================== //
export default function Search_Result(
    {
        searchInpRef,
        arrayContainsTrainers,
        onIsShowSearchResult,
    }: Search_Result_Props
) {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);


    const navigation = useNavigate();
    const searchResultRef = useRef<HTMLDivElement>(null);

    const checkTrainerPagePermission = checkPermissionesInAccount({
        accountId: Number(state.logInInfo?.id),
        permissionType: trainerPagePath,
    });



    function showTrainer(trainer_Type: trainer_Type) {
        onIsShowSearchResult(false);
        dispatch(addTrainerDetails(trainer_Type));

        if (checkTrainerPagePermission) {
            navigation(trainerPagePath);
        }
        else {
            normalAlert({
                title: "المعذره",
                text: "ليس لديك الصلاحيه للوصول الى صفحة المتدربين  لمعرفة تفاصيل المتدرب",
                icon: "error"
            });
        }
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
            h-60 w-full
            translate-y-10 shadow-2xl
            transform overflow-auto z-10 flex flex-col  items-center gap-3
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
                    srcImg='/not_found_in_drop_menu.svg'
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
                        <div className='flex gap-1 items-start'>
                            <h3 className=' font-bold mb-1'>
                                {ele.firstName} {ele.lastName}
                            </h3>
                            <p className=''>
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
                    </button>
                ))
        }
    </Animation>
}