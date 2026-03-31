import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { Permissions_Props } from "@/Pages/types";
import { updatePropertyInAccount } from "@/Rtk/Slices/accountsSlice";
import { useAtomValue } from "jotai";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Permissions(
    {
        permissions,
        accountType,
        accountId,
        onGetPermissionsList
    }: Permissions_Props
) {
    const dispatch = useDispatch();

    const isLogInAtom = useAtomValue(isLogin_Atom);
    const [permissionsList, setPermissionsList] = useState(permissions as any);


    const theConditional = (isLogInAtom.type == "manager" && accountType == "manager") || (isLogInAtom.type == "captain")
    const allPermissions = [
        {
            title: "صفحة المتدربين",
            path: "/trainers-page"
        },
        {
            title: "صفحة الحسابات",
            path: "/accountes-page"
        },

        {
            title: "صفحة سجل الحضور",
            path: "/attendance-recorde-page"
        },
        {
            title: "صفحة الارباح والمصروفات",
            path: "/profits-and-expenses-page"
        },

        {
            title: "صفحة الاعدادات",
            path: "/settings-page"
        },
        {
            title: "صفحة شرح البرنامج",
            path: "/explain-app-page"
        }
    ];


    function clickOnButton(pathname: string) {
        if (theConditional) return;
        let arr = [...permissionsList];


        // Add or remove the pathname
        if (!arr.includes(pathname)) {
            arr.push(pathname);
        }
        else {
            const result = arr.filter(ele => ele != pathname);
            arr = result;
        }


        setPermissionsList(arr);
        onGetPermissionsList?.(arr);
    }



    // This for update permissions
    useEffect(function () {
        if (!accountId) return;

        dispatch(updatePropertyInAccount({
            id: accountId as any,
            column: "permissions",
            value: permissionsList
        }) as any)
    }, [permissionsList]);





    return <div className="flex flex-col gap-2">
        <div className="flex gap-1 mb-2 text-amber-500">
            <KeyRound
                strokeWidth={2.5}
                className=""
            />

            <h3 className="font-bold ">
                الصلاحيات :
            </h3>
        </div>

        <div className="flex flex-wrap gap-2">
            {
                allPermissions.map((ele, i) => {
                    const isInclude = permissionsList.includes(ele.path);

                    return <button
                        key={i}
                        type="button"
                        className={`
                            border border-slate-300 py-2 pb-3 px-5 rounded-full flex gap-2 items-center
                            ${isInclude || permissions == "fullAccess" ? "bg-(--managerColor) text-white" : ""}
                            ${theConditional ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                        `}
                        onClick={() => clickOnButton(ele.path as any)}
                    >

                        <h3 className="whitespace-nowrap font-bold"> {ele.title} </h3>
                    </button>
                })
            }
        </div>
    </div>
}