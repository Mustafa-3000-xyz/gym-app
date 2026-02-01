import { motion } from "framer-motion";
import { Presentation, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { addTrainer } from "@/trainerDb";
import Trainer_Info_Form from "./Trainer-info-form/Trainer_Info_Form";
import Date_Info from "./Subscription-info/Date-info/Date_Info";
import Add_Subscription_From_Settings from "./Subscription-info/Add-subscription-from-settings/Add_Subscription_From_Settings";
import { regexPhone } from "@/REGEX";
import Subscription_Info_Form from "./Subscription-info/Subscription-info-form/Subscription_Info_Form";
import { Flip, toast } from "react-toastify";
import { Add_Trainer_Props } from "@/Pages/Trainers-page/trainersTypes";
// ========================================================== //
export default function Add_Trainer(
    { setIsShowAddTrainer, getAllTrainers }: Add_Trainer_Props
) {
    // Get trainer info
    const [getFirstName, setGetFirstName] = useState("");
    const [getLastName, setGetLastName] = useState("");
    const [getPhone, setGetPhone] = useState<string | number>(0);
    const [getAddress, setGetAddress] = useState("");

    // Get subscription info
    const [subscriptionName, setSubscriptionName] = useState("");
    const [sessionsCount, setSessionsCount] = useState(0);
    const [price, setPrice] = useState(0);

    // Get date info
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<string | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<string | null>(null);

    // These variables
    const [trainerId, setTrainerId] = useState("");
    const [isAllInfoComplete, setIsAllInfoComplete] = useState(false);


    async function saveTrainerInfo() {
        if (isAllInfoComplete) {
            await addTrainer({
                trainerId,
                isSubscriptionActive: true,
                activeSessionsList: [],
                firstName: getFirstName,
                lastName: getLastName,
                phone: getPhone,
                address: getAddress,
                subscriptionName,
                sessionsCount,
                price,
                subscriptionStart: getSubscriptionStart,
                subscriptionEnd: getSubscriptionEnd,
            });

            getAllTrainers();
            closeThisWinow();
            showAlert();
        }
    }

    function showAlert() {
        toast.success(`Will done, ID ${trainerId}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Flip,
        });
    }

    function closeThisWinow() {
        setIsShowAddTrainer(false);
    }


    // This for get random id and run saveTrainerInfo function when click on enter
    useEffect(function () {
        const id = Array.from({ length: 4 }, function () {
            return Math.trunc(Math.random() * 10)
        }).join("");

        setTrainerId(id);

        function event(e: KeyboardEvent) {
            if (e.key == "Enter") {
                saveTrainerInfo();
            }
        }

        window.addEventListener("keydown", event);
        () => window.removeEventListener("keydown", event);
    }, []);

    // This check the trainer info is compolete or no
    useEffect(() => {
        if (
            (
                getPhone == 0 || new String(getPhone).match(regexPhone)
            ) &&
            getFirstName &&
            getLastName &&
            subscriptionName &&
            sessionsCount &&
            price &&
            getSubscriptionStart && getSubscriptionEnd
        ) {
            setIsAllInfoComplete(true);
        } else {
            setIsAllInfoComplete(false);
        }
    }, [
        getFirstName,
        getLastName,
        subscriptionName,
        sessionsCount,
        price,
        getPhone,
        getSubscriptionStart, getSubscriptionEnd
    ]);


    return <div className="w-screen h-screen fixed bg-black/65 top-0 end-0 select-none">
        <motion.div
            className={`
                    absolute top-1/2 end-1/2 -translate-x-1/2 -translate-y-1/2
                    bg-slate-100 border border-slate-200 rounded-lg w-[60vw]
                `}
            initial={{
                scale: 0.5,
            }}
            animate={{
                scale: 1,
            }}
        >
            {/* Title & x */}
            <div className="px-3 flex justify-between mb-3 pt-5">
                <div>
                    <h3 className=" font-bold text-lg">
                        إضافة متدرب جديد
                    </h3>
                    <p className=" opacity-45">
                        يمكنك الان إضافة اي متدرب انت تريده
                    </p>
                </div>

                <X size={23} onClick={closeThisWinow} className="cursor-pointer text-red-700" />
            </div>

            <div className="h-0.5 w-full bg-slate-200"></div>

            {/* Trainer info */}
            <div className="my-6">
                <div className="flex items-center gap-2 text-(--primary) font-bold mb-5 px-3">
                    <UserRound size={23} />
                    <p className="leading-none pt-0.5">المعلومات الشخصيه</p>
                </div>

                <Trainer_Info_Form
                    setGetFirstName={setGetFirstName}
                    setGetLastName={setGetLastName}
                    setGetPhone={setGetPhone}
                    setGetAddress={setGetAddress}
                />
            </div>

            {/* Subscription info */}
            <div className="mb-5">
                <div className="flex items-center gap-2 text-(--primary) font-bold mb-5 px-3">
                    <Presentation size={23} />
                    <p className="leading-none pt-0.5">تفاصيل الاشتراك</p>
                </div>

                <Add_Subscription_From_Settings />

                <Subscription_Info_Form
                    subscriptionName={subscriptionName}
                    sessionsCount={sessionsCount}
                    price={price}
                    setSubscriptionName={setSubscriptionName}
                    setSessionsCount={setSessionsCount}
                    setPrice={setPrice}
                />
            </div>

            {/* Date info */}
            <div className="mb-5">
                <Date_Info
                    setGetSubscriptionStart={setGetSubscriptionStart}
                    setGetSubscriptionEnd={setGetSubscriptionEnd}
                />
            </div>

            {/* Btn save and cancel */}
            <div className="bg-black/5 p-5 border-t border-t-slate-300 flex gap-3">
                <button
                    onClick={saveTrainerInfo}
                    className={`
                        transition duration-300 
                        bg-[#385E97] text-white px-5  py-2 rounded-lg
                        ${isAllInfoComplete ?
                            "opacity-100 cursor-pointer hover:bg-[#285E97]"
                            :
                            "opacity-50 cursor-not-allowed"
                        }
                    `}
                >
                    حفظ البيانات
                </button>

                <button
                    onClick={closeThisWinow}
                    className={`
                        transition duration-300 hover:bg-red-600
                        bg-red-500 text-white px-5 cursor-pointer rounded-lg
                    `}
                >
                    إلغاء
                </button>
            </div>
        </motion.div>
    </div>
}