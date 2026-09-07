import { ChangeEvent, useState } from "react";
import { Inp_With_Label_Props } from "../typesProps";
import { Eye, EyeClosed } from "lucide-react";
// ========================================================== //
export default function Inp_With_Label(
    {
        labelName,
        placeholder,
        inpType = "text",
        inpValue = "",
        className = "",
        isChangeValue = true,
        isRemoveSpaces = false,
        onWriteInInput
    }: Inp_With_Label_Props
) {
    const [isShowPassword, setIsShowPassword] = useState(false);




    function clickOnEye(e: any) {
        e.stopPropagation()

        if (isShowPassword) {
            setIsShowPassword(false);
        } else {
            setIsShowPassword(true);
        }
    }

    function writeInInp(e: ChangeEvent<HTMLInputElement>) {
        if (!isChangeValue) return;

        if (isRemoveSpaces) {
            const removeSpaces = e.target.value.replace(/\s+/g, "");

            onWriteInInput?.(removeSpaces);
        }
        else {
            onWriteInInput?.(e.target.value);
        }
    }




    return <div className="w-full">
        <label className="font-bold">{labelName}</label>
        {
            inpType == "password" ?
                <div className="relative">
                    <input
                        placeholder={placeholder}
                        type={isShowPassword ? "text" : "password"}
                        dir={"ltr"}
                        value={inpValue ?? ""}
                        className={`
                            w-full border border-black/20 p-2 pr-10 rounded-lg focus:outline-0
                            ${className}
                        `}
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
                :
                <input
                    type={inpType}
                    placeholder={placeholder}
                    value={inpValue ?? ""}
                    disabled={!isChangeValue}
                    className={`
                        rounded-lg border border-black/20 p-2 px-3 focus:outline-none w-full text-center
                        ${!isChangeValue ? "cursor-not-allowed opacity-45" : ""}
                        ${className}
                    `}
                    onKeyDown={(e) => {
                        if (inpType == "number" && ["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    onChange={writeInInp}
                />
        }
    </div>
}