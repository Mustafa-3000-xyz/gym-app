import { Download, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { check } from '@tauri-apps/plugin-updater';
import { alert, normalAlert } from "@/Lib/functions";
import { relaunch } from '@tauri-apps/plugin-process';
import Popup_Download_Version from "../Popup-download-version/Popup_Download_Version";
// ========================================================== //
export default function Update_App() {
    const [versionStatus, setVersionStatus] = useState<"stable" | "error" | "updating" | "search">("stable");
    const [startRotateAnimation, setStartRotateAnimation] = useState(false);

    const [versionSize, setVersionSize] = useState(0);
    const [downloaded, setDownloaded] = useState(0);

    const versionAppNow = "1.0.0";



    async function clickOnSearchUpdateBtn() {
        if (versionStatus == "search") return;


        setStartRotateAnimation(true);
        setVersionStatus("search");


        try {
            const update = await check({
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });

            if (update) {
                alert({
                    titleBeforeSubmit: "تحديث جديد",
                    textBeforeSubmit: `هل تريد تحديث البرنامج لاصدار : ${update.version}`,
                    runFunctionAfterSubmit: async function () {
                        setVersionStatus("updating");

                        try {
                            await update.downloadAndInstall(function (event) {
                                switch (event.event) {
                                    case 'Started':
                                        setVersionSize(Number(event.data.contentLength));
                                        break;
                                    case 'Progress':
                                        setDownloaded((x) => x += event.data.chunkLength)
                                        break;
                                }
                            });

                            await relaunch();
                        }
                        catch (err) {
                            normalAlert({
                                title: "خطا اثناء تحميل وثبيت التحديث",
                                text: String(err),
                                icon: "error"
                            });

                            setVersionStatus("error");
                        }
                    },

                    runFunctionAfterCancel: function () {
                        setVersionStatus("stable");
                        setStartRotateAnimation(false);
                    }
                });

                setStartRotateAnimation(false);
            }
            else {
                setStartRotateAnimation(false);
                setVersionStatus("stable");

                normalAlert({
                    title: "تهانينا",
                    text: "انت الان على احدث اصدار من البرنامج",
                    icon: "success"
                });
            }
        }
        catch (err) {
            normalAlert({
                title: "خطا اثناء جلب التحديث",
                text: String(err),
                icon: "error"
            });

            setStartRotateAnimation(false);
            setVersionStatus("error");
        }
    }



    useEffect(function () {
        if (versionStatus != "updating") {
            setVersionSize(0);
            setDownloaded(0);
        }
    }, [versionStatus]);




    return <div className="m-5 flex flex-col gap-3 items-center">
        {
            versionStatus == "updating" ?
                <div className="bg-emerald-500 text-white px-6 py-2 pb-3 rounded-full text-lg font-bold flex items-center gap-3">
                    <Download size={23} />

                    <h3>
                        جاري التحديث
                    </h3>
                </div>
                :
                <button
                    className={`
                        transition-all px-6 py-2 rounded-full
                        flex justify-center items-center gap-3
                        bg-slate-500 border-slate-600 text-white cursor-pointer
                        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
                        border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                    `}
                    onClick={clickOnSearchUpdateBtn}
                >
                    <RefreshCcw
                        size={23}
                        className={` ${startRotateAnimation ? "animate-spin" : ""} `}
                    />

                    <span className='text-lg'>
                        البحث عن تحديث
                    </span>
                </button>
        }

        <div className="text-center">
            <h3 className="font-bold text-lg">
                اصدار البرنامج (BETA)
            </h3>

            <h3 className="font-bold underline">
                {versionAppNow}
            </h3>
        </div>

        {
            versionStatus == "updating" ?
                <Popup_Download_Version
                    versionSize={versionSize}
                    downloaded={downloaded}
                />
                :
                null
        }
    </div>
}