import { regexAddress, regexFirstName, regexLastName, regexPhone } from "@/Lib/REGEX";
import { useCallback } from "react";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Trainer_Info_Form_Props } from "@/Pages/typesProps";
// ========================================================== //
export default function Trainer_Info_Form(
    {
        trainerType,
        firstName,
        lastName,
        phone,
        address,
        notes,
        onGetTrainerType,
        onGetFirstName,
        onGetLastName,
        onGetPhone,
        onGetAddress,
        onGetNotes
    }: Trainer_Info_Form_Props
) {
    const handleTrainerType = useCallback(function (value: "man" | "woman") {
        onGetTrainerType(value);
    }, []);

    const handleFirstName = useCallback(function (value: string) {
        if (value?.match(regexFirstName)) {
            onGetFirstName({
                value: value,
                isTrue: true
            });
        } else {
            onGetFirstName({
                value: value,
                isTrue: false
            });
        }
    }, [regexFirstName]);

    const handleLastName = useCallback(function (value: string) {
        if (value?.match(regexLastName)) {
            onGetLastName({
                value: value,
                isTrue: true
            });
        } else {
            onGetLastName({
                value: value,
                isTrue: false
            });
        }
    }, [regexLastName]);

    const handlePhone = useCallback(function (value: number) {
        console.log(value);
        
        if (value?.toString().match(regexPhone) || value == 0) {
            onGetPhone?.({
                value: value,
                isTrue: true
            });
        } else {
            onGetPhone?.({
                value: value,
                isTrue: false
            });
        }
    }, [regexPhone]);

    const handleAddress = useCallback(function (value: string) {
        if (value?.match(regexAddress)) {
            onGetAddress?.({
                value: value,
                isTrue: true
            });
        } else {
            onGetAddress?.({
                value: value,
                isTrue: false
            });
        }
    }, [regexAddress]);

    const handleNotes = useCallback(function (value: string) {
        onGetNotes(value);
    }, []);




    return <div className="grid grid-cols-2 gap-5 mb-3 p-1">
        <div className="rounded-lg border border-slate-300 p-3">
            {/* Inputes */}
            <div className="grid grid-cols-2 gap-3">
                {/* First name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">الاسم الاول</label>

                    <InputText
                        className="h-10 text-center!"
                        value={firstName}
                        onChange={(e) => handleFirstName(e.target.value)}
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
                            minLength={firstName.length}
                            isGreenFlag={firstName.match(regexFirstName) ? true : false}
                        />
                    </small>
                </div>

                {/* last name */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">الاسم الثاني</label>

                    <InputText
                        className="h-10 text-center!"
                        value={lastName}
                        onChange={(e) => handleLastName(e.target.value)}
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
                            minLength={lastName.length}
                            isGreenFlag={lastName.match(regexLastName) ? true : false}
                        />
                    </small>
                </div>

                {/* phone */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold">رقم الموبايل (اختياري) </label>

                    <InputText
                        type="number"
                        className="h-10 text-center!"
                        value={phone == 0 ? "" : phone as any}
                        onChange={(e) => handlePhone(Number(e.target.value))}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={10}
                            minLength={phone == 0 ? 0 : phone?.toString().length as any}
                            isGreenFlag={phone.toString().match(regexPhone) || phone == 0 ? true : false}
                        />
                    </small>
                </div>

                {/* address */}
                <div className="flex flex-col">
                    <label className="mb-1 font-bold"> العنوان (اختياري) </label>

                    <InputText
                        className="h-10 text-center!"
                        value={address}
                        onChange={(e) => handleAddress(e.target.value)}
                    />

                    <small
                        id="username-help"
                        className="text-[15px] font-bold"
                    >
                        <Max_Min_Length
                            maxLength={30}
                            minLength={address.length}
                            isGreenFlag={address.match(regexAddress) ? true : false}
                        />
                    </small>
                </div>
            </div>

            {/* Textarea */}
            <div>
                <label className="font-bold"> ملاحظات (اختياري)</label>

                <textarea
                    value={notes}
                    className="bg-white w-full p-2 h-12 resize-none border border-gray-300 rounded-lg duration-300 outline-0 focus:border-gray-500"
                    onChange={e => handleNotes(e.target.value)}
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
                    onClick={() => handleTrainerType("man")}
                >
                    <p className="text-2xl font-bold">
                        ذكر
                    </p>

                    <Checkbox checked={trainerType == "man" ? true : false} />
                </div>

                <div className="bg-black h-5 w-0.5"></div>

                {/* Girl */}
                <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => handleTrainerType("woman")}
                >
                    <p className="text-2xl font-bold">
                        انثى
                    </p>

                    <Checkbox checked={trainerType == "woman" ? true : false} />
                </div>
            </div>
        </div>
    </div >
}