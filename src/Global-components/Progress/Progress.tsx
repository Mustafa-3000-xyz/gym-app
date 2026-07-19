import { Progress_Props } from "../types";
// ========================================================== //
export default function Progress(
    {
        classNameForParent,
        widthChild,
        percentage = null
    }: Progress_Props
) {
    return <div className={classNameForParent}>
        <div className="border-2 border-black/5 w-full h-[15px] mt-3 rounded-full">
            <div
                className={`
                    h-full rounded-full
                    ${widthChild == 100 ? "bg-emerald-500" : "bg-neutral-500"}
                `}
                style={{
                    width: `${Number(widthChild) > 100 ? 100 : widthChild}%`
                }}
            ></div>
        </div>

        {
            percentage != null ?
                <h3 className="text-end mt-2 font-bold">
                    {percentage}%
                </h3>
                :
                null
        }
    </div>
}