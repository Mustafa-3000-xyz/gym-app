import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { check, Update } from '@tauri-apps/plugin-updater';
import { alert, normalAlert } from "@/Lib/functions";
import { relaunch } from '@tauri-apps/plugin-process';
// ========================================================== //
export default function Update_App() {
    const [versionAppValue, setVersionAppValue] = useState<null | "stable" | "newVersion">(null);
    const [startRotateAnimation, setStartRotateAnimation] = useState(false);

    const [updateSize, setUpdateSize] = useState(0);
    const [downloaded, setDownloaded] = useState(0);



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
            }
        }
        catch (err) {
            normalAlert({
                title: "خطا اثناء جلب التحديث",
                text: String(err),
                icon: "error"
            });
            setStartRotateAnimation(false);
            setVersionAppValue(null);
        }
    }

    function downloadAndInstallVersion(update: Update) {
        alert({
            titleBeforeClickOnOk: `هل تريد تحديث البرنامج لاصدار : ${update.version}`,
            titleAfterClickOnOk: "يتم التحديث الان",
            funRunWhenClickOnOk: async function () {
                setVersionAppValue("newVersion");

                try {
                    await update.downloadAndInstall(function (event) {
                        switch (event.event) {
                            case 'Started':
                                setUpdateSize(Number(event.data.contentLength));
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
                    setVersionAppValue(null);
                }
            }
        })
    }



    return <div className="m-5">
        {
            versionAppValue == null ?
                <button
                    className={`
                        transition-all px-6 py-2 rounded-lg
                        flex justify-center items-center gap-3
                        border-blue-600 bg-blue-500 text-white cursor-pointer
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
                :
                versionAppValue == "stable" ?
                    <div>
                        انت الان على احدث اصدار من التطبيق
                    </div>
                    :
                    <div>
                        <h3>
                            جاري التحديث
                        </h3>

                        <p>
                            {updateSize} MP
                        </p>

                        <p>
                            {downloaded} MP
                        </p>
                    </div>
        }
    </div>
}