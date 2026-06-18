import Bottom_Content_For_The_Drop from "@/Global-components/Drop-menu/Bottom-content-for-the-drop/Bottom_Content_For_The_Drop";
import Drop_Menu from "@/Global-components/Drop-menu/Drop_Menu";
import Top_Content_For_The_Drop from "@/Global-components/Drop-menu/Top-content-for-the-drop/Top_Content_For_The_Drop";
import { Filter_For_Attendance_Props } from "@/Pages/types";
import { store_Type } from "@/Rtk/types";
import { ArrowDownWideNarrow } from "lucide-react";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// ========================================================== //
export default function (
    {
        filterType,
        dayDetails,
        onGetTrainers,
        onChangeFilterType
    }: Filter_For_Attendance_Props
) {
    const [trainersIds, setTrainersIds] = useState<number[]>([]);
    const state = useSelector(function (state: store_Type) {
        return {
            trainers: state.trainers,
            accountes: state.accountes,
        }
    }, shallowEqual);




    // This for get all trainers ids 
    useEffect(function () {
        const arr: number[] = [];

        if (filterType == "allTrainers") {
            dayDetails.forEach(function (ele) {
                const convertToArray = JSON.parse(ele.trainers as any);

                arr.push(...convertToArray);
            });
        }
        else {
            const getRowByAccountId = dayDetails.find(ele => ele.accountId == filterType);
            const convertToArray = JSON.parse(getRowByAccountId?.trainers as any);

            arr.push(...convertToArray);
        }

        setTrainersIds(arr);
    }, [filterType, dayDetails]);

    // This for get all trainers
    useEffect(function () {
        const result = trainersIds.map(function (id) {
            return state.trainers?.find(ele => ele.trainerId == id);
        }).filter(Boolean);

        onGetTrainers(result as any);
    }, [trainersIds, state.trainers]);





    return <Drop_Menu
        classNameForMenu="w-full"
        messageForNotAddChildren={"لا يوجد حسابات"}
    >
        <Top_Content_For_The_Drop className="flex gap-3 items-center">
            <ArrowDownWideNarrow />
            <h4 className="text-lg font-bold">تصنيف</h4>
        </Top_Content_For_The_Drop>

        {
            dayDetails.length != 0 ?
                <Bottom_Content_For_The_Drop className={`${trainersIds.length >= 4 ? "h-[209px] overflow-auto p-3" : ""}`}>
                    {
                        dayDetails.map(ele => {
                            const getAccount = state.accountes?.find(acc => acc.id == ele.accountId);

                            return <button
                                key={ele.id}
                                className={`
                                    duration-300
                                    text-center w-full mb-2 bg-slate-200 p-3 font-bold cursor-pointer rounded-lg
                                    ${filterType == ele.accountId ? "!bg-emerald-500 text-white" : "hover:bg-emerald-500 hover:text-white"}
                                `}
                                onClick={() => onChangeFilterType(ele.accountId)}
                            >
                                {
                                    getAccount ?
                                        getAccount.name.slice(0, 11)
                                        :
                                        "الحساب محذوف"
                                }
                            </button>
                        })
                    }

                    <button
                        className={`
                            duration-300
                            text-center w-full mb-2 bg-slate-200 p-3 font-bold cursor-pointer rounded-lg
                            hover:bg-emerald-500 hover:text-white
                            ${filterType == "allTrainers" ? "!bg-emerald-500 text-white" : ""}
                        `}
                        onClick={() => onChangeFilterType("allTrainers")}
                    >
                        كل المتدربين
                    </button>
                </Bottom_Content_For_The_Drop>
                :
                null
        }
    </Drop_Menu>
}