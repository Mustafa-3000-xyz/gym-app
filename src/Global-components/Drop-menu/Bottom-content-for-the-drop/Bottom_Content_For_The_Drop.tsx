import { Bottom_Content_For_The_Drop_Props } from "@/Global-components/types";
// ========================================================== //
function Bottom_Content_For_The_Drop(
    { children, className }: Bottom_Content_For_The_Drop_Props
) {
    return <div className={className}>
        {children}
    </div>
}

Bottom_Content_For_The_Drop.displayName = "Bottom_Content_For_The_Drop";

export default Bottom_Content_For_The_Drop;