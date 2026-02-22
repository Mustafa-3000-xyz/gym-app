import { Sidebar_Linsk_Props } from "@/Global-components/types";
import { Link, useLocation } from "react-router-dom"
// ========================================================== //
export default function Sidebar_Links(
    { linkName, path, icon }: Sidebar_Linsk_Props
) {
    const {pathname} = useLocation();


    return <li className={`
            mb-3 transition duration-300 p-2 rounded-sm 
            ${pathname == path ? "bg-(--primary)/10 text-(--primary)" 
                : "hover:bg-(--primary)/10 hover:text-(--primary)"}
        `}
    >
        <Link to={path} className="flex items-center gap-2">
            <div>
                {icon}
            </div>

            <span className="text-lg">{linkName}</span>
        </Link>
    </li>
}