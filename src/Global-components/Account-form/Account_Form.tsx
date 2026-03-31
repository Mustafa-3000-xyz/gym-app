import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { Account_Form_Props } from "../types";
// ========================================================== //
export default function Account_Form(
    {
        name,
        age,
        password,
        dontChangeValues,
        accountType,
        onGetName,
        onGetAge,
        onGetPassword
    }: Account_Form_Props
) {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [theName, setTheName] = useState(name);
    const [theAge, setTheAge] = useState(age);
    const [thePassword, setThePassword] = useState(password);



    function clickOnEye() {
        if (dontChangeValues) return;

        if (isShowPassword) {
            setIsShowPassword(false);
        } else {
            setIsShowPassword(true);
        }
    }



    useEffect(function(){
        onGetName(theName);
        onGetAge(theAge);
        onGetPassword(thePassword);
    }, [theName, theAge, thePassword])



    return <form>
        {/* Name & age */}
        <div className="flex gap-2 justify-center mb-2">
            <div>
                <h3 className="mb-1 font-bold">الاسم</h3>
                <input
                    value={theName}
                    disabled={dontChangeValues}
                    type="text"
                    className={`
                        rounded-lg border border-black p-1 px-3 focus:outline-none
                        ${dontChangeValues ? "cursor-not-allowed opacity-45" : ""}
                    `}
                    onChange={(e)=> setTheName(e.target.value) as any}
                />
            </div>

            <div>
                <h3 className="mb-1 font-bold">العمر</h3>
                <input
                    value={theAge}
                    disabled={dontChangeValues}
                    type="number"
                    className={`
                        rounded-lg border border-black p-1 px-3 focus:outline-none
                        ${dontChangeValues ? "cursor-not-allowed opacity-45" : ""}
                    `}
                    onChange={(e)=> setTheAge(+e.target.value as number) as any}
                />
            </div>
        </div>

        {/* Password & type */}
        <div className="flex gap-2 justify-center">
            {/* Password */}
            <div>
                <h3 className="mb-1 font-bold">كلمة السر</h3>
                <div className="relative">
                    <input
                        type={isShowPassword ? "text" : "password"}
                        value={thePassword}
                        disabled={dontChangeValues}
                        dir="ltr"
                        className={`
                            rounded-lg border border-black p-1 px-3 focus:outline-none 
                            ${dontChangeValues ? "cursor-not-allowed opacity-45" : ""}
                        `}
                        onChange={(e)=> setThePassword(e.target.value) as any}
                    />

                    {
                        isShowPassword ?
                            <Eye
                                className="absolute top-1.5 right-1.5 cursor-pointer"
                                onClick={clickOnEye}
                            />
                            :
                            <EyeClosed
                                className={`
                                    absolute top-1.5 right-1.5
                                    ${dontChangeValues ? "cursor-not-allowed opacity-45" : "cursor-pointer"}
                                `}
                                onClick={clickOnEye}
                            />
                    }
                </div>
            </div>

            {/* Type */}
            <div>
                <h3 className="mb-1 font-bold">نوع الحساب</h3>
                <input
                    type={"text"}
                    defaultValue={accountType == "manager" ? "مدير" : "كابتن"}
                    disabled
                    className={`
                        opacity-45 cursor-not-allowed
                        rounded-lg border border-black p-1 px-3 focus:outline-none 
                    `}
                />
            </div>
        </div>
    </form>
}