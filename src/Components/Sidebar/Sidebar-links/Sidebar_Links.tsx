import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom"
// ========================================================== //
interface Sidebar_Linsk_Props {
    linkName: string,
    path: string,
    icon: ReactNode
}

export default function Sidebar_Links(
    { linkName, path, icon }: Sidebar_Linsk_Props
) {
    const {pathname} = useLocation();


    return <li className={`
            mb-3 transition duration-300 p-2 rounded-sm 
            ${pathname == path ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"}
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