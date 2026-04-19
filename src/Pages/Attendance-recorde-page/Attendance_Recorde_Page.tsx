import Box from "@/Global-components/Box/Box";
import Input_Search from "@/Global-components/Input-search/Input_Search";
import { BookUser, CalendarDays } from "lucide-react";
import Date_Box from "./Components/Date-box/Date_Box";
import Filter_Attendee from "./Components/Filter-attendee/Filter_Attendee";
import Table_For_Trainers from "@/Global-components/Table-for-trainers/Table_For_Trainers";
// ========================================================== //
export default function Attendance_Recorde_Page() {
    return <div>
        {/* Boxes */}
        <div className="mb-7 grid grid-cols-2 gap-3">
            <Box
                title="مجموع الحضور"
                total={34243}
                styleIcon="bg-(--thirdColor)/10 text-(--thirdColor)"
                icon={<BookUser
                    size={33}
                    strokeWidth={1.30}
                />}
            />

            <Box
                title="مجموع الايام التي حضر فيها المتدربين"
                total={34243}
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
                <Input_Search
                    placeholder="البحث عن حاضر"
                    onGetValue={() => null}
                />
            </div>

            {/* Date box & filter attendee */}
            <div className="col-span-2 flex gap-3">
                <div className="w-4/5">
                    <Date_Box />
                </div>
                
                <div className="w-2/7">
                    <Filter_Attendee />
                </div>
            </div>
        </div>

        {/* Table */}
        <Table_For_Trainers trainersList={[]}/>
    </div>
}