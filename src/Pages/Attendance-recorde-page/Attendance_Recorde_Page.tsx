import Box from "@/Global-components/Box/Box";
import { BookUser, CalendarDays } from "lucide-react";
import Date_Box from "./Components/Date-box/Date_Box";
import Table_For_Trainers from "@/Global-components/Table-for-trainers/Table_For_Trainers";
import { useEffect, useState } from "react";
import { attendanceDetails_Type, trainer_Type } from "../types";
import Fitler from "./Components/Filter/Fitler";
import Search_Box_For_Trainers from "@/Global-components/Search-box-for-trainers/Search_Box_For_Trainers";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import { getAllRowsInAttendanceTable } from "@/Rtk/Slices/Db-slices/attendanceSlice";
// ========================================================== //
export default function Attendance_Recorde_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            attendance: state.attendance,
            trainers: state.trainers,
            settings: state.settings
        }
    }, shallowEqual);


    const [datesTotal, setDatesTotal] = useState(0);
    const [getTrainers, setGetTrainers] = useState<trainer_Type[]>([]);

    const [getAllAttendanceInSpecificDate, setGetAllAttendanceInSpecificDate] = useState<attendanceDetails_Type[]>([])
    const [filterType, setFilterType] = useState<number | "allTrainers">("allTrainers");



    useEffect(function () {
        if (state.attendance?.length == 0) {
            dispatch(getAllRowsInAttendanceTable() as any);
        }
    }, [state.attendance?.length]);




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
                total={datesTotal || 0}
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
                    onGetDatesTotal={setDatesTotal}
                    onChangeFilterType={setFilterType}
                    onGetDayDetails={setGetAllAttendanceInSpecificDate}
                />

                <Fitler
                    filterType={filterType}
                    dayDetails={getAllAttendanceInSpecificDate}
                    onGetTrainers={setGetTrainers}
                    onChangeFilterType={setFilterType}
                />
            </div>
        </div>

        <Table_For_Trainers
            trainersList={getTrainers}
            countRowsInSlide={Number(state.settings.rowsInAttendanceTable)}
        />
    </div>
}