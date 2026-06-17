import { Top_Content_For_The_Drop_Props } from "@/Global-components/types";
// ========================================================== //
function Top_Content_For_The_Drop(
    { children, className }: Top_Content_For_The_Drop_Props
) {
    return <div className={className}>
        {children}
    </div>
}

Top_Content_For_The_Drop.displayName = "Top_Content_For_The_Drop";

export default Top_Content_For_The_Drop;