import { Sidebar_Linsk_Props } from "@/Global-components/typesProps";
import { store_Type } from "@/Rtk/types";
import { shallowEqual, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom"
// ========================================================== //
export default function Sidebar_Links(
    {
        linkName,
        path,
        icon,
    }: Sidebar_Linsk_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);
    const { pathname } = useLocation();




    return <li
        style={{
            backgroundColor: pathname == path ? state.logInInfo?.color : "",
            '--account-color': state.logInInfo?.color,
        } as React.CSSProperties}

        className={`
            duration-300 p-2 rounded-sm hover:bg-(--account-color)/70 hover:text-white
            ${pathname == path ? "!text-white" : ""}
        `}
    >
        <Link to={path} className="flex items-center gap-2">
            <div>
                {icon}
            </div>

            <span className={`
                    text-lg hidden group-hover:block whitespace-nowrap text-(--thirdColor) font-bold
                    ${pathname == path ? "!text-white" : ""}
                `}
            >
                {linkName}
            </span>
        </Link>
    </li>
}