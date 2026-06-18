import { Sidebar_Linsk_Props } from "@/Global-components/types";
import { store_Type } from "@/Rtk/types";
import { shallowEqual, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"
// ========================================================== //
export default function Sidebar_Links(
    {
        linkName,
        path,
        icon,
        isShowTheLink,
    }: Sidebar_Linsk_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);
    const { pathname } = useLocation();




    return isShowTheLink ?
        <li
            className={`
                transition-all duration-300 p-2 rounded-sm
                ${pathname == path ?
                    state.logInInfo?.type == "manager" ?
                        "bg-(--managerColor) text-white"
                        :
                        "bg-(--captainColor) text-white"
                    :
                    state.logInInfo?.type == "manager" ?
                        "hover:bg-(--managerColor)/70 hover:text-white"
                        :
                        "hover:bg-(--captainColor)/70 hover:text-white"
                }
            `}
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
        :
        null
}