import Animation from "@/Global-components/Animation/Animation";
import { accounte } from "@/Pages/types";
import { addAccount } from "@/Rtk/Slices/accountsSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function End_Message(
    { managerInfo }: { managerInfo: accounte }
) {
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
                dispatch(addAccount({
                    ...managerInfo,
                    img: "",
                    type: "manager",
                    totalForActiveSessions: 0,
                    permissions: "fullAccess",
                }) as any)

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