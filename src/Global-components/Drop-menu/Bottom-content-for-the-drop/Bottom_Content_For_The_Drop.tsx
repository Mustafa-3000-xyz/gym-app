import { Bottom_Content_For_The_Drop_Props } from "@/Global-components/types";
// ========================================================== //
export default function Bottom_Content_For_The_Drop(
    { children, className }: Bottom_Content_For_The_Drop_Props
) {
    return <div className={className}>
        {children}
    </div>
}