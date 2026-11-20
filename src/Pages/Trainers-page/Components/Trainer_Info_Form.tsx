import { regexFirstName, regexLastName, regexPhone } from "@/Lib/REGEX";
import { useEffect, useState } from "react";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Trainer_Info_Form_Props } from "@/Pages/typesProps";
import { useParams } from "react-router-dom";
// ========================================================== //
export default function Trainer_Info_Form(
    {
        trainerType,
        firstName,
        lastName,
        phone,
        address,
        notes,
        onGetFirstName,
        onGetLastName,
        onGetPhone,
        onGetAddress,
        onGetTrainerType,
        onGetNotes
    }: Trainer_Info_Form_Props
) {
    const [trainerTypeInp, setTrainerTypeInp] = useState<"man" | "woman">("man");
    const [firstNameInp, setFirstNameInp] = useState<string>("");
    const [lastNameInp, setLastNameInp] = useState<string>("");
    const [phoneInp, setPhoneInp] = useState<number>(0);
    const [addressInp, setAddressInp] = useState<string>("");
    const [notesInp, setNotesInp] = useState<string>("");

    const { trainerId } = useParams();




    // When open trainerDetails details, i want show his values
    useEffect(function () {
        if (trainerId) {
            setTrainerTypeInp(trainerType!);
            setFirstNameInp(firstName!);
            setLastNameInp(lastName!);
            setPhoneInp(phone!);
            setAddressInp(address!);
            setNotesInp(notes!);
        } else {
            setTrainerTypeInp("man");
            setFirstNameInp("");
            setLastNameInp("");
            setPhoneInp(0);
            setAddressInp("");
            setNotesInp("");
        }
    }, [trainerId]);

    // Send values
    useEffect(function () {
        onGetTrainerType(trainerTypeInp as any);

        if (firstNameInp?.match(regexFirstName)) {
            onGetFirstName({
                value: firstNameInp,
                isTrue: true
            });
        } else {
            onGetFirstName({
                value: firstNameInp,
                isTrue: false
            });
        }

        if (lastNameInp?.match(regexLastName)) {
            onGetLastName({
                value: lastNameInp,
                isTrue: true
            });
        } else {
            onGetLastName({
                value: lastNameInp,
                isTrue: false
            });
        }

        if (phoneInp?.toString().match(regexPhone) || phoneInp == 0) {
            onGetPhone({
                value: Number(phoneInp),
                isTrue: true
            });
        } else {
            onGetPhone({
                value: Number(phoneInp),
                isTrue: false
            });
        }

        if (addressInp.length <= 30 || addressInp?.length == 0) {
            onGetAddress({
                value: addressInp,
                isTrue: true
            });
        } else {
            onGetAddress({
                value: addressInp,
                isTrue: false
            });
        }

        onGetNotes(notesInp);
    }, [trainerTypeInp, firstNameInp, lastNameInp, phoneInp, addressInp, notesInp]);




    return <div className="grid grid-cols-2 gap-5 mb-3 p-1">
        <div className="rounded-lg border border-slate-300 p-3">
            {/* Inputes */}
            <div className="grid grid-cols-2 gap-3">
                {/* First name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">الاسم الاول</label>

                    <InputText
                        className="h-10 text-center!"
                        value={firstNameInp}
                        onChange={(e) => setFirstNameInp(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key == ' ' || e.code == 'Space') {
                                e.preventDefault();
                            }
                        }}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={13}
                            minLength={firstNameInp.length}
                            isGreenFlag={firstNameInp?.length >= 3 && firstNameInp?.length <= 13}
                        />
                    </small>
                </div>

                {/* last name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">الاسم الثاني</label>

                    <InputText
                        className="h-10 text-center!"
                        value={lastNameInp}
                        onChange={(e) => setLastNameInp(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.code === 'Space') {
                                e.preventDefault();
                            }
                        }}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={13}
                            minLength={lastNameInp.length}
                            isGreenFlag={lastNameInp?.length >= 3 && lastNameInp?.length <= 13}
                        />
                    </small>
                </div>

                {/* phone */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">رقم الموبايل (اختياري) </label>

                    <InputText
                        type="number"
                        className="h-10 text-center!"
                        value={phoneInp == 0 ? "" : phoneInp as any}
                        onChange={(e) => setPhoneInp(Number(e.target.value))}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={10}
                            minLength={phoneInp == 0 ? 0 : phoneInp?.toString().length as any}
                            isGreenFlag={phoneInp.toString().match(regexPhone) || phoneInp == 0 ? true : false}
                        />
                    </small>
                </div>

                {/* address */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold"> العنوان (اختياري) </label>

                    <InputText
                        className="h-10 text-center!"
                        value={addressInp}
                        onChange={(e) => setAddressInp(e.target.value)}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={30}
                            minLength={addressInp.length}
                            isGreenFlag={addressInp?.length <= 30}
                        />
                    </small>
                </div>
            </div>

            {/* Textarea */}
            <div>
                <label className="font-bold"> ملاحظات (اختياري)</label>

                <textarea
                    value={notesInp}
                    className="bg-white w-full p-2 h-12 resize-none border border-gray-300 rounded-lg duration-300 outline-0 focus:border-gray-500"
                    onChange={e => setNotesInp(e.target.value)}
                ></textarea>
            </div>
        </div>

        {/* Trainer type */}
        <div className="flex flex-col gap-5 justify-center items-center border rounded-lg border-slate-300">
            <h3 className="text-5xl font-bold">
                نوع المتدرب
            </h3>

            {/* Trainer type => man or girl*/}
            <div className="flex items-center gap-3 cursor-pointer" >
                {/* Man */}
                <div
                    className="flex gap-2 items-center"
                    onClick={() => setTrainerTypeInp("man")}
                >
                    <p className="text-2xl font-bold">
                        ذكر
                    </p>

                    <Checkbox checked={trainerTypeInp == "man" ? true : false} />
                </div>

                <div className="bg-black h-5 w-0.5"></div>

                {/* Girl */}
                <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => setTrainerTypeInp("woman")}
                >
                    <p className="text-2xl font-bold">
                        انثى
                    </p>

                    <Checkbox checked={trainerTypeInp == "woman" ? true : false} />
                </div>
            </div>
        </div>
    </div >
}