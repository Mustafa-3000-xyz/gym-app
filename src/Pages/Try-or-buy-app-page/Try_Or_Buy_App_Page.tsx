import Not_Found from "@/Global-components/Not-found/Not_Found";
import { alert, normalAlert } from "@/Lib/functions";
import { invoke } from "@tauri-apps/api/core";
import { exit } from "@tauri-apps/plugin-process";
import { CreditCard, Tickets } from "lucide-react";
import { useEffect, useState } from "react";
import { fetch } from '@tauri-apps/plugin-http';
import { licensingInfo_Type } from "../types";
import { format } from "date-fns";
import { stepsForBuyAppPage, styleDate } from "@/Lib/constants";
import { Outlet, useNavigate, useOutlet } from "react-router-dom";
// ========================================================== //
export default function Try_Or_Buy_App_Page(
    { licensingInfo }: { licensingInfo: licensingInfo_Type | null }
) {
    const [isTestAppCanUse, setIsTestAppCanUse] = useState(false);
    const [isOnline, setIsOnline] = useState(() => navigator.onLine);
    const [getTimeZoneInEgypt, setGetTimeZoneInEgypt] = useState<null | string | "error">(null);

    const hasOutlet = useOutlet();
    const navigation = useNavigate();




    async function timeZone() {
        try {
            const getTimeZone = await fetch("https://timeapi.io/api/v1/time/current/zone?timeZone=Africa/Cairo");
            const json = await getTimeZone.json();

            if (
                new Date(json.date_time).getFullYear() == new Date().getFullYear()
                &&
                new Date(json.date_time).getMonth() == new Date().getMonth()
                &&
                new Date(json.date_time).getDate() == new Date().getDate()
            ) {
                setGetTimeZoneInEgypt(json.date_time);
            } else {
                setGetTimeZoneInEgypt("error");
            }
        } catch (err) {
            console.log(err);
            setGetTimeZoneInEgypt("error");
        }
    }

    async function clickOnTestBtn() {
        if (!isTestAppCanUse) return;

        else if (!getTimeZoneInEgypt) {
            normalAlert({
                title: "تمهل",
                text: "نقوم بجلب التوقيت في مصر",
                icon: "info"
            });
            return;
        }
        else if (getTimeZoneInEgypt == "error") {
            normalAlert({
                title: "المعذره",
                text: "حدث خطا, من فضلك قم بتعديل تاريخ الجهاز لكي يتوافق مع تاريخ اليوم في دولة مصر",
                icon: "error"
            });
            return;
        }

        const dateInEgypt = new Date(getTimeZoneInEgypt as string);
        const timeEnd = dateInEgypt.setDate(dateInEgypt.getDate() + 7);
        const convertToDate = new Date(timeEnd);
        const makeStyleDate = format(convertToDate, styleDate);


        alert({
            titleBeforeSubmit: ".. فكر قليلا",
            textBeforeSubmit: `هل تريد بالفعل الفتره المجانيه ؟ إذا اردت ذلك فسوف تنتهى الفتره يوم ${makeStyleDate}`,
            iconStyleBeforeSubmit: "info",
            runFunctionAfterSubmit: async function () {
                await invoke('manage_gym_procedures', {
                    newData: {
                        "testInfo": {
                            "isTest": true,
                            "endDate": convertToDate.toISOString(),
                            "activationDate": new Date().toISOString()
                        },
                        "licenseKey": null
                    }
                });

                await exit(0);
            }
        });
    }

    function handleOnline() {
        setIsOnline(true)
    }

    function handleOffline() {
        setIsOnline(false)
    }





    useEffect(() => {
        timeZone();

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(function () {
        if (!licensingInfo) return;

        if (licensingInfo.testInfo.isTest == false && licensingInfo.testInfo.activationDate) {
            setIsTestAppCanUse(false);
        }
        else {
            setIsTestAppCanUse(true);
        }
    }, [licensingInfo]);




    if (!isOnline) {
        return <section className="h-screen flex justify-center items-center">
            <Not_Found
                srcImg="/not_found_after_search.svg"
                title="لا يوجد اتصال بالانترنت"
            />
        </section>
    }

    if (hasOutlet) {
        return <Outlet />
    }

    return <section className="h-screen flex flex-col justify-center items-center gap-14">
        <h2 className="text-5xl font-bold">
            الإجراءات الحاليه
        </h2>

        <div className="flex flex-row-reverse justify-center items-center gap-10">
            <button
                className={`
                    duration-300 
                    p-4 w-[350px] h-[250px] rounded-lg 
                    flex flex-col justify-between items-center py-10 font-bold border-2
                    ${isTestAppCanUse ?
                        "bg-slate-100 cursor-pointer hover:bg-amber-500 hover:scale-110 hover:text-white active:scale-125"
                        :
                        "cursor-not-allowed bg-neutral-300 opacity-55"
                    }
                `}
                onClick={clickOnTestBtn}
            >
                <div>
                    <h3 className="text-2xl">
                        {
                            isTestAppCanUse ?
                                "ابدا الفتره التجريبيه"
                                :
                                "تم الانتهاء من الفتره التجريبيه"
                        }
                    </h3>

                    <span className="text-sm underline">
                        {
                            isTestAppCanUse ?
                                "تكون الفتره 7 ايام"
                                :
                                "- - -"
                        }
                    </span>
                </div>

                <Tickets size={35} />
            </button>

            <button
                className={`
                    duration-300 hover:bg-emerald-500 hover:scale-110 hover:text-white active:scale-125
                    bg-slate-100 p-4 w-[350px] h-[250px] rounded-lg cursor-pointer
                    flex flex-col justify-between items-center py-10 font-bold border-2
                `}

                onClick={() => navigation(stepsForBuyAppPage)}
            >
                <div>
                    <h3 className="text-2xl">
                        شراء البرنامج
                    </h3>

                    <span className="text-sm underline">
                        يمكنك استخدام البرنامج مدى الحياه
                    </span>
                </div>


                <CreditCard size={35} />
            </button>
        </div>
    </section>
}