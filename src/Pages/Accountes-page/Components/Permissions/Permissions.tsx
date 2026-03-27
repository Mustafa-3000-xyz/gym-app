import { allPermissions } from "@/Lib/customs";
import { allPermissions_Type } from "@/Lib/types";
import { useEffect, useState } from "react";
// ========================================================== //
export default function Permissions(
    { onGetPermissionsList }: { onGetPermissionsList: (x: string[]) => void }
) {
    const [permissionsList, setPermissionsList] = useState(["trainer-page"]);



    function clickOnButton(theLink: allPermissions_Type) {
        if (!permissionsList.includes(theLink.path)) {
            setPermissionsList(prev => [...prev, theLink.path]);
            return
        }

        const arr = permissionsList.filter(ele => ele != theLink.path);
        setPermissionsList(arr);
    }


    useEffect(function(){
        onGetPermissionsList(permissionsList);
    }, [permissionsList]);


    return <div className="flex flex-wrap gap-2">
        {
            allPermissions.map((ele, i) => {
                const isInclude = permissionsList.includes(ele.path);

                return <button
                    key={i}
                    type="button"
                    className={`
                        border border-slate-300 py-2 pb-3 px-5 rounded-full cursor-pointer flex gap-2 items-center
                        ${isInclude && "bg-amber-500"}
                    `}
                    onClick={() => clickOnButton(ele as any)}
                >

                    <h3 className="whitespace-nowrap font-bold"> {ele.title} </h3>
                </button>
            })
        }
    </div>
}