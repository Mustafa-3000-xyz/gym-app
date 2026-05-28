import { ChangeEvent } from "react";
import { Inp_With_Label_Props } from "../types";
import Password_Inp from "../Password-inp/Password_Inp";
// ========================================================== //
export default function Inp_With_Label(
    {
        valueOrDefaultValue = "value",
        labelName,
        inpType = "text",
        inpValue = "",
        isChangeValue = true,
        onWriteInInput
    }: Inp_With_Label_Props
) {


    function writeInInp(e: ChangeEvent<HTMLInputElement>) {
        if (!isChangeValue) return;

        onWriteInInput(e);
    }



    return <div className="w-full">
        <label className="font-bold">{labelName}</label>

        {
            inpType == "password" ?
                <Password_Inp
                    password={inpValue as any}
                    onWriteInInput={writeInInp}
                />
                :
                valueOrDefaultValue == "value" ?
                    <input
                        type={inpType}
                        value={inpValue}
                        disabled={!isChangeValue}
                        className={`
                            w-full
                            rounded-lg border border-black/20 p-2 px-3 focus:outline-none
                            appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none
                            ${!isChangeValue ? "cursor-not-allowed opacity-45" : ""}
                        `}
                        onChange={writeInInp}
                    />
                    :
                    <input
                        type={inpType}
                        disabled={!isChangeValue}
                        className={`
                            w-full
                            rounded-lg border border-black/20 p-2 px-3 focus:outline-none
                            appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none
                            ${!isChangeValue ? "cursor-not-allowed opacity-45" : ""}
                        `}
                        onChange={writeInInp}
                    />
        }
    </div>
}