import { Presentation, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { addRowInTrainersTable } from "@/Rtk/Slices/Db-slices/trainersSlice";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import { incrementOrDecrementForTotalSessionsInAccount, normalAlert, theTodayDate } from "@/Lib/functions";
import { stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import { useDispatch, useSelector } from "react-redux";
import { activeSessionsList_Type, trainer } from "@/Pages/types";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import { store_Type } from "@/Rtk/types";
import { removeSubscriptionStart } from "@/Rtk/Slices/UI-slices/subscriptionStartSlice";
import { removeSubscriptionEnd } from "@/Rtk/Slices/UI-slices/subscriptionEndSlice";
import { removeAllSessions } from "@/Rtk/Slices/UI-slices/sessionsCountSlice";
import { addDays } from "date-fns";
// ========================================================== //
export default function Add_Trainer(
    { onIsShowAddTrainer }: { onIsShowAddTrainer: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);



    // Get trainer info
    const [getFirstName, setGetFirstName] = useState("");
    const [getLastName, setGetLastName] = useState("");
    const [getPhone, setGetPhone] = useState<string | number>("");
    const [getAddress, setGetAddress] = useState("");

    // Get subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState<string>("");
    const [getPrice, setGetPrice] = useState<number>(0);
    const [getActiveSomeSessions, setGetActiveSomeSessions] = useState<number>(0);

    const todayDate = useMemo(() => theTodayDate({ startingIn12Houre: true }), []);



    function makeObjectsInActiceSessionsList(): activeSessionsList_Type[] | [] {
        if (getActiveSomeSessions) {
            let date = new Date(state.subscriptionStart as string);
            const arr: activeSessionsList_Type[] = [];

            for (let i = 0; i < getActiveSomeSessions; i++) {
                const obj = {
                    accountId: state.logInInfo?.id,
                    sessionNumber: i,
                    activationDate: new Date(date as Date).toISOString()
                } as activeSessionsList_Type

                arr.push(obj);

                const nextDay = addDays(date, 1);
                date = nextDay;
            }

            incrementOrDecrementForTotalSessionsInAccount(
                Number(state.logInInfo?.id),
                getActiveSomeSessions,
                "increment"
            );
            return arr;
        }
        else {
            return [];
        }
    }

    function saveTrainerInfo() {
        if (!isAllInfoComplete) return
        onIsShowAddTrainer(false);
        normalAlert({
            title: "تمت العمليه بنجاح",
            text: "إضافة متدرب جديد",
            icon: "success"
        });


        dispatch(removeSubscriptionStart());
        dispatch(removeSubscriptionEnd());
        dispatch(removeAllSessions());
        dispatch(
            addRowInTrainersTable({
                subscriptionState: statusTheSubscription,
                activeSessionsList: JSON.stringify(makeObjectsInActiceSessionsList()) as any,
                firstName: getFirstName,
                lastName: getLastName,
                phone: String(getPhone),
                address: getAddress,
                subscriptionName: getSubscriptionName,
                sessionsCount: Number(state.sessionsCount),
                price: Number(getPrice),
                subscriptionStart: state.subscriptionStart,
                subscriptionEnd: state.subscriptionEnd,
                dateAdded: new Date().toISOString()
            } as trainer) as any
        );
    }




    const isAllInfoComplete = useMemo(function () {
        // This check the trainer info is compolete or no
        if (
            (getPhone == 0 || new String(getPhone).match(regexPhone))
            &&
            getFirstName &&
            getLastName &&
            getSubscriptionName &&
            state.sessionsCount &&
            getPrice &&
            state.subscriptionStart && state.subscriptionEnd
        ) {
            return true
        } else {
            return false;
        }
    }, [getFirstName, getLastName, getSubscriptionName, state.sessionsCount,
        getPrice, getPhone, state.subscriptionStart, state.subscriptionEnd
    ]);

    const statusTheSubscription = useMemo(() => {
        if (
            todayDate.getTime() >= new Date(state.subscriptionStart as any).getTime()
            &&
            todayDate.getTime() <= new Date(state.subscriptionEnd as any).getTime()
        ) {
            return stateIsActive;
        }
        else if (
            todayDate.getTime() < new Date(state.subscriptionStart as any).getTime()
        ) {
            return stateIsPending;
        }
        else {
            return stateIsFinished;
        }
    }, [state.subscriptionStart, state.subscriptionEnd, todayDate]);




    return <Popup_Form
        titel="إضافة متدرب"
        discription="الان, يمكنك إضافة متدرب جديد"
        isSave={isAllInfoComplete}
        clickOnCancel={() => {
            onIsShowAddTrainer(false)
            dispatch(removeSubscriptionStart());
            dispatch(removeSubscriptionEnd());
            dispatch(removeAllSessions());
        }}
        clickOnSaveBtn={saveTrainerInfo}
    >
        {/* Trainer info */}
        <div className="mb-5" >
            <div className="flex items-center gap-2 text-(--thirdColor) font-bold mb-2">
                <UserRound size={23} />
                <p className="leading-none pt-0.5">المعلومات الشخصيه</p>
            </div>

            <Trainer_Info_Form
                onGetFirstName={setGetFirstName}
                onGetLastName={setGetLastName}
                onGetPhone={setGetPhone}
                onGetAddress={setGetAddress}
            />
        </div>

        {/* Subscription info */}
        <div className="mb-5">
            <div className="flex items-center gap-2 text-(--thirdColor) font-bold mb-5">
                <Presentation size={23} />
                <p className="leading-none pt-0.5">تفاصيل الاشتراك</p>
            </div>

            <Subscription_Info_Form
                onGetSubscriptionName={setGetSubscriptionName}
                onGetPrice={setGetPrice}
                onGetActiveSomeSessions={setGetActiveSomeSessions}
            />
        </div>

        <Date_Info_Form />
    </Popup_Form >
}