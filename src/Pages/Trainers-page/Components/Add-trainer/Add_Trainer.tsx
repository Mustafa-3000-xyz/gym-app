import { Presentation, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { addTrainer } from "@/Rtk/Slices/trainersSlice";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import { alertSuccess } from "@/Lib/functions";
import { stateIsActive, stateIsPending } from "@/Lib/constants";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import { useAtom, useAtomValue } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import { useDispatch } from "react-redux";
import { activeSessionsList_Type, trainer } from "@/Pages/types";
import Popup_Form from "@/Global-components/Popup-form/Popup_Form";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { updatePropertyInAccount } from "@/Rtk/Slices/accountsSlice";
// ========================================================== //
export default function Add_Trainer(
    { onIsShowAddTrainer }: { onIsShowAddTrainer: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const isLoginAtom = useAtomValue(isLogin_Atom);
    const setIsShowTrainerDetailsAtom = useAtom(isShowTrainerDetails_Atom)[1];

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

        const todayDate = new Date();

        dispatch(
            addTrainer({
                subscriptionState: todayDate.getTime() < new Date(getSubscriptionStart as any).getTime() as any ? stateIsPending : stateIsActive,
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
                dateAdded: todayDate.toISOString()
            } as trainer) as any
        );

        closeThisWinow();
        alertSuccess({
            mainTitle: "تم إضافة المتدرب بنجاح",
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



    useEffect(function () {
        setIsShowTrainerDetailsAtom(false);
    }, []);

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