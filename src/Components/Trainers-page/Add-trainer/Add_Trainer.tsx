import { motion } from "framer-motion";
import { Presentation, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { addTrainer } from "@/db/trainerDb";
import Trainer_Info_Form from "../../Forms/Trainer-info-form/Trainer_Info_Form";
import { regexPhone } from "@/lib/REGEX";
import Subscription_Info_Form from "../../Forms/Subscription-info-form/Subscription_Info_Form";
import { Add_Trainer_Props } from "@/Pages/Trainers-page/trainersTypes";
import Discription from "@/Components/Description/Discription";
import Swal from "sweetalert2";
import Date_Info_Form from "@/Components/Forms/Date-info-form/Date_Info_Form";
// ========================================================== //
export default function Add_Trainer(
    { onIsShowAddTrainer, getAllTrainers }: Add_Trainer_Props
) {
    // Get trainer info
    const [getFirstName, setGetFirstName] = useState("");
    const [getLastName, setGetLastName] = useState("");
    const [getPhone, setGetPhone] = useState<string | number>(0);
    const [getAddress, setGetAddress] = useState("");

    // Get subscription info
    const [getSubscriptionName, setGetSubscriptionName] = useState("");
    const [getSessionsCount, setGetSessionsCount] = useState(0);
    const [getPrice, setGetPrice] = useState(0);

    // Get date info
    const [getSubscriptionStart, setGetSubscriptionStart] = useState<string | null>(null);
    const [getSubscriptionEnd, setGetSubscriptionEnd] = useState<string | null>(null);

    // These variables
    const [trainerId, setTrainerId] = useState("");
    const [isAllInfoComplete, setIsAllInfoComplete] = useState(false);


    function closeThisWinow() {
        onIsShowAddTrainer(false);
    }

    async function saveTrainerInfo() {
        if (isAllInfoComplete) {
            await addTrainer({
                trainerId,
                subscriptionState: "active",
                activeSessionsList: [],
                firstName: getFirstName,
                lastName: getLastName,
                phone: getPhone,
                address: getAddress,
                subscriptionName: getSubscriptionName,
                sessionsCount: getSessionsCount,
                price: getPrice,
                subscriptionStart: getSubscriptionStart,
                subscriptionEnd: getSubscriptionEnd,
            });

            getAllTrainers();
            closeThisWinow();
            showAlert();
        }
    }

    function showAlert() {
        Swal.fire({
            title: "تم إضافة المتدرب بنجاح",
            text: `الرقم الخاص بالمتدرب هو : ${trainerId}`,
            icon: "success",
            confirmButtonText: "تمام"
        });
    }


    // This for get random id, and save trainer info when click on enter
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
            <div className="px-5 flex justify-between items-center mb-3 bg-black/5 p-5 border-b border-b-slate-300">
                <div>
                    <h3 className=" font-bold text-lg">
                        إضافة متدرب جديد
                    </h3>
                    <Discription discription="يمكنك الان إضافة اي متدرب انت تريده" />
                </div>

                <X size={23} onClick={closeThisWinow} className="cursor-pointer text-red-500" />
            </div>

            {/* Trainer info */}
            <div className="my-6">
                <div className="flex items-center gap-2 text-(--primary) font-bold mb-5 px-3">
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
                <div className="flex items-center gap-2 text-(--primary) font-bold mb-5 px-3">
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