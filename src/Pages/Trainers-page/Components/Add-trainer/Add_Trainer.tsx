import { Presentation, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { addTrainer } from "@/Rtk/Slices/trainersSlice";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import { normalAlert, theTodayDate } from "@/Lib/functions";
import { stateIsActive, stateIsFinished, stateIsPending } from "@/Lib/constants";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import { useAtomValue } from "jotai";
import { useDispatch, useSelector } from "react-redux";
import { activeSessionsList_Type, trainer } from "@/Pages/types";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { updatePropertyInAccount } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { updatePropertyInSubscriptionMenu } from "@/Rtk/Slices/subscriptionsMenuSlice";
// ========================================================== //
export default function Add_Trainer(
    { onIsShowAddTrainer }: { onIsShowAddTrainer: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const state = useSelector(state => state as store_Type);

    const isLoginAtom = useAtomValue(isLogin_Atom);

    // Get trainer info
    const [getFirstName, setGetFirstName] = useState("");
    const [getLastName, setGetLastName] = useState("");
    const [getPhone, setGetPhone] = useState<string | number>("");
    const [getAddress, setGetAddress] = useState("");

    // Get subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState<string>("");
    const [getSessionsCount, setGetSessionsCount] = useState<number>(0);
    const [getPrice, setGetPrice] = useState<number>(0);
    const [getActiveSomeSessions, setGetActiveSomeSessions] = useState<number>(0);

    // Get date info
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<Date | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<Date | null>(null);

    // These variables
    const [isAllInfoComplete, setIsAllInfoComplete] = useState(false);



    function closeThisWinow() {
        onIsShowAddTrainer(false);
    }

    function saveTrainerInfo() {
        if (!isAllInfoComplete) return

        const todayDate = theTodayDate({startingIn12Houre: true});


        const conditionalForActiveSubscription = todayDate.getTime() >= new Date(getSubscriptionStart as any).getTime() && todayDate.getTime() <= new Date(getSubscriptionEnd as any).getTime();
        const conditionalForPendingSubscription = todayDate.getTime() < new Date(getSubscriptionStart as any).getTime();
        const conditionalForFinishedSubscription = todayDate.getTime() > new Date(getSubscriptionEnd as any).getTime();



        dispatch(
            addTrainer({
                subscriptionState:
                    conditionalForActiveSubscription ?
                        stateIsActive
                        :
                        conditionalForPendingSubscription ?
                            stateIsPending
                            :
                            conditionalForFinishedSubscription && stateIsFinished,
                activeSessionsList: JSON.stringify(makeActiveSessionList()) as any,
                firstName: getFirstName,
                lastName: getLastName,
                phone: String(getPhone),
                address: getAddress,
                subscriptionName: getSubscriptionName,
                sessionsCount: Number(getSessionsCount),
                price: Number(getPrice),
                subscriptionStart: getSubscriptionStart?.toISOString(),
                subscriptionEnd: getSubscriptionEnd?.toISOString(),
                dateAdded: new Date().toISOString()
            } as trainer) as any
        );

        incrementTheTrainersTotalForSubscriptionMenu();
        closeThisWinow();
        normalAlert({
            title: "تمت العمليه بنجاح",
            text: "إضافة متدرب جديد",
            icon: "success"
        });
    }

    function makeActiveSessionList(): activeSessionsList_Type[] | [] {
        if (getActiveSomeSessions == 0) {
            return [];
        }
        else {
            const arr: number[] = [];

            for (let i = 0; i < getActiveSomeSessions; i++) {
                arr.push(i);
            }

            const obj = {
                accountId: isLoginAtom.id,
                sessions: arr
            } as activeSessionsList_Type

            dispatch(updatePropertyInAccount({
                id: isLoginAtom.id as any,
                column: "totalForActiveSessions",
                value: getActiveSomeSessions
            }) as any);

            return [obj];
        }
    }

    function incrementTheTrainersTotalForSubscriptionMenu() {
        state.subscriptionsMenu.forEach(function (ele) {
            if (
                ele.subscriptionName == getSubscriptionName
                &&
                ele.sessionsCount == getSessionsCount
                &&
                ele.price == getPrice
            ) {
                dispatch(updatePropertyInSubscriptionMenu({
                    id: ele.id as any,
                    column: "trainersTotal",
                    value: ele.trainersTotal + 1
                }) as any);
            }
        })
    }



    // This check the trainer info is compolete or no
    useEffect(() => {
        if (
            (
                getPhone == 0 || new String(getPhone).match(regexPhone)
            ) &&
            getFirstName &&
            getLastName &&
            getSubscriptionName &&
            getSessionsCount &&
            getPrice &&
            getSubscriptionStart && getSubscriptionEnd
        ) {
            setIsAllInfoComplete(true);
        } else {
            setIsAllInfoComplete(false);
        }
    }, [
        getFirstName,
        getLastName,
        getSubscriptionName,
        getSessionsCount,
        getPrice,
        getPhone,
        getSubscriptionStart, getSubscriptionEnd
    ]);



    return <Popup_Form
        titel="إضافة متدرب"
        discription="الان, يمكنك إضافة متدرب جديد"
        isSave={isAllInfoComplete}
        clickOnCancel={closeThisWinow}
        clickOnSaveBtn={saveTrainerInfo}
    >
        {/* Trainer info */}
        <div className="mb-5">
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
                onGetSessionsCount={setGetSessionsCount}
                onGetPrice={setGetPrice}
                onGetActiveSomeSessions={setGetActiveSomeSessions}
            />
        </div>

        {/* Date info */}
        <div>
            <Date_Info_Form
                onGetSubscriptionStart={setGetSubscriptionStart}
                onGetSubscriptionEnd={setGetSubscriptionEnd}
            />
        </div>
    </Popup_Form>
}