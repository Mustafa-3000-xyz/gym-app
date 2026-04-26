import { useEffect, useState } from "react";
import { Account_Form_Props } from "../types";
import { regexAccountName } from "@/Lib/REGEX";
import Inp_With_Label from "../Inp-with-label/Inp_With_Label";
// ========================================================== //
export default function Account_Form(
    {
        name,
        age,
        password,
        accountType,
        onGetName,
        onGetAge,
        onGetPassword
    }: Account_Form_Props
) {
    const [theName, setTheName] = useState(name);
    const [theAge, setTheAge] = useState(age);
    const [thePassword, setThePassword] = useState(password);



    function writeInAccountNameInp(value: string) {
        if (value.match(regexAccountName)) {
            setTheName(value);
        }
    }

    function writeInAccountAgeInp(value: number) {
        if (value >= 100) {
            setTheAge(100);
        }
        else {
            setTheAge(value);
        }
    }



    useEffect(function () {
        onGetName(theName);
        onGetAge(theAge);
        onGetPassword(thePassword);
    }, [theName, theAge, thePassword])



    return <div className="mb-5">
        {/* Name & age */}
        <div className="flex gap-2 justify-center mb-5">
            <div className="w-1/3">
                <Inp_With_Label
                    labelName="الاسم"
                    inpValue={theName}
                    onWriteInInput={(e) => writeInAccountNameInp(e.target.value)}
                />
            </div>

            <div className="w-1/3">
                <Inp_With_Label
                    labelName="العمر"
                    inpType="number"
                    inpValue={theAge as any}
                    onWriteInInput={(e) => writeInAccountAgeInp(+e.target.value)}
                />
            </div>
        </div>

        {/* Password & type */}
        <div className="flex gap-2 justify-center">
            {/* Password */}
            <div className="w-1/4">
                <Inp_With_Label
                    labelName="كلمة السر"
                    inpType="password"
                    inpValue={thePassword}
                    onWriteInInput={(e) => setThePassword(e.target.value)}
                />
            </div>

            {/* Type */}
            <div className="w-1/4">
                <Inp_With_Label
                    labelName="نوع الحساب"
                    inpValue={accountType == "manager" ? "المدير" : "الكابتن"}
                    isChangeValue={false}
                    onWriteInInput={(e) => setThePassword(e.target.value)}
                />
            </div>
        </div>
    </div>
}