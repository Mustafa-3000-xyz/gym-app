import { Trainer_Info_Form_Props } from "@/Pages/typesProps";
import { regexAddress, regexFindSpacesInTranierName, regexFirstName, regexLastName, regexPhone } from "@/Lib/REGEX";
import { useEffect, useState } from "react";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { shallowEqual, useSelector } from "react-redux";
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
    const state = useSelector(function (state: store_Type) {
        return {
            trainerDetails: state.trainerDetails,
        }
    }, shallowEqual);


    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [phone, setPhone] = useState<number>(0);
    const [address, setAddress] = useState<string>("");



    function checkFirstName(value: string) {
        if (value.match(regexFindSpacesInTranierName)) {
            value = value.replace(/\s/g, "");
        }

        setFirstName(value);
    }

    function checkLastName(value: string) {
        if (value.match(regexFindSpacesInTranierName)) {
            value = value.replace(/\s/g, "");
        }

        setLastName(value);
    }



    // When open trainerDetails details, i want show his values
    useEffect(function () {
        if (state.trainerDetails) {
            setFirstName(state.trainerDetails?.firstName as any);
            setLastName(state.trainerDetails?.lastName as any);
            setPhone(state.trainerDetails?.phone as any);
            setAddress(state.trainerDetails?.address as any);
        } else {
            setFirstName("");
            setLastName("");
            setPhone(0);
            setAddress("");
        }
    }, [state.trainerDetails]);

    useEffect(function () {
        if (firstName?.match(regexFirstName)) {
            onGetFirstName(firstName);
        } else {
            onGetFirstName(null);
        }

        if (lastName?.match(regexLastName)) {
            onGetLastName(lastName);
        } else {
            onGetLastName(null);
        }

        if (phone?.toString().match(regexPhone) || phone == 0) {
            onGetPhone(phone);
        } else {
            onGetPhone(null);
        }

        if (address?.match(regexAddress) || address?.length == 0) {
            onGetAddress(address);
        } else {
            onGetAddress(null);
        }
    }, [firstName, lastName, phone, address]);




    return <div>
        {/* First name & Last name */}
        <div className="flex justify-center gap-3">
            <div className="w-4/12">
                <Inp_With_Label
                    labelName="الاسم الاول"
                    inpType="text"
                    inpValue={firstName}
                    onWriteInInput={(e) => checkFirstName(e.target.value)}
                />

                <p className={`
                        text-end m-1
                        ${firstName?.length < 3
                        ||
                        firstName?.length > 13 ? "text-red-500" : "text-emerald-500"}
                    `}
                >
                    13/{firstName.length}
                </p>
            </div>

            <div className="w-4/12">
                <Inp_With_Label
                    labelName="الاسم الثاني"
                    inpType="text"
                    inpValue={lastName}
                    onWriteInInput={(e) => checkLastName(e.target.value)}
                />

                <p className={`
                        text-end m-1
                        ${lastName.length < 3
                        ||
                        lastName?.length > 13 ? "text-red-500" : "text-emerald-500"}
                    `}
                >
                    13/{lastName?.length || 0}
                </p>
            </div>
        </div>

        {/* Phone number & Adrees */}
        <div className="flex justify-center gap-3">
            <div className="flex flex-col w-4/12">
                <Inp_With_Label
                    labelName="رقم الموبايل (اختياري)"
                    inpType="number"
                    inpValue={phone == 0 ? "" : phone}
                    onWriteInInput={(e) => setPhone(Number(e.target.value))}
                />

                <p className={`
                        text-end m-1
                        ${phone.toString().length > 10
                        ||
                        (phone.toString().length < 10 && phone != 0) ? "text-red-500" : "text-emerald-500"}
                    `}
                >
                    10/{phone == 0 ? 0 : phone?.toString().length}
                </p>
            </div>

            <div className="w-4/12">
                <Inp_With_Label
                    labelName="العنوان (اختياري)"
                    inpType="text"
                    inpValue={address}
                    onWriteInInput={(e) => setAddress(e.target.value)}
                />

                <p className={`
                        text-end m-1
                        ${address?.length > 50 ? "text-red-500" : "text-emerald-500"}
                    `}
                >
                    50/{address.length}
                </p>
            </div>
        </div>
    </div>
}