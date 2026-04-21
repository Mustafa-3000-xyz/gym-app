import { allPermissions } from "@/Lib/constants";
import { Permissions_Props } from "@/Pages/types";
import { KeyRound } from "lucide-react";
// ========================================================== //
export default function Permissions(
    {
        permissionsList,
        changePermissions,
        onGetPermissionsList
    }: Permissions_Props
) {
    function clickOnPermission(key: string) {
        if (
            permissionsList == "fullAccess"
            ||
            changePermissions == false
        ) return;

        let arr = [...permissionsList as string[]];

        // Add or remove the pathname
        if (!arr.includes(key)) {
            arr.push(key);
        }
        else {
            const result = arr.filter(ele => ele != key);
            arr = result;
        }


        onGetPermissionsList(arr);
    }


    return <div className="flex flex-col gap-2">
        <div className="flex gap-1 mb-2 text-[#717c8e] ">
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
                    const isInclude = permissionsList?.includes(ele.key);

                    return <button
                        key={i}
                        type="button"
                        className={`
                            border py-2 pb-3 px-5 rounded-full flex gap-2 items-center
                            ${isInclude || permissionsList == "fullAccess" ? "bg-(--thirdColor) text-white" : "border-slate-300"}
                            ${!changePermissions ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                        `}
                        onClick={() => clickOnPermission(ele.key as any)}
                    >

                        <h3 className="whitespace-nowrap font-bold"> {ele.title} </h3>
                    </button>
                })
            }
        </div>
    </div>
}