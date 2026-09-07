import { useEffect, useState } from "react";
import Animation from "@/Global-components/Animation/Animation";
import Progress from "@/Global-components/Progress/Progress";
import { Popup_Download_Version_Props } from "@/Global-components/typesProps";
// ========================================================== //
export default function Popup_Download_Version(
    { versionSize, downloaded }: Popup_Download_Version_Props
) {
    const [convertVersionSizeToMb, setConvertVersionSizeToMb] = useState("");
    const [percentageForProgress, setPercentageForProgress] = useState(0);



    useEffect(function () {
        if (!isNaN(Math.trunc(Number(downloaded) / Number(versionSize) * 100))) {
            setPercentageForProgress(Math.trunc(Number(downloaded) / Number(versionSize) * 100));
        }
        else {
            setPercentageForProgress(0);
        }

        setConvertVersionSizeToMb((versionSize / 1024 / 1024).toFixed(2));
    }, [versionSize, downloaded]);



    return <div className="absolute z-50 left-0 top-0 h-screen w-full flex justify-center items-center bg-black/40">
        <Animation
            initial={{ x: 0, y: 0 }}
            animate={{ x: 35, y: 30 }}
            className="select-none border-2 border-black/40 bg-slate-200 w-[320px] rounded-lg p-5 shadow-2xl shadow-gray-500"
        >
            {/* Title */}
            <h3 className="font-bold">
                حجم التحديث : <span>{convertVersionSizeToMb} MP</span>
            </h3>

            <Progress
                widthChild={percentageForProgress}
                percentage={percentageForProgress}
            />
        </Animation>
    </div>
}