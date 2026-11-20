import { Password_Inp_Props } from "@/Global-components/typesProps";
import { profilePagePath } from "@/Lib/constants";
import { changeLogInInfo } from "@/Rtk/Slices/UI-slices/logInInfoSlice";
import { Eye, EyeClosed } from "lucide-react";
import { InputText } from "primereact/inputtext";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// ========================================================== //
export default function Password_Inp(
    {
        account,
        value,
        onWrite,
        onIsErrorPassword,
    }: Password_Inp_Props
) {
    const dispatch = useDispatch();
    const [isShowPassword, setIsShowPassword] = useState(false);

    const navigate = useNavigate();



    function clickOnEye(e: any) {
        e.stopPropagation();
        setIsShowPassword(vlaue => !vlaue);
    }

    function writeInInp(e: ChangeEvent<HTMLInputElement>) {
        const removeSpaces = e.target.value.replace(/\s+/g, "");


        onWrite(removeSpaces);
    }

    function clickOnKey(e: KeyboardEvent) {
        if (e.key == "Enter" && account.password == value) {
            dispatch(changeLogInInfo({
                id: account.id as any,
                type: account.type as any,
                color: account.color
            }));


            navigate(profilePagePath.replace(":accountId", account.id as any));
        }
        else if (e.key == "Enter" && account.password != value) {
            onWrite("");
            onIsErrorPassword("كلمة المرور غير صحيحه");
        }
    }




    return <div className="relative">
        <InputText
            dir={"ltr"}
            className="h-10"
            placeholder="*** + ENTER"
            type={isShowPassword ? "text" : "password"}
            value={value}
            onChange={(e)=> writeInInp(e)}
            onKeyDown={clickOnKey as any}
            onClick={(e) => e.stopPropagation()}
        />


        {
            isShowPassword ?
                <Eye
                    className="absolute top-2 right-2.5 cursor-pointer text-black"
                    onClick={clickOnEye}
                />
                :
                <EyeClosed
                    className="absolute top-2 right-2.5 cursor-pointer text-black"
                    onClick={clickOnEye}
                />
        }
    </div>
}