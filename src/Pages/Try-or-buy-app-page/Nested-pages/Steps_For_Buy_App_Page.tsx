import { useEffect, useState } from "react"
import Form_For_Buy_App from "../Components/Form-for-buy-app/Form_For_Buy_App";
import License_Key_Page from "../Components/License-key/License_Key";
import { normalAlert } from "@/Lib/functions";
import { supabase } from "@/Lib/constants";
import { licenesKey_Type } from "@/Pages/types";
import { invoke } from "@tauri-apps/api/core";
import { exit } from "@tauri-apps/plugin-process";
import bcrypt from 'bcryptjs';
// ========================================================== //
export default function Steps_For_Buy_App_Page() {
    const [isShowLicenseKey, setIsShowLicenseKey] = useState(false);
    const [getLicenseKey, setGetLicenseKey] = useState<null | licenesKey_Type>(null);

    const [getUserName, setGetUserName] = useState<null | string>(null);
    const [getGymName, setGetGymName] = useState<null | string>(null);
    const [getPhoneNumber, setGetPhoneNumber] = useState<null | number>(null);
    const [getAddress, setGetAddress] = useState<null | string>(null);
    const [getPassword, setGetPassword] = useState<null | string>(null);




    useEffect(function () {
        if (!getLicenseKey) return;


        normalAlert({
            title: "تهانينا",
            text: "الان يمكنك استخدام البرنامج مدى الحياه, من فضلك انتظر قليلا",
            icon: "success",
            runFunctionAfterSubmit: async function () {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(getPassword as any, saltRounds);

                const { error: updateError } = await supabase.from('licenses-keys')
                    .update({ linkedToPhoneNumber: `${getPhoneNumber}` })
                    .eq('id', getLicenseKey.id);

                if (updateError) {
                    normalAlert({
                        title: "حدث خطا اثناء التعديل على المفتاح",
                        text: String(updateError.message),
                        icon: "error",
                    })
                    return;
                }

                const { error: insertError } = await supabase.from('users').insert([
                    {
                        userName: getUserName,
                        gymName: getGymName,
                        address: getAddress,
                        phoneNumber: getPhoneNumber,
                        password: hashedPassword
                    }
                ]);

                if (insertError) {
                    normalAlert({
                        title: "حدث خطا اثناء اضافة الحساب",
                        text: String(insertError.message),
                        icon: "error"
                    })
                }
                else {
                    await invoke('manage_gym_procedures', {
                        newData: {
                            "testInfo": {
                                "isTest": false,
                                "endDate": null,
                                "activationDate": null
                            },
                            "licenseKey": getLicenseKey.key
                        }
                    });

                    await exit(0);
                }
            }
        })
    }, [getLicenseKey]);



    return isShowLicenseKey ?
        <License_Key_Page onGetLicenseKey={setGetLicenseKey} />
        :
        <Form_For_Buy_App
            onGetUserName={setGetUserName}
            onGetGymName={setGetGymName}
            onGetPhoneNumber={setGetPhoneNumber}
            onGetAddress={setGetAddress}
            onGetPassword={setGetPassword}
            onIsShowLicenseKey={setIsShowLicenseKey}
        />
}