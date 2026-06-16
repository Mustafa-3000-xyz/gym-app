import { useEffect, useState } from "react";
import Welcome_Message from "./Components/Welcome-message/Welcome_Message";
import End_Message from "./Components/End-message/End_Message";
import { accounte } from "@/Pages/types";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import Animation from "@/Global-components/Animation/Animation";
// ========================================================== //
export default function Sing_Up_Page() {
    const [isWelcomeMessegeFinished, setIsWelcomeMessegeFinished] = useState(false);
    const [isShowEndMessage, setIsShowEndMessage] = useState(false);
    const [managerInfo, setManagerInfo] = useState({});


    const [isGetAllData, setIsGetAllData] = useState(false);
    const [getName, setGetName] = useState("");
    const [getAge, setGetAge] = useState("");
    const [getPassword, setGetPassword] = useState("");



    useEffect(function () {
        if (!getName || !getAge || !getPassword) {
            setIsGetAllData(false);
            return;
        }

        setIsGetAllData(true);
        setManagerInfo({
            name: getName,
            age: getAge,
            password: getPassword
        })
    }, [getName, getAge, getPassword]);



    return <section className="select-none w-full">
        {
            !isWelcomeMessegeFinished && !isShowEndMessage ?
                <Welcome_Message onIsWelcomeMessegeFinished={setIsWelcomeMessegeFinished} />
                :
                null
        }

        {
            isWelcomeMessegeFinished && !isShowEndMessage &&
            <Animation
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="w-full"
            >
                <h1 className="text-center text-2xl font-bold mb-10">
                    الان قم بملئ تلك البيانات
                </h1>

                <Account_Form
                    name={""}
                    age={0}
                    password={""}
                    accountType={"manager"}
                    onGetName={setGetName}
                    onGetAge={setGetAge as any}
                    onGetPassword={setGetPassword}
                />

                <button
                    className={`
                        w-full mt-10 transition duration-300
                        bg-blue-500 text-white p-2 rounded-lg
                        ${isGetAllData ? 'opacity-100 cursor-pointer' : 'opacity-45 cursor-not-allowed'}
                    `}
                    onClick={() => setIsShowEndMessage(true)}
                    disabled={!isGetAllData}
                >
                    التالي
                </button>
            </Animation>
        }

        {
            isWelcomeMessegeFinished && isShowEndMessage ?
                <End_Message managerInfo={managerInfo as accounte} />
                :
                null
        }
    </section>
}