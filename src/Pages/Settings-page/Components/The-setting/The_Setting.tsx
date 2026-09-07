import Toggle_Btn from "@/Global-components/Toggle-btn/Toggle_Btn";
import { The_Setting_Props } from "@/Pages/typesProps";
// ========================================================== //
export default function The_Setting(
    {
        title,
        discription,
        typeSetting
    }: The_Setting_Props
) {
    return <div className="bg-slate-300 p-4 rounded-lg flex items-center justify-between">
        {/* Title & discription */}
        <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-bold">
                {
                    discription ? `"${title}"` : title
                }
            </h3>
            {
                discription ?
                    <p className="font-bold">
                        {discription}
                    </p>
                    :
                    null
            }
        </div>

        {/* Type setting */}
        <div>
            {
                typeSetting.question?.value != undefined ?
                    <Toggle_Btn 
                        value={typeSetting.question?.value}
                        onGetValue={typeSetting.question?.onGetValue}
                    />
                    :
                    typeSetting.element
            }
        </div>
    </div>
}