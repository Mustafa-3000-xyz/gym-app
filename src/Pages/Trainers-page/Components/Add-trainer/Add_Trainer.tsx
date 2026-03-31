import { Presentation, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { addTrainer } from "@/Rtk/Slices/trainersSlice";
import Trainer_Info_Form from "../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/Lib/REGEX";
import Subscription_Info_Form from "../Forms/Subscription-info-form/Subscription_Info_Form";
import { alertSuccess, stateIsActive, stateIsPending } from "@/Lib/customs";
import Date_Info_Form from "../Forms/Date-info-form/Date_Info_Form";
import { useAtom } from "jotai";
import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import { useDispatch } from "react-redux";
import { trainer } from "@/Pages/types";
import Popup from "@/Global-components/Popup/Popup";
// ========================================================== //
export default function Add_Trainer(
    { onIsShowAddTrainer }: { onIsShowAddTrainer: (x: boolean) => void }
) {
    const dispatch = useDispatch();
    const setIsShowTrainerDetailsAtom = useAtom(isShowTrainerDetails_Atom)[1];

    // Get trainer info
    const [getFirstName, setGetFirstName] = useState("");
    const [getLastName, setGetLastName] = useState("");
    const [getPhone, setGetPhone] = useState<string | number>("");
    const [getAddress, setGetAddress] = useState("");

    // Get subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState("");
    const [getSessionsCount, setGetSessionsCount] = useState<number | string>("");
    const [getPrice, setGetPrice] = useState<number | string>("");

    // Get date info
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<Date | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<Date | null>(null);

    // These variables
    const [trainerId, setTrainerId] = useState("");
    const [isAllInfoComplete, setIsAllInfoComplete] = useState(false);




    function closeThisWinow() {
        onIsShowAddTrainer(false);
    }

    function saveTrainerInfo() {
        if (!isAllInfoComplete) return

        const todayDate = new Date();

        dispatch(
            addTrainer({
                trainerId,
                subscriptionState: todayDate.getTime() < new Date(getSubscriptionStart as any).getTime() as any ? stateIsPending : stateIsActive,
                activeSessionsList: JSON.stringify([]) as any,
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
            text: `الرقم الخاص بالمتدرب هو : ${trainerId}`
        });
    }

    function generateId() {
        const id = Array.from({ length: 4 }, function () {
            return Math.trunc(Math.random() * 10)
        }).join("");

        setTrainerId(id);
    }



    useEffect(function () {
        setIsShowTrainerDetailsAtom(false);
        generateId();
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


    return <Popup
        titel="إضافة متدرب"
        discription="الان, يمكنك إضافة متدرب جديد"
        isSave={isAllInfoComplete}
        clickOnCancel={closeThisWinow}
        clickOnSaveBtn={saveTrainerInfo}
    >
        {/* Trainer info */}
        <div className="my-6">
            <div className="flex items-center gap-2 text-indigo-500 font-bold mb-5 px-3">
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
            <div className="flex items-center gap-2 text-indigo-500 font-bold mb-5 px-3">
                <Presentation size={23} />
                <p className="leading-none pt-0.5">تفاصيل الاشتراك</p>
            </div>

            <Subscription_Info_Form
                onGetSubscriptionName={setGetSubscriptionName}
                onGetSessionsCount={setGetSessionsCount}
                onGetPrice={setGetPrice}
            />
        </div>

        {/* Date info */}
        <div className="mb-5">
            <Date_Info_Form
                onGetSubscriptionStart={setGetSubscriptionStart}
                onGetSubscriptionEnd={setGetSubscriptionEnd}
            />
        </div>
    </Popup>
}