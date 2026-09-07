import Animation from "@/Global-components/Animation/Animation";
import { useEffect, useState } from "react";
// ========================================================== //
export default function Welcome_Message(
    { onIsWelcomeMessegeFinished }: { onIsWelcomeMessegeFinished: (x: boolean) => void }
) {
    const [index, setIndex] = useState(0);
    const texts = [
        "اهلا بك ايها المدير",
        "يسعدنا انك تقوم بستخدام برنامج Gym App",
    ];



    useEffect(() => {
        let count = 0;

        const interval = setInterval(() => {
            if (count == texts.length - 1) {
                clearInterval(interval);
                onIsWelcomeMessegeFinished(true);
            } 
            else {
                count += 1;
                setIndex(count);
            }
        }, 2500);

        return () => clearInterval(interval);
    }, []);



    return <div className="text-center font-bold text-2xl">
        <Animation
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {texts[index]}
        </Animation>
    </div>
}