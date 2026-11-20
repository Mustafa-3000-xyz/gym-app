import { useState } from "react";
import { Account_Form_Props } from "../typesProps";
import { regexAccountName, regexAccountPassword } from "@/Lib/REGEX";
import Max_Min_Length from "../Max-min-length/Max_Min_Length";
import { InputText } from "primereact/inputtext";
import { Eye, EyeClosed } from "lucide-react";
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
    const [isShowPassword, setIsShowPassword] = useState(false);





    function clickOnEye(e: any) {
        e.stopPropagation();
        setIsShowPassword(vlaue => !vlaue);
    }




    return <div className="mb-5">
        {/* Name & age */}
        <div className="grid grid-cols-2 gap-2 mb-1">
            {/* Name */}
            <div className="flex flex-col">
                <label className="mb-1 font-bold">
                    اسم الحساب
                </label>

                <InputText
                    className="h-10 text-center!"
                    value={name}
                    onChange={(e) => {
                        if (e.target.value.match(regexAccountName)) {
                            onGetName({
                                value: e.target.value,
                                isTrue: true
                            });
                        } else {
                            onGetName({
                                value: e.target.value,
                                isTrue: false
                            });
                        }
                    }}
                />

                <small
                    id="username-help"
                    className="text-[15px] font-bold"
                >
                    <Max_Min_Length
                        isGreenFlag={name.match(regexAccountName) ? true : false}
                        maxLength={15}
                        minLength={name.length}
                    />
                </small>
            </div>

            {/* Age */}
            <div className="flex flex-col">
                <label className="mb-1 font-bold">
                    العمر
                </label>

                <InputText
                    type="number"
                    className="h-10 text-center!"
                    value={age == 0 ? "" : age as any}
                    onChange={(e) => {
                        const value = Number(e.target.value) > 100 ? 100 : Number(e.target.value)
                        if (value != 0) {
                            onGetAge({
                                value: value,
                                isTrue: true
                            });
                        }
                        else {
                            onGetAge({
                                value: value,
                                isTrue: false
                            });
                        }
                    }}
                />
            </div>
        </div>


        {/* Password & type */}
        <div className="grid grid-cols-2 gap-2 px-60">
            {/* Password */}
            <div className="flex flex-col ">
                <label className="mb-1 font-bold">
                    الرقم السري
                </label>


                <div className="relative w-full">
                    <InputText
                        dir="ltr"
                        placeholder="***"
                        type={isShowPassword ? "text" : "password"}
                        className="h-12 w-full"
                        value={password}
                        onChange={(e) => {
                            if (e.target.value.match(regexAccountPassword)) {
                                onGetPassword({
                                    value: e.target.value,
                                    isTrue: true
                                });
                            }
                            else {
                                onGetPassword({
                                    value: e.target.value,
                                    isTrue: false
                                });
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.code === 'Space') {
                                e.preventDefault();
                            }
                        }}
                    />

                    {
                        isShowPassword ?
                            <Eye
                                className="absolute top-3 right-2.5 cursor-pointer text-black"
                                onClick={clickOnEye}
                            />
                            :
                            <EyeClosed
                                className="absolute top-3 right-2.5 cursor-pointer text-black"
                                onClick={clickOnEye}
                            />
                    }
                </div>

                <small
                    id="username-help"
                    className="text-[15px] font-bold"
                >
                    <Max_Min_Length
                        isGreenFlag={password.match(regexAccountPassword) ? true : false}
                        maxLength={25}
                        minLength={password.length}
                    />
                </small>
            </div>

            {/* Type */}
            <div className="flex flex-col">
                <label className="mb-1 font-bold">
                    نوع الحساب
                </label>

                <InputText
                    disabled
                    className="text-center"
                    placeholder={accountType == "captain" ? "كابتن" : "مدير"}
                />
            </div>
        </div>
    </div>
}