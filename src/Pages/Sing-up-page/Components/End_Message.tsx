import isLogin_Atom from "@/Atoms/isLogin_Atom";
import Animation from "@/Global-components/Animation/Animation";
import { accounte } from "@/Pages/Accountes-page/types";
import { addAccount } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// ========================================================== //
export default function End_Message(
    { managerInfo }: { managerInfo: accounte }
) {
    const state = useSelector(state => state as store_Type);
    const setIsLoginAtom = useAtom(isLogin_Atom)[1];
    const dispatch = useDispatch();


    const [index, setIndex] = useState(0);
    const texts = [
        "كل شئ جاهز الان ايها المدير !!",
        "نتمنى لك تجربة استخدام ممتعه"
    ];


    useEffect(() => {
        let count = 0;

        const interval = setInterval(() => {
            setIndex(count);

            if (count >= texts.length) {
                clearInterval(interval);
                setIsLoginAtom(true);
                dispatch(addAccount({
                    ...managerInfo,
                    type: "manager",
                    permissions: "fullAccess",
                    attendanceList: []
                }) as any)

                
                localStorage.setItem("accountId", JSON.stringify("manager"));
                return;
            }

            count += 1;
        }, 2500);

        return () => clearInterval(interval);
    }, []);



    return <Animation
        key={index}
        className="text-center font-bold text-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        {texts[index]}
    </Animation>
}