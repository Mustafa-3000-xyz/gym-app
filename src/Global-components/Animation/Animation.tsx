import { motion } from "framer-motion";
import { Animation_Props } from "../typesProps";
// ========================================================== //
export default function Animation(
    {
        children,
        className,
        ref,
        initial,
        animate,
        transition,
    }: Animation_Props
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