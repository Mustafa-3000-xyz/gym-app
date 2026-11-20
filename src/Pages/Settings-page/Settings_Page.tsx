import { Droplet, Hammer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { anotherSettingsPagePath, preferencesPagePath } from "@/Lib/constants";
import Update_App from "./Components/Update_App";
import Custom_Line from "@/Global-components/Custom-line/Custom_Line";
// ========================================================== //
export default function Settings_Page() {
    const navigate = useNavigate();




    return <section className="select-none mt-10 grid gap-10">
        {/* Preferences */}
        <div
            className={`
                flex items-center gap-3 bg-zinc-200 p-14 rounded-lg cursor-pointer border-2 duration-300
                text-[#42a5f5] hover:opacity-50
            `}
            onClick={() => navigate(preferencesPagePath)}
        >
            <Droplet
                size={43}
            />

            <h2 className="text-2xl font-bold">
                التفضيلات
            </h2>
        </div>

        {/* Another settings */}
        <div
            className={`
                flex items-center gap-3 bg-zinc-200 p-14 rounded-lg cursor-pointer border-2 duration-300
                text-[#748cab] hover:opacity-50
            `}
            onClick={() => navigate(anotherSettingsPagePath)}
        >
            <Hammer
                size={43}
            />

            <h2 className="text-2xl font-bold">
                إعدادات اخرى
            </h2>
        </div>

        <Custom_Line />

        <Update_App />
    </section>
}