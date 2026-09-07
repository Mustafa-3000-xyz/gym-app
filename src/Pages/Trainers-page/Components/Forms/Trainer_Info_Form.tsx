import { Trainer_Info_Form_Props } from "@/Pages/typesProps";
import { regexAddress, regexFirstName, regexLastName, regexPhone } from "@/Lib/REGEX";
import { useEffect, useState } from "react";
import Inp_With_Label from "@/Global-components/Inp-with-label/Inp_With_Label";
import { shallowEqual, useSelector } from "react-redux";
import { store_Type } from "@/Rtk/types";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { Checkbox } from "primereact/checkbox";
// ========================================================== //
export default function Trainer_Info_Form(
    {
        onGetFirstName,
        onGetLastName,
        onGetPhone,
        onGetAddress,
        onGetTrainerType
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

    const [isMan, setIsMan] = useState(true);
    const [isGirl, setIsGirl] = useState(false);


    function clickOnManBox() {
        if (!isMan && isGirl) {
            setIsMan(true);
            setIsGirl(false);
        }
    }

    function clickOnGirlBox() {
        if (isMan && !isGirl) {
            setIsMan(false);
            setIsGirl(true);
        }
    }


    // When open trainerDetails details, i want show his values
    useEffect(function () {
        if (state.trainerDetails) {
            setFirstName(state.trainerDetails?.firstName as any);
            setLastName(state.trainerDetails?.lastName as any);
            setPhone(state.trainerDetails?.phone as any);
            setAddress(state.trainerDetails?.address as any);

            if (state.trainerDetails?.trainerType == "man") {
                setIsMan(true);
                setIsGirl(false);
            } else {
                setIsMan(false);
                setIsGirl(true);
            }
        } else {
            setFirstName("");
            setLastName("");
            setPhone(0);
            setAddress("");
            setIsMan(true);
            setIsGirl(false);
        }
    }, [state.trainerDetails]);

    // Send values
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


        if (isMan) {
            onGetTrainerType("man");
        } else {
            onGetTrainerType("women");
        }
    }, [firstName, lastName, phone, address, isMan, isGirl]);






    return <div className="grid grid-cols-2 gap-5 mb-4 p-1">
        {/* First name & last name & phone & address */}
        <div className="rounded-lg border border-slate-300 grid grid-cols-2 p-3 gap-3">
            <div>
                <Inp_With_Label
                    labelName="الاسم الاول"
                    inpType="text"
                    inpValue={firstName}
                    isRemoveSpaces
                    onWriteInInput={setFirstName}
                />

                <Max_Min_Length
                    maxLength={13}
                    minLength={firstName.length}
                    isGreenFlag={firstName?.length > 3 && firstName?.length <= 13}
                />
            </div>

            <div>
                <Inp_With_Label
                    labelName="الاسم الثاني"
                    inpType="text"
                    inpValue={lastName}
                    isRemoveSpaces
                    onWriteInInput={setLastName}
                />

                <Max_Min_Length
                    maxLength={13}
                    minLength={lastName.length}
                    isGreenFlag={lastName?.length > 3 && lastName?.length <= 13}
                />
            </div>

            <div>
                <Inp_With_Label
                    labelName="رقم الموبايل (اختياري)"
                    inpType="number"
                    inpValue={phone == 0 ? "" : phone}
                    onWriteInInput={(value) => setPhone(Number(value))}
                />

                <Max_Min_Length
                    maxLength={10}
                    minLength={phone == 0 ? 0 : phone?.toString().length}
                    isGreenFlag={phone.toString().match(regexPhone) || phone == 0 ? true : false}
                />
            </div>

            <div>
                <Inp_With_Label
                    labelName="العنوان (اختياري)"
                    inpType="text"
                    inpValue={address}
                    onWriteInInput={(value) => setAddress(value)}
                />

                <Max_Min_Length
                    maxLength={30}
                    minLength={address.length}
                    isGreenFlag={address?.length <= 30}
                />
            </div>
        </div>

        {/* Trainer type */}
        <div className="flex flex-col gap-5 justify-center items-center border rounded-lg border-slate-300">
            <h3 className="text-5xl font-bold">
                نوع المتدرب
            </h3>

            {/* Trainer type => man or girl*/}
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={clickOnManBox}
            >
                {/* Man */}
                <div className="flex gap-2 items-center">
                    <p className="text-2xl font-bold">
                        ذكر
                    </p>

                    <Checkbox checked={isMan} />
                </div>

                <div className="bg-black h-5 w-0.5"></div>

                {/* Girl */}
                <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={clickOnGirlBox}
                >
                    <p className="text-2xl font-bold">
                        انثى
                    </p>

                    <Checkbox checked={isGirl} />
                </div>
            </div>
        </div>
    </div>
}