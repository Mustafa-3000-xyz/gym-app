import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { useEffect, useState } from 'react';
import { HardDriveDownload, RefreshCcw } from 'lucide-react';
import { alert } from '@/Lib/functions';
// ========================================================== //
export default function Update_App() {
    const [versionAppValue, setVersionAppValue] = useState<null | "error" | "stable" | "newVersion">(null);

    const [timer, setTimer] = useState(1);
    const [startRotateAnimation, setStartRotateAnimation] = useState(false);

    const [updateSize, setUpdateSize] = useState(0);
    const [downloaded, setDownloaded] = useState(0);



    async function clickOnSearchForNewUpdateBtn() {
        if (versionAppValue == "error" || versionAppValue == "stable" || versionAppValue == "newVersion") return;

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
                checkForDownloadAndInstallUpdate(update);
            } else {
                setStartRotateAnimation(false);
                setVersionAppValue("stable");
            }
        }
        catch (err) {
            setVersionAppValue("error");
            setStartRotateAnimation(false);
        }
    }

    function checkForDownloadAndInstallUpdate(update: Update) {
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
                catch {
                    setVersionAppValue("error");
                }
            }
        })
    }




    // Reset versionAppValue after 30 seconds if the versionAppValue is error
    useEffect(function () {
        if (versionAppValue != "error") return;

        let total = 1;

        const clearMyInterval = setInterval(function () {
            if (total == 30) {
                clearInterval(clearMyInterval);
                setVersionAppValue(null);
                setTimer(0);

                total = 0;
            }

            total += 1;
            setTimer(total);
        }, 1000);


        return () => clearInterval(clearMyInterval);
    }, [versionAppValue]);




    return <div>
        {
            versionAppValue == null || versionAppValue == "error" ?
                <div className='flex flex-col items-start m-5 gap-3'>
                    <button
                        className={`
                            border-blue-600 bg-blue-500 text-white
                            flex justify-center items-center gap-3
                            transition-all px-6 py-2 rounded-lg
                            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
                            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                            ${versionAppValue == "error" ? "cursor-not-allowed opacity-45" : "cursor-pointer"}
                        `}
                        disabled={versionAppValue == "error" ? true : false}
                        onClick={clickOnSearchForNewUpdateBtn}
                    >
                        <RefreshCcw
                            size={23}
                            className={`
                                ${startRotateAnimation ? "animate-spin" : ""}
                            `}
                        />

                        <span className='text-lg'>
                            البحث عن تحديث
                        </span>
                    </button>

                    <p className='font-bold'>
                        الاصدار الحالي : (1.0.0)
                    </p>

                    {
                        versionAppValue == "error" ?
                            <p className='text-white border-red-500 bg-red-500 rounded-lg px-6 py-2 text-lg font-bold'>
                                <span>
                                    حدث خطا, انتظر 30 ثانية :
                                </span>

                                <span>
                                    {timer}
                                </span>
                            </p>
                            :
                            null
                    }
                </div>
                :
                versionAppValue == "stable" ?
                    <div className='flex justify-start'>
                        <p className={`
                            transition-all rounded-lg select-none font-bold
                            border-neutral-600 bg-neutral-600 text-white px-6 py-2 m-5
                            flex justify-center items-center gap-3 border-b-[4px]
                        `}
                        >
                            <span>
                                انت الان على احدث اصدار : {`1.0.0`}
                            </span>
                        </p>
                    </div>
                    :
                    <div className='flex flex-col items-start'>
                        <div className={`
                                animate-bounce transition-all rounded-lg select-none font-bold
                                border-emerald-600 bg-emerald-500 text-white px-6 py-2 m-5
                                flex justify-center items-center gap-3 
                                border-b-[4px]
                            `}
                        >
                            <HardDriveDownload
                                size={23}
                                className=''
                            />

                            <span className='text-lg'>
                                جاري التحديث
                            </span>
                        </div>

                        {/* Version size & downloaded */}
                        <div>
                            <p className='font-bold'>
                                حجم التحديث : {Number(updateSize / 1024 / 1024).toFixed(2)} ميجا
                            </p>

                            <p className='font-bold underline'>
                                تم تحميل : {Number(downloaded / 1024 / 1024).toFixed(2)} ميجا
                            </p>
                        </div>

                        {/* Warning zone */}
                        <div className="bg-red-100/50 p-3 rounded-lg border border-red-300 mt-10">
                            <h3 className='text-red-500 font-bold mb-3'>
                                تحذير
                            </h3>

                            <p>
                                برجاء عدم عمل إعادة تحميل للصفحه (Reload)
                                او الذهاب لأي صفحة اخرى لتفادي الاخطاء
                            </p>
                        </div>
                    </div>
        }
    </div>
}