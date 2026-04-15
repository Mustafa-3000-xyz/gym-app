import { ChangeEvent, useEffect, useState } from "react";
import { Account_Form_Props } from "../types";
import Password_Inp from "../Password-inp/Password_Inp";
import { regexAccountName } from "@/Lib/REGEX";
// ========================================================== //
export default function Account_Form(
    {
        name,
        age,
        password,
        accountType,
        dontChangeValues,
        onGetName,
        onGetAge,
        onGetPassword
    }: Account_Form_Props
) {
    const [theName, setTheName] = useState(name);
    const [theAge, setTheAge] = useState(age);
    const [thePassword, setThePassword] = useState(password);



    function writeInAccountNameInp(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.match(regexAccountName)) {
            setTheName(e.target.value);
        }
    }

    function writeInAccountAgeInp(e: ChangeEvent<HTMLInputElement>) {
        if (+e.target.value >= 100) {
            setTheAge(100);
        }
        else {
            setTheAge(+e.target.value);
        }
    }



    useEffect(function () {
        onGetName(theName);
        onGetAge(theAge);
        onGetPassword(thePassword);
    }, [theName, theAge, thePassword])



    return <form className="mb-5">
        {/* Name & age */}
        <div className="flex gap-2 justify-center mb-5">
            <div className="w-1/3">
                <h3 className="mb-1 font-bold">الاسم</h3>
                <input
                    value={theName}
                    disabled={dontChangeValues}
                    type="text"
                    className={`
                        w-full
                        rounded-lg border border-black p-2 px-3 focus:outline-none
                        ${dontChangeValues ? "cursor-not-allowed opacity-45" : ""}
                    `}
                    onChange={writeInAccountNameInp}
                />
            </div>

            <div className="w-1/3">
                <h3 className="mb-1 font-bold">العمر</h3>
                <input
                    value={theAge >= 100 ? 100 : theAge}
                    disabled={dontChangeValues}
                    type="number"
                    className={`
                        w-full
                        rounded-lg border border-black p-2 px-3 focus:outline-none
                        ${dontChangeValues ? "cursor-not-allowed opacity-45" : ""}
                    `}
                    onChange={writeInAccountAgeInp}
                />
            </div>
        </div>

        {/* Password & type */}
        <div className="flex gap-2 justify-center">
            {/* Password */}
            <div className="w-1/4">
                <h3 className="mb-1 font-bold">كلمة السر</h3>
                <Password_Inp
                    password={thePassword}
                    onGetPassword={setThePassword}
                />
            </div>

            {/* Type */}
            <div className="w-1/4">
                <h3 className="mb-1 font-bold">نوع الحساب</h3>
                <input
                    type={"text"}
                    defaultValue={accountType == "manager" ? "مدير" : "كابتن"}
                    disabled
                    className={`
                        w-full
                        opacity-45 cursor-not-allowed
                        rounded-lg border border-black p-2 px-3 focus:outline-none 
                    `}
                />
            </div>
        </div>
    </form>
}