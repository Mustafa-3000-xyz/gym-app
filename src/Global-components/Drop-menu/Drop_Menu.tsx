import { ReactElement, useEffect, useRef, useState } from "react";
import { Drop_Menu_Props } from "../types";
import Animation from "../Animation/Animation";
import Not_Found from "../Not-found/Not_Found";
import { Children, isValidElement } from "react";
// ========================================================== //
export default function Drop_Menu(
    {
        messageForNotAddChildren = "",
        classNameForMenu = "",
        isShowTheMenu = false,
        children,
        onGetCurrentIsShowMenu
    }: Drop_Menu_Props
) {
    const [topContent, setTopContent] = useState<ReactElement | any>(null);
    const [bottomContent, setBottomContent] = useState<ReactElement | any>(null);

    const [isShowMenu, setIsShowMenu] = useState(false);
    const topContentRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);




    function clickOnTopContnet() {
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
        Children.forEach(children, (child) => {
            if (!isValidElement(child)) return;
            const element = child as ReactElement | any;


            if (element.type?.displayName == "Top_Content_For_The_Drop") {
                setTopContent(child);
            } else if (element.type?.displayName == "Bottom_Content_For_The_Drop") {
                setBottomContent(child);
            }
        });
    }, [children]);

    useEffect(function () {
        if (isShowTheMenu == false) {
            setIsShowMenu(isShowTheMenu);
        }
    }, [isShowTheMenu]);

    useEffect(() => {
        function handleCloseMenu(e: MouseEvent) {
            if (
                !menuRef.current?.contains(e.target as any)
                &&
                topContentRef.current != e.target
                &&
                !topContentRef.current?.contains(e.target as any)
            ) {
                setIsShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleCloseMenu);
        return () => document.removeEventListener("mousedown", handleCloseMenu);
    }, [topContentRef, menuRef]);





    return <div
        className={`
            duration-500 cursor-pointer  
            relative w-full h-full flex flex-col justify-center items-center
            bg-slate-100 border border-slate-300 rounded-lg
        `}
    >
        <div
            className="w-full h-full flex items-center justify-center gap-2 cursor-pointer"
            ref={topContentRef}
            onClick={clickOnTopContnet}
        >
            {topContent}
        </div>


        {
            isShowMenu ?
                <Animation
                    ref={menuRef}
                    className={`
                        absolute top-full mt-2 z-50
                        shadow-2xl p-4 rounded-md select-none bg-slate-100 cursor-default!
                        ${classNameForMenu}
                    `}
                    initial={{
                        y: -30
                    }}

                    animate={{
                        y: 10
                    }}
                >
                    {
                        !bottomContent || !bottomContent.props.children ?
                            <div className="h-full flex justify-center">
                                <Not_Found
                                    title={messageForNotAddChildren}
                                    srcImg="not_found_in_drop_menu.svg"
                                    className="w-30"
                                />
                            </div>
                            :
                            bottomContent
                    }
                </Animation>
                :
                null
        }
    </div>
}