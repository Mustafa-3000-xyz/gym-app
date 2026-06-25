import { Max_Min_Length_Props } from "../types";
// ========================================================== //
export default function Max_Min_Length(
    {
        isGreenFlag,
        maxLength,
        minLength
    }: Max_Min_Length_Props
) {

    
    return <p className={`
            text-end m-1
            ${isGreenFlag ? "text-emerald-500" : "text-red-500"}
        `}
    >
        {maxLength}/{minLength}
    </p>
}