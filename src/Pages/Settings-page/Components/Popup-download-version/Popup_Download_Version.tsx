import { useEffect, useState } from "react";
import Animation from "@/Global-components/Animation/Animation";
import Progress from "@/Global-components/Progress/Progress";
import { Popup_Download_Version_Props } from "@/Global-components/types";
// ========================================================== //
export default function Popup_Download_Version(
    { versionSize, downloaded }: Popup_Download_Version_Props
) {
    const [totalSize, setTotalSize] = useState<any>("");
    const [totalDownloaded, setTotalDownloaded] = useState<any>("");

    const checkIsNan = isNaN(Math.trunc(Number(totalDownloaded) / Number(totalSize) * 100)) ? 0 : Math.trunc(Number(totalDownloaded) / Number(totalSize) * 100)



    useEffect(function () {
        setTotalSize((versionSize / 1024 / 1024).toFixed(2));
        setTotalDownloaded((downloaded / 1024 / 1024).toFixed(2));
    }, [versionSize, downloaded]);




    return <Animation
        initial={{ x: 0, y: 0 }}
        animate={{ x: 35, y: 30 }}
        className="select-none z-50 absolute end-0 border-2 border-black/40 bg-slate-200 w-[320px] rounded-lg p-5 shadow-2xl shadow-gray-500"
    >
        {/* Title */}
        <h3 className="font-bold">
            حجم التحديث : <span>{totalSize} MP</span>
        </h3>

        <Progress
            widthChild={checkIsNan}
            percentage={checkIsNan}
        />
    </Animation>
}