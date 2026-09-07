import { ArrowLeft } from "lucide-react";
import Layers_Date from "./Components/Layers-date/Layers_Date";
import { useState } from "react";
import Table_For_Read_Profits_Expenses from "./Components/Table-for-read-profits-expenses/Table_For_Read_Profits_Expenses";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
// ========================================================== //
export default function Profits_And_Expenses_Page() {
    const state = useSelector(function (state: store_Type) {
        return {
            settings: state.settings
        }
    }, shallowEqual);



    const [getYearInfo, setGetYearInfo] = useState({
        id: null,
        title: null
    });

    const [getMontInfo, setGetMonthInfo] = useState({
        id: null,
        title: null,
        monthNumber: null
    });

    const [getDayInfo, setGetDayInfo] = useState({
        id: null,
        title: null
    });




    return <section>
        <Layers_Date
            onGetYearInfo={setGetYearInfo as any}
            onGetMonthInfo={setGetMonthInfo as any}
            onGetDayInfo={setGetDayInfo as any}
        />

        <hr className="my-4" />

        {/* Steps */}
        <div className="flex items-center gap-1 text-lg mb-5">
            <span className="font-bold">
                {getYearInfo.id == null ? "-" : getYearInfo.title}
            </span>

            <ArrowLeft />

            <span className="font-bold">
                {getMontInfo.id == null ? "-" : getMontInfo.title}
            </span>

            <ArrowLeft />

            <span className="font-bold">
                {getDayInfo.id == null ? "-" : `اليوم ${getDayInfo.title}`}
            </span>
        </div>

        {
            getYearInfo.id != null && getMontInfo.id != null && getDayInfo.id != null ?
                <Table_For_Read_Profits_Expenses
                    yearId={getYearInfo.id}
                    monthId={getMontInfo.id}
                    dayInfo={getDayInfo}
                    countRowsInSlide={Number(state.settings.rowsInItemsTable)}
                />
                :
                <Not_Found
                    title="من فضلك قم بختيار [سنه, شهر, يوم] لإظهار البنود"
                    srcImg="/not_found_in_table.svg"
                />
        }
    </section>
}