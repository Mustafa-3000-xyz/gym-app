import { motion } from "framer-motion";
import { Popup_Animation_Props } from "../types";
// ========================================================== //
export default function Animation(
    {
        children,
        className,
        ref,
        initial,
        animate,
        transition,
    }: Popup_Animation_Props
) {
    return <motion.div
        ref={ref}
        className={className}
        initial={initial}
        animate={animate}
        transition={transition}
    >
        {children}
    </motion.div>
}