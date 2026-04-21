import { Eye, EyeClosed } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Password_Inp_Props } from "../types";
import { regexPasswordAccount } from "@/Lib/REGEX";
// ========================================================== //
export default function Password_Inp(
    {
        errorMessageHere,
        password = "",
        onGetPassword,
        onWriteInInput,
    }: Password_Inp_Props
) {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [thePassword, setThePassword] = useState(password);


    function clickOnEye(e: any) {
        e.stopPropagation()

        if (isShowPassword) {
            setIsShowPassword(false);
        } else {
            setIsShowPassword(true);
        }
    }


    function writeInInp(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value.match(regexPasswordAccount)) {
            onWriteInInput?.(e);
            setThePassword(e.target.value as any);
        }
    }



    useEffect(function(){
        if (errorMessageHere) {
            setThePassword("");
        }
    }, [errorMessageHere]);


    useEffect(function () {
        onGetPassword(thePassword);
    }, [thePassword]);



    return <div className="relative">
        <input
            type={isShowPassword ? "text" : "password"}
            placeholder="الرقم السري"
            className="w-full border p-2 pr-10 rounded-lg focus:outline-0 group-hover:placeholder:!text-white/50"
            dir={thePassword ? "ltr" : "rtl"}
            value={thePassword ?? ""}
            onChange={writeInInp}
            onClick={(e) => e.stopPropagation()}
        />

        {
            isShowPassword ?
                <Eye
                    className="absolute top-2.5 right-2.5 cursor-pointer"
                    onClick={clickOnEye}
                />
                :
                <EyeClosed
                    className="absolute top-2.5 right-2.5 cursor-pointer"
                    onClick={clickOnEye}
                />
        }
    </div>
}