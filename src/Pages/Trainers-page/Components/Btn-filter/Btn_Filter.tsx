import { ListFilter } from "lucide-react";
import { Btn_Filter_Props, filter, trainer } from "@/Pages/types";
import { useEffect, useRef, useState } from "react";
import Menu from "./Menu/Menu";
import { activeSubscriptions, allSubscriptions, fromOldToNew, pendingSubscriptions, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
// ========================================================== //
export default function Btn_Filter(
    {
        trainersList,
        onGetFilter,
        onGetTrainerListAfterFilter
    }: Btn_Filter_Props
) {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const btnFilterRef = useRef<HTMLButtonElement>(null);

    const [filterResuletList, setFilterResultList] = useState<trainer[]>([]);
    const [filterObj, setFilterObj] = useState<filter>({
        arrange: JSON.parse(localStorage.getItem("filter") as any).arrange,
        subscriptionType: JSON.parse(localStorage.getItem("filter") as any).subscriptionType
    });



    // This for show menu or hidden menu
    function clickOnBtnFilter() {
        if (!isShowMenu) {
            setIsShowMenu(true);
        } else {
            setIsShowMenu(false);
        }
    }



    /* 
        Make filter and send to show in [All_Ttrainers] file 
        and update the values in filterObj
    */
    useEffect(function () {
        let arr: trainer[] = [];


        // clone the list before sorting to avoid mutating props or frozen data
        const resultArrange = [...trainersList].sort(function (a, b) {
            if (filterObj.arrange == fromOldToNew) {
                return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            }
            else {
                return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            }
        });


        if (filterObj.subscriptionType == allSubscriptions) {
            resultArrange.forEach(ele => arr.push(ele));
        }
        else if (filterObj.subscriptionType == activeSubscriptions) {
            resultArrange.forEach(ele => ele.subscriptionState == stateIsActive && arr.push(ele));
        }
        else if (filterObj.subscriptionType == pendingSubscriptions) {
            resultArrange.forEach(ele => ele.subscriptionState == stateIsPending && arr.push(ele));
        }
        else {
            resultArrange.forEach(ele => ele.subscriptionState == stateIsFinished && arr.push(ele));
        }


        setFilterResultList(arr);
        onGetFilter(filterObj);
        localStorage.setItem("filter", JSON.stringify(filterObj) as any);
    }, [filterObj, trainersList]);


    useEffect(function () {
        onGetTrainerListAfterFilter(filterResuletList);
    }, [filterResuletList]);



    return <div className="relative flex justify-center">
        <button
            onClick={clickOnBtnFilter}
            ref={btnFilterRef}
            className={`
                ${isShowMenu ? "bg-slate-200" : "hover:bg-slate-200"}
                transition duration-500 cursor-pointer
                flex items-center gap-2 bg-slate-100 p-3 px-4 border border-slate-300 rounded-lg
        `}
        >
            <ListFilter size={23} />

            <span className=" font-medium">
                تصنيف
            </span>
        </button>


        {
            isShowMenu ?
                <Menu
                    btnFilterEle={btnFilterRef.current as any}
                    filterObj={filterObj}
                    onIsShowMenu={setIsShowMenu}
                    onGetFilterResult={setFilterObj}
                />
                :
                null
        }
    </div>
}