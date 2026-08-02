import { useState } from "react"
import { Toggle_Btn_Props } from "../typesProps";
// ========================================================== //
export default function Toggle_Btn(
    { 
        value, 
        disabled,
        onGetValue 
    }: Toggle_Btn_Props
) {
    const [isActive, setIsActive] = useState(value);



    function clickOnButton() {
        if (isActive) {
            setIsActive(false);
            onGetValue(false)
        }
        else {
            setIsActive(true);
            onGetValue(true);
        }
    }




    return <button 
        className={`
            duration-500 transition-all relative
            w-24 h-12 rounded-full  flex items-center
            ${isActive ? "bg-emerald-500" : "bg-red-500"}
            ${disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"}
        `}
        disabled={disabled}
        onClick={clickOnButton}
    >
        <div className={`
            duration-500 transition-all
            bg-white rounded-full h-10 w-10 absolute
            ${isActive ? "left-[calc(100%-44px)]" : "left-1"}
        `}
        ></div>
    </button>
}