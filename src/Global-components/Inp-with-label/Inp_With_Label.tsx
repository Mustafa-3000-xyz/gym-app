import { ChangeEvent, useState } from "react";
import { Inp_With_Label_Props } from "../typesProps";
import { Eye, EyeClosed } from "lucide-react";
// ========================================================== //
export default function Inp_With_Label(
    {
        labelName,
        inpType = "text",
        inpValue = "",
        classNameForInput = "",
        isChangeValue = true,
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
        onWriteInInput(e);
    }




    return <div className="w-full">
        <label className="font-bold">{labelName}</label>
        {
            inpType == "password" ?
                <div className="relative">
                    <input
                        className={`
                            w-full border border-black/20 p-2 pr-10 rounded-lg focus:outline-0
                            ${classNameForInput}
                        `}
                        type={isShowPassword ? "text" : "password"}
                        dir={"ltr"}
                        value={inpValue ?? ""}
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
                    value={inpValue ?? ""}
                    disabled={!isChangeValue}
                    className={`
                        rounded-lg border border-black/20 p-2 px-3 focus:outline-none w-full text-center
                        ${!isChangeValue ? "cursor-not-allowed opacity-45" : ""}
                        ${classNameForInput}
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