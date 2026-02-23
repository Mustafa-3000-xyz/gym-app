import { ListFilter } from "lucide-react";
import { Btn_Filter_Props, filter, trainer } from "../../types";
import { useEffect, useRef, useState } from "react";
import Menu from "./Menu/Menu";
import { activeSubscriptions, allSubscriptions, finishedSubscriptions, fromOldToNew, pendingSubscriptions, stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/customs";
// ========================================================== //
export default function Btn_Filter(
    { trainersList, onGetFilterResult }: Btn_Filter_Props
) {
    const getFilter = JSON.parse(localStorage.getItem("filter") as any) as filter;

    const [isShowMenu, setIsShowMenu] = useState(false);
    const btnFilterRef = useRef<HTMLButtonElement>(null);

    const [filterResuletList, setFilterResultList] = useState<trainer[]>([]);
    const [filterObj, setFilterObj] = useState<filter>({
        arrange: getFilter ? getFilter.arrange : fromOldToNew,
        subscriptionType: getFilter ? getFilter.subscriptionType : allSubscriptions
    });



    // This for show menu or hidden menu
    function clickOnBtnFilter() {
        if (!isShowMenu) {
            setIsShowMenu(true);
        } else {
            setIsShowMenu(false);
        }
    }


    // When update the value in filterObj, so save in localstorage
    useEffect(function () {
        localStorage.setItem("filter", JSON.stringify(filterObj) as any);
    }, [filterObj]);


    useEffect(function () {
        onGetFilterResult(filterResuletList as trainer[]);
    }, [filterResuletList]);


    // Make filter and send to show in [All_Ttrainers] file
    useEffect(function () {
        const resultArrange = trainersList.sort(function (a, b) {
            if (filterObj.arrange == fromOldToNew) {
                return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            }

            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        });

        let arr: trainer[] = [];
        arr = [];


        if (filterObj.subscriptionType != allSubscriptions) {
            resultArrange.forEach(function (ele) {
                if (
                    (filterObj.subscriptionType == activeSubscriptions)
                    &&
                    (ele.subscriptionState == stateIsActive)
                ) {
                    arr.push(ele);
                }
                else if (
                    (filterObj.subscriptionType == pendingSubscriptions)
                    &&
                    (ele.subscriptionState == stateIsPending)
                ) {
                    arr.push(ele);
                }
                else if (
                    (filterObj.subscriptionType == finishedSubscriptions)
                    &&
                    (ele.subscriptionState == stateIsFinished)
                ) {
                    arr.push(ele);
                }
            });
        }
        else {
            resultArrange.forEach(ele => arr.push(ele));
        }


        setFilterResultList(arr as trainer[]);
    }, [filterObj, trainersList]);



    return <div className="relative flex justify-center">
        <button
            disabled={trainersList.length <= 1 ? true : false}
            onClick={clickOnBtnFilter}
            ref={btnFilterRef}
            className={`
                ${trainersList.length <= 1 ? "cursor-not-allowed opacity-40"  :  "cursor-pointer opacity-100"}
                ${isShowMenu ? "bg-slate-200" : "hover:bg-slate-200"}
                transition duration-500 
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