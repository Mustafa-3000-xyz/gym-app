import Box from "@/Global-components/Box/Box";
import { BookUser, CalendarDays } from "lucide-react";
import Date_Box from "./Components/Date-box/Date_Box";
import Table_For_Trainers from "@/Global-components/Table-for-trainers/Table_For_Trainers";
import { useState } from "react";
import { dayDetails, trainer } from "../types";
import Fitler from "./Components/Filter/Fitler";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Search_Box_For_Trainers from "@/Global-components/Search-box-for-trainers/Search_Box_For_Trainers";
// ========================================================== //
export default function Attendance_Recorde_Page() {
    const state = useSelector(function (state: store_Type) {
        return {
            days: state.days,
        }
    }, shallowEqual);


    const [getTrainers, setGetTrainers] = useState<trainer[]>([]);
    const [getDayDetails, setGetDayDetails] = useState<dayDetails[]>([]);
    const [filterType, setFilterType] = useState<number | "allTrainers">("allTrainers");




    return <div>
        {/* Boxes */}
        <div className="mb-7 grid grid-cols-2 gap-3">
            <Box
                title="مجموع الحضور"
                total={getTrainers.length}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                icon={<BookUser
                    size={33}
                    strokeWidth={1.30}
                />}
            />

            <Box
                title="مجموع الايام التي حضر فيها المتدربين"
                total={state.days?.length || 0}
                styleIcon="bg-neutral-200 text-neutral-500"
                icon={<CalendarDays
                    size={33}
                    strokeWidth={1.30}
                />}
            />
        </div>

        {/* Search & date box & filter attendee */}
        <div className="bg-slate-100 p-3 py-7 rounded-lg grid grid-cols-4 gap-3">
            {/* Search */}
            <div className="col-span-2">
                <Search_Box_For_Trainers arrayForSearch={getTrainers} />
            </div>

            {/* Date box & filter attendee */}
            <div className="col-span-2 grid grid-cols-2 gap-3">
                <Date_Box
                    onChangeFilterType={setFilterType}
                    onGetDayDetails={setGetDayDetails}
                />

                <Fitler
                    filterType={filterType}
                    dayDetails={getDayDetails}
                    onChangeFilterType={setFilterType}
                    onGetTrainers={setGetTrainers}
                />
            </div>
        </div>

        {/* Table */}
        <Table_For_Trainers trainersList={getTrainers} />
    </div>
}