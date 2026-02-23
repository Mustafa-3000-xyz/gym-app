import { ReactNode } from "react";
import { TargetAndTransition } from "framer-motion";
// ========================================================== //
export interface Popup_Animation_Props {
    children: ReactNode;
    className?: string;
    initial?: TargetAndTransition;
    animate?: TargetAndTransition;
}