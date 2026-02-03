import { Trainer_Info_Form_Props } from "@/Pages/Trainers-page/trainersTypes";
import { regexPhone, regexTranierName } from "@/REGEX";
import { useState } from "react";
// ========================================================== //
export default function Trainer_Info_Form(
    {
        setGetFirstName,
        setGetLastName,
        setGetPhone,
        setGetAddress
    }: Trainer_Info_Form_Props
) {
    const [messageError, setMessageError] = useState({
        firstName: "",
        lastName: "",
        phone: ""
    });


    function checkInpName(input: HTMLInputElement) {
        const getAttrInInp = input.getAttribute("inp-type");

        if (input.value.match(regexTranierName) && getAttrInInp == "firstName") {
            setMessageError(prev => ({
                ...prev,
                firstName: "لا تضع المسافات"
            }));

            input.classList.add("!bg-red-600");
        }
        else if (!input.value.match(regexTranierName) && getAttrInInp == "firstName") {
            setMessageError(prev => ({
                ...prev,
                firstName: ""
            }));

            setGetFirstName(input.value);
            input.classList.remove("!bg-red-600");
        }

        if (input.value.match(regexTranierName) && getAttrInInp == "lastName") {
            setMessageError(prev => ({
                ...prev,
                lastName: "لا تضع المسافات"
            }));

            input.classList.add("!bg-red-600");
        }
        else if (!input.value.match(regexTranierName) && getAttrInInp == "lastName") {
            setMessageError(prev => ({
                ...prev,
                lastName: ""
            }));

            setGetLastName(input.value);
            input.classList.remove("!bg-red-600");
        }
    }

    function checkInpNumber(input: HTMLInputElement) {
        const parent = input.parentNode as HTMLDivElement;

        if (input.value.match(regexPhone) || input.value == "") {
            parent.classList.remove("!bg-red-600");

            setMessageError(prev => ({
                ...prev,
                phone: ""
            }));
        } else {
            parent.classList.add("!bg-red-600");

            setMessageError(prev => ({
                ...prev,
                phone: "يجب ان يكون 10 ارقام فقط"
            }));
        }

        setGetPhone(+input.value);
    }


    return <form className="px-3">
        {/* First name & Last name */}
        <div className="flex justify-center gap-3 mb-5">
            <div className="flex flex-col">
                <h4 className="font-bold">الاسم الاول</h4>
                <input
                    onChange={(e) => checkInpName(e.target)}
                    inp-type="firstName"
                    type="text"
                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                />

                <span className="text-red-600">
                    {messageError.firstName}
                </span>
            </div>

            <div className="flex flex-col">
                <h4 className="font-bold">الاسم الثاني</h4>
                <input
                    onChange={(e) => checkInpName(e.target)}
                    inp-type="lastName"
                    type="text"
                    className=" bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                />

                <span className="text-red-600">
                    {messageError.lastName}
                </span>
            </div>
        </div>

        {/* Phone number & Adrees */}
        <div className="flex justify-center gap-3">
            <div className="flex flex-col">
                <h4 className="font-bold">رقم الموبايل (اختياري)</h4>
                <div className="bg-slate-100 border border-slate-200 rounded-lg relative">
                    <input
                        onChange={(e) => checkInpNumber(e.target)}
                        type="number"
                        className={`
                            p-2 w-[80%] focus:outline-0
                            appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none"
                        `}
                    />

                    <span className="absolute top-2 left-2">
                        20+
                    </span>
                </div>

                <span className="text-red-600">
                    {messageError.phone}
                </span>
            </div>

            <div>
                <h4 className="font-bold">العنوان (اختياري)</h4>
                <input
                    onChange={(e) => setGetAddress(e.target.value)}
                    type="text"
                    className=" bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                />
            </div>
        </div>
    </form>
}