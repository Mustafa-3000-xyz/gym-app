import { useEffect, useState } from "react";
import { Progress_Props } from "../typesProps";
// ========================================================== //
export default function Progress(
    {
        classNameForParent,
        widthChild,
        percentage = null
    }: Progress_Props
) {
    const [colorProgress, setColorProgress] = useState("");



    useEffect(function () {
        if (percentage?.toString().includes("-")) {
            setColorProgress("bg-red-500");
        }
        else if(Number(percentage) < 100){
            setColorProgress("bg-neutral-500");
        }
        else{
            setColorProgress("bg-emerald-500");
        }
    }, [percentage]);



    return <div className={classNameForParent}>
        <div className="border-2 border-black/5 w-full h-[15px] mt-3 rounded-full">
            <div
                className={`
                    h-full rounded-full
                    ${colorProgress}
                `}
                style={{
                    width: `${Math.abs(Number(widthChild)) > 100 ? 100 : Math.abs(Number(widthChild))}%`
                }}
            ></div>
        </div>

        {
            percentage != null ?
                <h3 className="text-end mt-2 font-bold">
                    %{percentage}
                </h3>
                :
                null
        }
    </div>
}