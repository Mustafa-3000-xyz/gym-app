import isShowTrainerDetails_Atom from "@/Atoms/Is/isShowTrainerDetails_Atom";
import trainerDetails_Atom from "@/Atoms/Details/trainerDetails_Atom";
import { Trainer_Info_Form_Props } from "@/Pages/types";
import { regexPhone, regexTranierName } from "@/Lib/REGEX";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
// ========================================================== //
export default function Trainer_Info_Form(
    {
        onGetFirstName,
        onGetLastName,
        onGetPhone,
        onGetAddress
    }: Trainer_Info_Form_Props
) {
    const trainer = useAtomValue(trainerDetails_Atom);
    const isShowTrainerDetailsAtom = useAtomValue(isShowTrainerDetails_Atom);


    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [messageError, setMessageError] = useState({
        firstName: "",
        lastName: "",
        phone: ""
    });


    function checkInpName(input: HTMLInputElement) {
        const getAttr = input.getAttribute("inp-type");
        let valueInp = "";

        if (input.value.match(regexTranierName)) {
            valueInp += input.value.replace(/\s/g, "");
        } else {
            valueInp += input.value
        }


        if (getAttr == "firstName") {
            setFirstName(valueInp);
        } else {
            setLastName(valueInp);
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

        setPhone(input.value);
    }


    // When open trainer details, i want show his values
    useEffect(function () {
        if (isShowTrainerDetailsAtom && trainer) {
            setFirstName(trainer.firstName);
            setLastName(trainer.lastName);
            setPhone(trainer.phone);
            setAddress(trainer.address);
        } else {
            setFirstName("");
            setLastName("");
            setPhone("");
            setAddress("");
        }
    }, [isShowTrainerDetailsAtom, trainer]);


    useEffect(function () {
        onGetFirstName(firstName);
        onGetLastName(lastName);
        onGetPhone(phone);
        onGetAddress(address);
    }, [firstName, lastName, phone, address]);


    return <form>
        {/* First name & Last name */}
        <div className="flex justify-center gap-3 mb-5">
            <div className={`
                    flex flex-col
                    w-4/12
                `}
            >
                <h4 className="font-bold">الاسم الاول</h4>
                <input
                    value={firstName}
                    onChange={(e) => checkInpName(e.target)}
                    inp-type="firstName"
                    type="text"
                    className="bg-slate-100 border border-slate-300 p-2 rounded-lg focus:outline-0"
                />
            </div>

            <div className={`
                    flex flex-col
                    w-4/12
                `}
            >
                <h4 className="font-bold">الاسم الثاني</h4>
                <input
                    value={lastName}
                    onChange={(e) => checkInpName(e.target)}
                    type="text"
                    className=" bg-slate-100 border border-slate-300 p-2 rounded-lg focus:outline-0"
                />
            </div>
        </div>

        {/* Phone number & Adrees */}
        <div className="flex justify-center gap-3">
            <div className={`
                    flex flex-col
                    w-4/12
                `}
            >
                <h4 className="font-bold">رقم الموبايل (اختياري)</h4>
                <div className="bg-slate-100 border border-slate-300 rounded-lg relative">
                    <input
                        value={phone}
                        onChange={(e) => checkInpNumber(e.target)}
                        type="number"
                        placeholder="0000000000"
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

            <div className={`
                    flex flex-col
                    w-4/12
                `}
            >
                <h4 className="font-bold">العنوان (اختياري)</h4>
                <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    className=" bg-slate-100 border border-slate-300 p-2 rounded-lg focus:outline-0"
                />
            </div>
        </div>
    </form>
}