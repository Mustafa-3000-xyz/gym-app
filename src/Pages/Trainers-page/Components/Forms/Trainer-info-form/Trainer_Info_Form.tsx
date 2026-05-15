import { Trainer_Info_Form_Props } from "@/Pages/types";
import { regexFindSpacesInTranierName, regexPhone } from "@/Lib/REGEX";
import { useEffect, useState } from "react";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
// ========================================================== //
export default function Trainer_Info_Form(
    {
        onGetFirstName,
        onGetLastName,
        onGetPhone,
        onGetAddress
    }: Trainer_Info_Form_Props
) {
    const trainerDetails = useSelector(state => state as store_Type).trainerDetails;


    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [messageError, setMessageError] = useState({
        firstName: "",
        lastName: "",
        phone: ""
    });



    function checkFirstName(value: string) {
        let valueInp = "";


        if (value.match(regexFindSpacesInTranierName)) {
            valueInp += value.replace(/\s/g, "");
        } else {
            valueInp += value
        }


        setFirstName(valueInp);
    }

    function checkLastName(value: string) {
        let valueInp = "";


        if (value.match(regexFindSpacesInTranierName)) {
            valueInp += value.replace(/\s/g, "");
        } else {
            valueInp += value
        }


        setLastName(valueInp);
    }

    function checkPhoneNumber(input: HTMLInputElement) {
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



    // When open trainerDetails details, i want show his values
    useEffect(function () {
        if (trainerDetails) {
            setFirstName(trainerDetails?.firstName as any);
            setLastName(trainerDetails?.lastName as any);
            setPhone(trainerDetails?.phone as any);
            setAddress(trainerDetails?.address as any);
        } else {
            setFirstName("");
            setLastName("");
            setPhone("");
            setAddress("");
        }
    }, [trainerDetails]);


    useEffect(function () {
        onGetFirstName(firstName);
        onGetLastName(lastName);
        onGetPhone(phone);
        onGetAddress(address);
    }, [firstName, lastName, phone, address]);




    return <div>
        {/* First name & Last name */}
        <div className="flex justify-center gap-3 mb-5">
            <div className="w-4/12">
                <Inp_With_Label
                    labelName="الاسم الاول"
                    inpType="text"
                    inpValue={firstName}
                    onWriteInInput={(e) => checkFirstName(e.target.value)}
                />
            </div>

            <div className="w-4/12">
                <Inp_With_Label
                    labelName="الاسم الثاني"
                    inpType="text"
                    inpValue={lastName}
                    onWriteInInput={(e) => checkLastName(e.target.value)}
                />
            </div>
        </div>

        {/* Phone number & Adrees */}
        <div className="flex justify-center gap-3">
            <div className="flex flex-col w-4/12">
                <Inp_With_Label
                    labelName="رقم الموبايل (اختياري)"
                    inpType="text"
                    inpValue={phone}
                    onWriteInInput={(e) => checkPhoneNumber(e.target)}
                />

                <span className="text-red-600">
                    {messageError.phone}
                </span>
            </div>

            <div className="w-4/12">
                <Inp_With_Label
                    labelName="العنوان (اختياري)"
                    inpType="number"
                    inpValue={address}
                    onWriteInInput={(e) => setAddress(e.target.value)}
                />
            </div>
        </div>
    </div>
}