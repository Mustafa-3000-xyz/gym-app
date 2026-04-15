import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { Sidebar_Linsk_Props } from "@/Global-components/types";
import { useAtomValue } from "jotai";
import { Link, useLocation } from "react-router-dom"
// ========================================================== //
export default function Sidebar_Links(
    {
        linkName,
        path,
        icon,
        isShowTheLink,
        onClick
    }: Sidebar_Linsk_Props
) {
    const isLoginAtom = useAtomValue(isLogin_Atom);
    const { pathname } = useLocation();


    return isShowTheLink &&
        <li 
            className={`
                transition-all duration-300 p-2 rounded-sm
                ${pathname == path ?
                    isLoginAtom.type == "manager" ?
                        "bg-(--managerColor) text-white"
                        :
                        "bg-(--captainColor) text-white"
                    :
                    isLoginAtom.type == "manager" ?
                        "hover:bg-(--managerColor)/70 hover:text-white"
                        :
                        "hover:bg-(--captainColor)/70 hover:text-white"
                }
            `}
            onClick={(e)=> onClick?.(e)}
        >
            <Link to={path} className="flex items-center gap-2">
                <div>
                    {icon}
                </div>

                <span className={`
                        text-lg
                        hidden group-hover:block whitespace-nowrap
                    `}
                >
                    {linkName}
                </span>
            </Link>
        </li>
}