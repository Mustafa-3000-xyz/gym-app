import { useState } from "react";
import Animation from "@/Global-components/Animation/Animation";
import { Data_Inputs_Props } from "@/Pages/Sing-up-page/types";
// ========================================================== //
export default function Data_Inputs(
    { onIsShowEndMessage, onGetManagerInfo }: Data_Inputs_Props
) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");

    const isAllFieldsFilled = name != "" && age != "" && password != "";



    function clickOnButton() {
        onGetManagerInfo({
            name,
            age: +age,
            password
        })
        onIsShowEndMessage(true);
    }



    return <Animation
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
    >
        <h1 className="text-center font-bold text-2xl mb-5">
            الان قم بملئ تلك البيانات لإنشاء حساب جديد
        </h1>

        <div className="flex flex-col items-center gap-3">
            <div className=" flex gap-3">
                <input
                    type="text"
                    placeholder="الاسم"
                    className="border p-2 w-2xs rounded-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="العمر"
                    className="border p-2 w-2xs rounded-lg"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>

            <input
                dir={password ? "ltr" : "rtl"}
                type="password"
                className="border p-2 w-2xs rounded-lg"
                placeholder="الرقم السري الخاص بالحساب"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>


        <button
            className={`
                w-full mt-10
                bg-blue-500 text-white p-2 rounded-lg
                ${isAllFieldsFilled ? 'opacity-100 cursor-pointer' : 'opacity-45 cursor-not-allowed'}
            `}
            onClick={clickOnButton}
            disabled={!isAllFieldsFilled}
        >
            التالي
        </button>
    </Animation>
}