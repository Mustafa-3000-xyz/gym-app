import { useEffect, useRef, useState } from "react";
import { Drop_Menu_Props } from "../types";
import Animation from "../Animation/Animation";
import Not_Found from "../Not-found/Not_Found";
// ========================================================== //
export default function Drop_Menu(
    {
        title,
        icon,
        menuIsFullWidth = false,
        isShowTheMenu = false,
        children = null,
        menuHeight = "auto",
        onGetCurrentIsShowMenu
    }: Drop_Menu_Props
) {
    const [isShowMenu, setIsShowMenu] = useState(false);
    const btnFilterRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);




    function closemenu() {
        if (!isShowMenu) {
            setIsShowMenu(true);
        }
        else {
            setIsShowMenu(false);
        }
    }


    useEffect(function () {
        onGetCurrentIsShowMenu?.(isShowMenu);
    }, [isShowMenu]);


    useEffect(function () {
        if (!isShowTheMenu) {
            setIsShowMenu(false);
        }
    }, [isShowTheMenu]);


    useEffect(() => {
        function handleCloseMenu(e: MouseEvent) {
            if (
                !menuRef.current?.contains(e.target as any)
                &&
                btnFilterRef.current != e.target
                &&
                !btnFilterRef.current?.contains(e.target as any)
            ) {
                setIsShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleCloseMenu);
        return () => document.removeEventListener("mousedown", handleCloseMenu);
    }, [btnFilterRef, menuRef]);



    return <div
        className={`
            relative w-full
            duration-500 cursor-pointer  
            bg-slate-100 border border-slate-300 rounded-lg
            ${isShowMenu ? "bg-slate-200" : "hover:bg-slate-200"}
        `}
    >
        <button
            className="w-full h-full flex items-center justify-center gap-2 cursor-pointer py-2"
            ref={btnFilterRef}
            onClick={closemenu}
        >
            <span>{icon}</span>
            <span>{title}</span>
        </button>


        {
            isShowMenu ?
                <Animation
                    ref={menuRef}
                    className={`
                        absolute top-full mt-2 z-50
                        shadow-2xl p-4 rounded-md select-none bg-slate-100 !cursor-default
                        ${menuIsFullWidth ? "w-full" : "w-[340px]"}
                        ${menuHeight == "fixed" ? "h-[409px] overflow-auto" : ""}
                    `}
                    initial={{
                        y: -30
                    }}

                    animate={{
                        y: 10
                    }}
                >
                    {
                        children == null ?
                            <div className="h-full flex justify-center">
                                <Not_Found
                                    title="لا يوجد قيم"
                                    srcImg="not_found_in_drop_menu.svg"
                                    className="w-30"
                                />
                            </div>
                            :
                            children
                    }
                </Animation>
                :
                null
        }
    </div>
}