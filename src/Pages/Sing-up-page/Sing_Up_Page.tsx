import { useState } from "react";
import Welcome_Message from "./Components/Welcome_Message";
import End_Message from "./Components/End_Message";
import { accounte_Type } from "@/Pages/types";
import Account_Form from "@/Global-components/Account-form/Account_Form";
import { motion } from "framer-motion";
import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import { normalAlert } from "@/Lib/functions";
// ========================================================== //
export default function Sing_Up_Page() {
    const [isWelcomeMessegeFinished, setIsWelcomeMessegeFinished] = useState(false);
    const [isShowEndMessage, setIsShowEndMessage] = useState(false);
    const [managerInfo, setManagerInfo] = useState({
        name: "",
        age: 0,
        password: "",
    });


    const [getName, setGetName] = useState({
        value: "",
        isTrue: false
    });
    const [getAge, setGetAge] = useState({
        value: 0,
        isTrue: false
    });
    const [getPassword, setGetPassword] = useState({
        value: "",
        isTrue: false
    });


    function clickOnNextBtn() {
        const errorsMessagesList = [];

        if (!getName.isTrue) {
            errorsMessagesList.push("اسم الحساب لا يقل عن ثلاثة احرف ولا يزيد عن عشرون حرف");
        }

        if (!getAge.isTrue) {
            errorsMessagesList.push("يجب كتابة العمر");
        }

        if (!getPassword.isTrue) {
            errorsMessagesList.push("كلمة السر لا تقل عن ثلاثة احرف ولا تزيد عن خمسه وعشرون حرف")
        }


        if(errorsMessagesList.length > 0){
            normalAlert({
                title:"يوجد بيانات غير صالحه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });
        }
        else{
            setManagerInfo({
                name: getName.value,
                age: getAge.value,
                password: getPassword.value
            });

            setIsShowEndMessage(true);
        }
    }






    return <section
        dir="rtl"
        className="px-10 select-none w-full h-screen flex flex-col justify-center items-center"
    >
        {
            !isWelcomeMessegeFinished && !isShowEndMessage ?
                <Welcome_Message onIsWelcomeMessegeFinished={setIsWelcomeMessegeFinished} />
                :
                null
        }

        {
            isWelcomeMessegeFinished && !isShowEndMessage &&
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="w-full"
            >
                <h1 className="text-center text-2xl font-bold mb-10">
                    قم بكتابة تلك البيانات
                </h1>

                <Account_Form
                    name={getName.value}
                    age={getAge.value}
                    password={getPassword.value}
                    accountType={"manager"}
                    onGetName={setGetName}
                    onGetAge={setGetAge as any}
                    onGetPassword={setGetPassword}
                />


                <Custom_Btn
                    className="py-3 bg-emerald-500! border-emerald-600! font-bold w-full"
                    onClick={clickOnNextBtn}
                >
                    التالي
                </Custom_Btn>
            </motion.div>
        }

        {
            isWelcomeMessegeFinished && isShowEndMessage ?
                <End_Message managerInfo={managerInfo as accounte_Type} />
                :
                null
        }
    </section>
}