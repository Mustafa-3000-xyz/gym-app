import { Search } from "lucide-react";
import { Input_Search_Props } from "../types";
// ========================================================== //
export default function Input_Search(
    {placeholder, onGetValue}: Input_Search_Props
) {
    return <div className="w-full h-full flex relative">
        <input
            className="pr-10 w-full h-full p-4 focus:outline-0 border border-slate-300 rounded-lg"
            type="text"
            placeholder={placeholder}
            onChange={onGetValue as any}
        />

        <Search
            size={23}
            className="absolute z-20 top-3.5 ms-3 text-slate-400"
        />
    </div>
}