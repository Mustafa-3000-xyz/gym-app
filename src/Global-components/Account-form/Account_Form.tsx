import { useEffect, useState } from "react";
import { Account_Form_Props } from "../types";
import { regexAccountName, regexAccountPassword } from "@/Lib/REGEX";
import Inp_With_Label from "../Inp-with-label/Inp_With_Label";
import Max_Min_Length from "../Max-min-length/Max_Min_Length";
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




    function writeInAccountAgeInp(value: number) {
        if (value >= 100) {
            setTheAge(100);
        }
        else {
            setTheAge(value);
        }
    }




    useEffect(function () {
        if (theName.match(regexAccountName)) {
            onGetName(theName);
        } else {
            onGetName(null);
        }

        if (theAge > 0) {
            onGetAge(theAge);
        }
        else {
            onGetAge(null);
        }

        if (thePassword.match(regexAccountPassword)) {
            onGetPassword(thePassword);
        }
        else {
            onGetPassword(null);
        }
    }, [theName, theAge, thePassword])




    return <div className="mb-5">
        {/* Name & age */}
        <div className="flex gap-2 justify-center mb-5">
            <div className="w-1/3">
                <Inp_With_Label
                    labelName="الاسم"
                    inpValue={theName}
                    onWriteInInput={(e) => setTheName(e.target.value)}
                />

                <Max_Min_Length
                    isGreenFlag={theName.match(regexAccountName) ? true : false}
                    maxLength={15}
                    minLength={theName.length}
                />
            </div>

            <div className="w-1/3">
                <Inp_With_Label
                    labelName="العمر"
                    inpType="number"
                    inpValue={theAge == 0 ? "" : theAge}
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

                <Max_Min_Length
                    isGreenFlag={thePassword.match(regexAccountPassword) ? true : false}
                    maxLength={25}
                    minLength={thePassword.length}
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