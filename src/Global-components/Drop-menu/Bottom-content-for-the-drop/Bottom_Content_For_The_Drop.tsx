import { ReactNode } from "react";
// ========================================================== //
export default function Bottom_Content_For_The_Drop(
    { children, className }: { children: ReactNode, className?: string }
) {
    return <div className={className}>
        {children}
    </div>
}