import { accounte_Type } from "@/Pages/types";
import { addRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
// ========================================================== //
export default function End_Message(
    { managerInfo }: { managerInfo: accounte_Type }
) {
    const dispatch = useDispatch();


    const [index, setIndex] = useState(0);
    const texts = [
        "كل شئ جاهز الان ايها المدير !!",
        "نتمنى لك تجربة استخدام ممتعه"
    ];



    useEffect(() => {
        let count = 0;

        const interval = setInterval(async () => {
            if (count == texts.length - 1) {
                clearInterval(interval);
                dispatch(addRowInAccountsTable({
                    ...managerInfo,
                    profileImg: "",
                    coverImg: "",
                    type: "manager",
                    color: "#000000",
                    trainersTotal: 0,
                    numberOfActiveSessions: 0,
                    permissions: "fullAccess"
                }) as any);
            } 
            else {
                count += 1;
                setIndex(count);
            }
        }, 2500);

        return () => clearInterval(interval);
    }, []);



    return <motion.div
        key={index}
        className="text-center font-bold text-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        {texts[index]}
    </motion.div>
}