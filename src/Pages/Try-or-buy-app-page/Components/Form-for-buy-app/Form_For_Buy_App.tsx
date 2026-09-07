import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { supabase, tryOrBuyAppPagePath } from "@/Lib/constants";
import { alert, normalAlert } from "@/Lib/functions";
import { regexAddress, regexGymName, regexPhone, regexUserName, regexUserPassword } from "@/Lib/REGEX";
import { Form_For_Buy_App_Page_Props } from "@/Pages/typesProps";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ========================================================== //
export default function Form_For_Buy_App(
    {
        onGetUserName,
        onGetGymName,
        onGetPhoneNumber,
        onGetAddress,
        onGetPassword,
        onIsShowLicenseKey
    }: Form_For_Buy_App_Page_Props
) {
    const [userName, setUserName] = useState("");
    const [gymName, setGymName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(0);

    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");

    const [isContinue, setIsContinue] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();




    async function clickOnNext() {
        if (!isContinue || isLoading) return;

        setIsLoading(true);

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .or(`phoneNumber.eq.${phoneNumber}`);


        if (error) {
            setIsLoading(true);
            normalAlert({
                title: "حدث خطأ اثناء التحقق من رقم الهاتف",
                text: String(error),
                icon: "error"
            });
        }

        // This for check does the row have same phone
        else if (data?.length == 0) {
            setIsLoading(false);

            onGetUserName(userName);
            onGetGymName(gymName);
            onGetPhoneNumber(phoneNumber);
            onGetAddress(address);
            onGetPassword(password);

            onIsShowLicenseKey(true);
        }
        else {
            setPhoneNumber(0);
            setIsLoading(false);

            normalAlert({
                title: "المعذره",
                text: "يبدو ان رقم الهاتف مسجل, بالرجاء اختيار رقم هاتف اخر",
                icon: "error"
            });
        }
    }

    function clickOnBackBtn() {
        alert({
            titleBeforeSubmit: "لحظه واحده",
            textBeforeSubmit: "هل انت متأكد من عدم استكمال اجراء الدفع ؟",
            runFunctionAfterSubmit() {
                navigate(tryOrBuyAppPagePath);
            }
        });
    }



    // Check continue to the license key page or no
    useEffect(function () {
        if (
            userName.match(regexUserName) && gymName.match(regexGymName) && address.match(regexAddress)
            && phoneNumber.toString().match(regexPhone) && password.match(regexUserPassword)
        ) {
            setIsContinue(true);
        }
        else {
            setIsContinue(false);
        }
    }, [userName, gymName, address, phoneNumber, password]);




    return <section className="h-screen w-full flex flex-col gap-10 justify-center items-center">
        <h1 className="text-5xl font-bold">
            قم بملئ تلك البيانات
        </h1>

        {/* Inputs */}
        <div>
            {/* Top */}
            <div className="flex gap-3">
                {/* Name */}
                <div>
                    <Inp_With_Label
                        inpValue={userName}
                        labelName="اسمك"
                        inpType="text"
                        onWriteInInput={setUserName}
                    />

                    <Max_Min_Length
                        maxLength={13}
                        minLength={userName.length}
                        isGreenFlag={userName.match(regexUserName) ? true : false}
                    />
                </div>

                {/* Gym Name */}
                <div>
                    <Inp_With_Label
                        inpValue={gymName}
                        labelName="اسم الجيم"
                        inpType="text" onWriteInInput={setGymName}
                    />

                    <Max_Min_Length
                        maxLength={11}
                        minLength={gymName.length}
                        isGreenFlag={gymName.match(regexGymName) ? true : false}
                    />
                </div>

                {/* Address */}
                <div>
                    <Inp_With_Label
                        inpValue={address}
                        labelName="العنوان"
                        inpType="text"
                        isRemoveSpaces
                        onWriteInInput={setAddress}
                    />

                    <Max_Min_Length
                        maxLength={30}
                        minLength={address.length}
                        isGreenFlag={address.match(regexAddress) ? true : false}
                    />
                </div>
            </div>

            {/* Bottom */}
            <div className="grid grid-cols-2 gap-3">
                {/* Phone number */}
                <div>
                    <Inp_With_Label
                        inpValue={phoneNumber == 0 ? "" : phoneNumber}
                        labelName="رقم الهاتف 20+"
                        inpType="number"
                        onWriteInInput={setPhoneNumber}
                    />

                    <Max_Min_Length
                        maxLength={10}
                        minLength={phoneNumber == 0 ? 0 : phoneNumber?.toString().length}
                        isGreenFlag={phoneNumber.toString().match(regexPhone) ? true : false}
                    />
                </div>

                {/* Password account */}
                <div>
                    <Inp_With_Label
                        inpValue={password}
                        labelName="كلمة السر"
                        inpType="password"
                        onWriteInInput={setPassword}
                    />

                    <Max_Min_Length
                        maxLength={25}
                        minLength={password.length}
                        isGreenFlag={password.match(regexUserPassword) ? true : false}
                    />
                </div>
            </div>
        </div>

        {/* Btns */}
        <div className="flex flex-col items-center gap-4">
            <button
                className={`
                    transition-all px-6 py-2 rounded-lg w-3xl
                    flex justify-center items-center gap-3 
                    bg-emerald-500 border-emerald-600 font-bold text-white 
                    ${isContinue && !isLoading ?
                        "cursor-pointer hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                        :
                        "cursor-not-allowed opacity-50"
                    }
                `}
                onClick={clickOnNext}
            >
                {
                    isLoading ?
                        <RefreshCcw
                            className="animate-spin"
                        />
                        :
                        "التالي"
                }
            </button>

            <button
                className={`
                    transition-all px-6 py-2 rounded-full w-2xl
                    flex justify-center items-center gap-3  border-b-[4px] 
                    bg-red-500 border-red-600 font-bold text-white 
                    cursor-pointer hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]
                `}
                onClick={clickOnBackBtn}
            >
                الرجوع
            </button>
        </div>
    </section>
}