import { Box_for_setting_Props } from "@/Pages/typesProps";
// ========================================================== //
export default function Box_for_setting(
  {
    title,
    children,
    discription
  }: Box_for_setting_Props
) {
  return <div className="flex items-center justify-between bg-[#dee2e6] p-10 rounded-lg">
    <div>
      <h2 className="text-2xl font-bold mb-1">
        {title}
      </h2>

      {
        discription ?
          <p className="opacity-50 font-bold">
            {discription}
          </p>
          :
          null
      }
    </div>
    
    <div>
      {children}
    </div>
  </div>
}