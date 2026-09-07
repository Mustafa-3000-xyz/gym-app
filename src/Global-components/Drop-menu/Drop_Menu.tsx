import { ReactElement, useEffect, useRef, useState } from "react";
import { Drop_Menu_Props } from "../typesProps";
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
    const [isShowMenu, setIsShowMenu] = useState(false);
    const topContentRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    let topContent: any | null = null;
    let bottomContent: any | null = null;



    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;
        const element = child as ReactElement | any;

        if (element.type?.displayName === "Top_Content_For_The_Drop") {
            topContent = child;
        } else if (element.type?.displayName === "Bottom_Content_For_The_Drop") {
            bottomContent = child;
        }
    });



    function clickOnTopContnet() {
        setIsShowMenu((prev) => !prev);
    }




    useEffect(() => {
        function handleCloseMenu(e: MouseEvent) {
            if (
                !menuRef.current?.contains(e.target as Node) &&
                topContentRef.current &&
                !topContentRef.current.contains(e.target as Node)
            ) {
                setIsShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleCloseMenu);
        return () => document.removeEventListener("mousedown", handleCloseMenu);
    }, []);

    useEffect(() => {
        if (isShowTheMenu === false) {
            setIsShowMenu(false);
        }
    }, [isShowTheMenu]);

    useEffect(() => {
        onGetCurrentIsShowMenu?.(isShowMenu);
    }, [isShowMenu, onGetCurrentIsShowMenu]);





    return <div className="relative w-full h-full flex flex-col justify-center items-center">
        <div
            className="w-full h-full bg-slate-100 border border-slate-300 rounded-lg"
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
                                    srcImg="/not_found_in_drop_menu.svg"
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