import { exit } from "@tauri-apps/plugin-process";
// ========================================================== //
export default function Error_In_App_Page(
    { errorMessage }: { errorMessage: string }
) {
    return <section className="h-screen flex flex-col justify-center items-center">
        <img
            src={"/error-in-app.svg"}
            alt="Error image"
            className="h-1/2 w-1/2 pointer-events-none"
        />

        <div className="mt-3 flex flex-col gap-5 items-center">
            <p className="font-bold">
                {errorMessage}
            </p>

            <button
                className={`
                    transition-all px-6 py-2 rounded-full
                    flex justify-center items-center gap-3
                    bg-slate-500 border-slate-600 text-white cursor-pointer
                    active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
                    border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                `}
                onClick={async ()=> await exit(0)}
            >   
                إغلاق البرنامج
            </button>
        </div>
    </section>
}