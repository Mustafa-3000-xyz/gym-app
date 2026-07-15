import { Download, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { check, Update } from '@tauri-apps/plugin-updater';
import { alert, normalAlert } from "@/Lib/functions";
import { relaunch } from '@tauri-apps/plugin-process';
import { useDispatch } from "react-redux";
import Popup_Download_Version from "@/Global-components/Popup-download-version/Popup_Download_Version";
import { hiddenOrShowSideBar } from "@/Rtk/Slices/UI-slices/sideBarSlice";
// ========================================================== //
export default function Update_App() {
    const dispatch = useDispatch();

    const [versionAppValue, setVersionAppValue] = useState<"stable" | "error" | "updating">("stable");
    const [startRotateAnimation, setStartRotateAnimation] = useState(false);

    const [theVersionSize, setTheVersionSize] = useState(0);
    const [theDownloaded, setTheDownloaded] = useState(0);

    const versionAppNow = "1.0.3";



    async function clickOnSearchUpdateBtn() {
        setStartRotateAnimation(true);

        try {
            const update = await check({
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });

            if (update) {
                setStartRotateAnimation(false);
                downloadAndInstallVersion(update);
            } else {
                setStartRotateAnimation(false);
                setVersionAppValue("stable");

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
            setVersionAppValue("error");
        }
    }

    function downloadAndInstallVersion(update: Update) {
        alert({
            titleBeforeClickOnOk: `هل تريد تحديث البرنامج لاصدار : ${update.version}`,
            titleAfterClickOnOk: "يتم التحديث الان",
            funRunWhenClickOnOk: async function () {
                dispatch(hiddenOrShowSideBar("hidden"));
                setVersionAppValue("updating");

                try {
                    await update.downloadAndInstall(function (event) {
                        switch (event.event) {
                            case 'Started':
                                setTheVersionSize(Number(event.data.contentLength));
                                break;
                            case 'Progress':
                                setTheDownloaded((x) => x += event.data.chunkLength)
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

                    dispatch(hiddenOrShowSideBar("show"));
                    setVersionAppValue("error");
                }
            }
        })
    }



    useEffect(function(){
        if (versionAppValue == "error") {
            setTheVersionSize(0);
            setTheDownloaded(0);
        }
    }, [versionAppValue]);




    return <div className="m-5 flex flex-col gap-3 items-center">
        {
            versionAppValue == "updating" ?
                <div className="bg-emerald-500 text-white px-6 py-2 pb-3 rounded-full text-lg font-bold flex items-center gap-3">
                    <Download size={23} />

                    <h3 className="">
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
                اصدار البرنامج
            </h3>

            <h3 className="font-bold underline">
                {versionAppNow}
            </h3>
        </div>

        {
            versionAppValue == "updating" ?
                <Popup_Download_Version
                    versionSize={theVersionSize}
                    downloaded={theDownloaded}
                />
                :
                null
        }
    </div>
}