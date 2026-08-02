import { allPermissions } from "@/Lib/constants";
import { normalAlert } from "@/Lib/functions";
import { Permissions_Props } from "@/Pages/typesProps";
import { store_Type } from "@/Rtk/types";
import { KeyRound } from "lucide-react";
import { shallowEqual, useSelector } from "react-redux";
// ========================================================== //
export default function Permissions(
    {
        permissionsList,
        onGetPermissionsList
    }: Permissions_Props
) {
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
        }
    }, shallowEqual);


    function clickOnPermission(key: string) {
        if (state.logInInfo?.type == "captain") {
            normalAlert({
                title: "!! مهلا يا فتى",
                text: "المدير هو الوحيد القادر على تعديل الصلاحيات",
                icon: "error"
            });

            return;
        }

        if (permissionsList == "fullAccess") {
            normalAlert({
                title: "!! مهلا يا مدير",
                text: "لا يمكنك تعديل الصلاحيات الخاصه بك",
                icon: "error"
            });

            return;
        }

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
                            border py-2 pb-3 px-5 rounded-full flex gap-2 items-center cursor-pointer
                            ${isInclude || permissionsList == "fullAccess" ? "bg-(--thirdColor) text-white" : "border-slate-300"}
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