import { useEffect, useState } from "react";
// ========================================================== //
interface Trainer_Info_Form_Props {
    setGetFirstName: (x: string) => void,
    setGetLastName: (x: string) => void,
    setGetPhone: (x: number) => void,
    setGetAddress: (x: string) => void,
}

export default function Trainer_Info_Form(
    { setGetFirstName, setGetLastName, setGetPhone, setGetAddress }: Trainer_Info_Form_Props
) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState(0);
    const [address, setAddress] = useState("");
    const [messageError, setMessageError] = useState({
        firstNameError: "",
        lastNameError: ""
    });


    function checkInpName(input: HTMLInputElement) {
        const REGEX = /\s/g;
        const getAttrInInp = input.getAttribute("inp-type");

        if (input.value.match(REGEX) && getAttrInInp == "firstName") {
            setMessageError(prev => ({
                ...prev,
                firstNameError: "قم بوضع اسم واحد فقط"
            }));

            input.classList.add("!bg-red-600");
        }
        else if (!input.value.match(REGEX) && getAttrInInp == "firstName") {
            setMessageError(prev => ({
                ...prev,
                firstNameError: ""
            }));

            input.classList.remove("!bg-red-600");
        }

        if (input.value.match(REGEX) && getAttrInInp == "lastName") {
            setMessageError(prev => ({
                ...prev,
                lastNameError: "قم بوضع اسم واحد فقط"
            }));

            input.classList.add("!bg-red-600");
        }
        else if (!input.value.match(REGEX) && getAttrInInp == "lastName") {
            setMessageError(prev => ({
                ...prev,
                lastNameError: ""
            }));

            input.classList.remove("!bg-red-600");
        }
    }


    useEffect(function () {
        if (messageError.firstNameError == "") {
            setGetFirstName(firstName);
        } else {
            setGetFirstName("");
        }

        if (messageError.lastNameError == "") {
            setGetLastName(lastName);
        } else {
            setGetLastName("");
        }

        setGetPhone(phone);
        setGetAddress(address);
    }, [firstName, lastName, messageError.firstNameError, messageError.lastNameError, phone, address]);



    return <form className="px-3">
        {/* First name & Last name */}
        <div className="flex justify-center gap-3 mb-5">
            <div className=" flex flex-col">
                <h4 className="font-bold">الاسم الاول</h4>
                <input
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        checkInpName(e.target);
                    }}
                    inp-type="firstName"
                    type="text"
                    className="bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                />

                <span className="text-red-600">
                    {messageError.firstNameError}
                </span>
            </div>

            <div className="flex flex-col">
                <h4 className="font-bold">الاسم الثاني</h4>
                <input
                    onChange={(e) => {
                        setLastName(e.target.value);
                        checkInpName(e.target);
                    }}
                    inp-type="lastName"
                    type="text"
                    className=" bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                />

                <span className="text-red-600">
                    {messageError.lastNameError}
                </span>
            </div>
        </div>

        {/* Phone number & Adrees */}
        <div className="flex justify-center gap-3">
            <div>
                <h4 className="font-bold">رقم الموبايل (اختياري)</h4>
                <input
                    onChange={(e) => setPhone(Number(e.target.value))}
                    type="number"
                    className={`
                            bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0
                            appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none"
                        `}
                />
            </div>

            <div>
                <h4 className="font-bold">العنوان (اختياري)</h4>
                <input
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    className=" bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
                />
            </div>
        </div>
    </form>
}