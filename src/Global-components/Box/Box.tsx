import { Box_Props } from "../typesProps";
// ========================================================== //
export default function Box(
    {
        icon,
        styleIcon,
        title,
        total,
        className
    }: Box_Props
) {
    return <div className={`
            bg-slate-100 rounded-lg h-40 p-5 select-none 
            flex items-center gap-3
            ${className}
        `}
    >
        <div className={`${styleIcon} p-3 rounded-lg w-fit`}>
            {icon}
        </div>

        <div>
            <h3 className="opacity-65 text-lg font-bold">
                {title}
            </h3>

            <p className="font-bold">
                {total}
            </p>
        </div>
    </div>
}