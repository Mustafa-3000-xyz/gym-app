import React, { useState } from "react";
import Search_Result from "./Search-result/Search_Result";
import { Search } from "lucide-react";
import { activeSession_Type, attendanceDetails_Type, trainer_Type } from "@/Pages/types";
import { InputText } from "primereact/inputtext";
import Database from "@tauri-apps/plugin-sql";
import { incrementOrDecrementForTotalSessionsInAccount, normalAlert } from "@/Lib/functions";
import { format } from "date-fns";
import { statusIsFinished, statusIsPending, styleDate, trainerDetailsPagePath } from "@/Lib/constants";
import { useNavigate } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { changeStatusTheShowForSideBar } from "@/Rtk/Slices/UI-slices/sideBarSlice";
import { store_Type } from "@/Rtk/types";
import { addRowInActiveSessionsTable, getAllAttendanceInSpecificDate, systemForAttendance } from "@/Lib/functionsWithDb";
// ========================================================== //
function Search_Box_For_Trainers(
    { arrayForSearch }: { arrayForSearch: trainer_Type[] }
) {
    const dispacth = useDispatch();

    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);



    const [searchValue, setSearchValue] = useState("");
    const [trainersList, setTrainersList] = useState<trainer_Type[]>([]);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);

    const navigate = useNavigate();




    async function activeSession() {
        if (isNaN(Number(searchValue))) return;

        const db = await Database.load("sqlite:gym-app.db");
        const [trainer] = await db.select(`SELECT * FROM trainers WHERE id = ?; `, [searchValue]) as trainer_Type[];


        if (!trainer) {
            normalAlert({
                title: "رقم المتدرب خطا",
                text: "انت الان تحاول تفعيل حصه لمتدرب غير موجود",
                icon: "error"
            });

            return;
        }
        else if (trainer.subscriptionStatus == statusIsPending) {
            normalAlert({
                title: "معلق",
                text: "حالة اشتراك المتدرب معلقه, لا يمكنك تفعيل حصه",
                icon: "error"
            });

            return;
        }
        else if (trainer.subscriptionStatus == statusIsFinished) {
            normalAlert({
                title: "منتهي",
                text: "حالة اشتراك المتدرب تكون منتهيه, لا يمكنك تفعيل حصه",
                icon: "error"
            });

            return;
        }


        const allSessionsActiveList = await db.select(`SELECT * FROM activeSessions WHERE linkWithTrainer = ?;`, [searchValue]) as activeSession_Type[];
        const dateNow = format(new Date(), styleDate);


        try {
            const rows = await getAllAttendanceInSpecificDate(dateNow) as attendanceDetails_Type[];
            const isTrainerHere = rows.find(function (ele) {
                const convertToList = (JSON.parse(ele.trainers as any)) as number[];
                const getTrainer = convertToList.find(id => id == Number(searchValue));

                return getTrainer;
            });


            if (isTrainerHere) {
                normalAlert({
                    title: "تنبيه",
                    text: `المتدرب الذي يحمل رقم ${searchValue} بالفعل موجود النهارده`,
                    icon: "info"
                });
            }
            else if (!isTrainerHere && allSessionsActiveList.length + 1 == trainer.sessionsCount) {
                dispacth(changeStatusTheShowForSideBar("hidden"));
                navigate(trainerDetailsPagePath.replace(":trainerId", trainer.id as any));
            }
            // Add session
            else {
                const sessionFree = finedSessionFree(allSessionsActiveList, trainer.sessionsCount);


                addRowInActiveSessionsTable({
                    linkWithTrainer: Number(trainer.id),
                    accountId: Number(state.logInInfo?.id),
                    sessionNumber: sessionFree,
                    activationDate: new Date().toISOString()
                });

                systemForAttendance(
                    Number(trainer.id),
                    Number(state.logInInfo?.id),
                    dateNow,
                    null
                );

                incrementOrDecrementForTotalSessionsInAccount(
                    Number(state.logInInfo?.id),
                    1,
                    "increment"
                );

                normalAlert({
                    title: "تمت العمليه بنجاح",
                    text: `تم تحضير المتدرب الذي يحمل رقم ${trainer.id} يوم ${dateNow}`,
                    icon: "success"
                });
            }
        }

        catch (err) {
            if (allSessionsActiveList.length + 1 == trainer.sessionsCount) {
                dispacth(changeStatusTheShowForSideBar("hidden"));
                navigate(trainerDetailsPagePath.replace(":trainerId", trainer.id as any));
            }
            // Add session
            else {
                const sessionFree = finedSessionFree(allSessionsActiveList, trainer.sessionsCount);


                addRowInActiveSessionsTable({
                    linkWithTrainer: Number(trainer.id),
                    accountId: Number(state.logInInfo?.id),
                    sessionNumber: sessionFree,
                    activationDate: new Date().toISOString()
                });

                systemForAttendance(
                    Number(trainer.id),
                    Number(state.logInInfo?.id),
                    dateNow,
                    null
                );

                incrementOrDecrementForTotalSessionsInAccount(
                    Number(state.logInInfo?.id),
                    1,
                    "increment"
                );

                normalAlert({
                    title: "تمت العمليه بنجاح",
                    text: `تم تحضير المتدرب الذي يحمل رقم ${trainer.id} يوم ${dateNow}`,
                    icon: "success"
                });
            }
        }
    }

    function resultSearch() {
        const query = searchValue.trim().toLowerCase();


        if (query == "") {
            setTrainersList([]);
            setIsShowSearchResult(false);
        }

        // This conditional for search using trainer id only
        else if (!isNaN(Number(query))) {
            const getTrainer = arrayForSearch.find(ele => ele.id == Number(query));

            getTrainer ?
                setTrainersList([getTrainer])
                :
                setTrainersList(arrayForSearch.filter(ele => String(ele.id).includes(query)))


            setIsShowSearchResult(true);
        }

        else {
            const result = arrayForSearch.filter(function (ele) {
                const firstName = ele.firstName.toLowerCase();
                const lastName = ele.lastName.toLowerCase();
                const fullName = `${firstName} ${lastName}`;


                return firstName.includes(query)
                    || lastName.includes(query)
                    || fullName.includes(query)
            });


            setTrainersList(result);
            setIsShowSearchResult(true);
        }
    }

    function finedSessionFree(allSessions: activeSession_Type[], sessionsCount: number) {
        let sessionFree = 0;

        for (let i = 0; i < sessionsCount; i++) {
            let isHere = false;

            for (let j = 0; j < allSessions.length; j++) {
                if (i == allSessions[j].sessionNumber) {
                    isHere = true;
                    break;
                }
            }

            if (isHere == false) {
                sessionFree = i;
                break;
            }
        }

        return sessionFree;
    }




    return <div className="relative h-full">
        <Search
            size={23}
            className="absolute bottom-1/3 ms-3 text-slate-400"
        />

        <InputText
            placeholder={`
                ${arrayForSearch.length == 0 ? "لا يوجد متدربين للبحث" : "البحث عن المتدرب"}
            `}
            disabled={arrayForSearch.length == 0 ? true : false}
            className="w-full h-full text-center font-bold"
            onChange={(e) => {
                setSearchValue(e.target.value);
                setIsShowSearchResult(false);
                setTrainersList([]);
            }}
            onKeyDown={(e) => {
                if (e.key == "Enter") {
                    resultSearch();
                }
                else if (e.key == "Shift") {
                    activeSession();
                }
            }}
        />




        {
            isShowSearchResult ?
                <Search_Result
                    arrayContainsTrainers={trainersList}
                    onIsShowSearchResult={setIsShowSearchResult}
                />
                :
                null
        }
    </div>
}

export default React.memo(Search_Box_For_Trainers);