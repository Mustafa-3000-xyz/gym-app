import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { supabase } from "@/Lib/constants";
import { normalAlert } from "@/Lib/functions";
import { licenesKey_Type } from "@/Pages/types";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
// ========================================================== //
export default function License_Key(
    { onGetLicenseKey }: { onGetLicenseKey: (x: licenesKey_Type) => void }
) {
    const [inpKey, setInpKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);



    async function clickOnCheck() {
        if (!inpKey || isLoading) return;

        setIsLoading(true);

        const { data, error } = await supabase
            .from('licenses-keys')
            .select('*')
            .or(`key.eq.${inpKey}`);

        const licenseData = data?.[0] as licenesKey_Type | null | undefined;



        if (error) {
            setIsLoading(false);
            normalAlert({
                title: "حدث خطأ اثناء التحقق من المفتاح",
                text: String(error),
                icon: "error"
            });
        }
        // If the key is not exist
        else if (!licenseData) {
            setInpKey("");

            setIsLoading(false);
            normalAlert({
                title: "المعذره",
                text: "المفتاح الذي ادخلته غير موجود",
                icon: "error"
            });
        }
        else if (licenseData.key && !licenseData.linkedToPhoneNumber) {
            setIsLoading(false);
            onGetLicenseKey(licenseData);
        }
        else {
            setInpKey("");

            setIsLoading(false);
            normalAlert({
                title: "للاسف يا صاح",
                text: "المفتاح الذي ادخلته موجود بالفعل",
                icon: "error"
            });
        }
    }



    return <section className="h-screen w-full flex flex-col gap-5 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-5">
            <h2 className="text-5xl font-bold">
                ادخل المفتاح
            </h2>

            <p className="font-bold">
                <span className="mx-2">
                    قم بالتواصل معنا عبر التليجرام للحصول على المفتاح
                </span>

                <span className="underline">
                    Gym_App_20@
                </span>
            </p>
        </div>

        <div className="flex flex-col items-center gap-4  w-full">
            <Inp_With_Label
                inpValue={inpKey}
                labelName=""
                className="w-5xl"
                isRemoveSpaces
                onWriteInInput={setInpKey}
            />

            <button
                className={`
                    transition-all px-6 py-2 rounded-lg w-3xl
                    flex justify-center items-center gap-3 
                    bg-emerald-500 border-emerald-600 font-bold text-white 
                    ${inpKey && !isLoading ?
                        "cursor-pointer hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                        :
                        "cursor-not-allowed opacity-50"
                    }
                `}
                onClick={clickOnCheck}
            >
                {
                    isLoading ?
                        <RefreshCcw
                            className="animate-spin"
                        />
                        :
                        "التحقق"
                }
            </button>
        </div>
    </section>
}