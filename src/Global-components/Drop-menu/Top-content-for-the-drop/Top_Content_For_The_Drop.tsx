import { Top_Content_For_The_Drop_Props } from "@/Global-components/typesProps";
// ========================================================== //
function Top_Content_For_The_Drop(
    { children, className }: Top_Content_For_The_Drop_Props
) {
    return <div className={`
        ${className}
        flex items-center justify-center gap-2 w-full h-full select-none cursor-pointer
        duration-300 hover:scale-110
    `}
    >
        {children}
    </div>
}

Top_Content_For_The_Drop.displayName = "Top_Content_For_The_Drop";

export default Top_Content_For_The_Drop;