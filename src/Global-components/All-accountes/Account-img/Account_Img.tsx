import { Account_Img_Props } from "@/Global-components/types";
import { updatePropertyInAccount } from "@/Rtk/Slices/accountsSlice";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Account_Img(
    {
        idAccount,
        img,
        accountType,
        isShowCamera
    }: Account_Img_Props
) {
    const dispatch = useDispatch();


    const [theImage, setTheImage] = useState(img);
    const inpRef = useRef<HTMLInputElement>(null);


    function clickOnCamera() {
        inpRef.current?.click();
    }


    function selectImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setTheImage(base64);
        };
    }


    useEffect(function () {
        if (theImage != img) {
            dispatch(updatePropertyInAccount({
                id: idAccount,
                column: "img",
                value: theImage
            }) as any);
        }
    }, [theImage]);



    return <div className={`
            w-28 h-28 relative
            border-4 rounded-full
            flex items-center justify-center text-white
            ${accountType == "manager" ? "border-amber-500" : "border-blue-500"}
        `}
    >
        <img
            className={"w-full h-full object-cover rounded-full"}
            src={theImage ? theImage : "account.png"}
            alt="account"
        />

        {
            isShowCamera &&
            <div
                className={`
                    transition duration-300
                    hover:scale-110 active:scale-125
                    absolute bottom-0 start-0 p-2 rounded-full  cursor-pointer
                    ${accountType == "manager" ? "bg-amber-500 text-black" : "bg-blue-500 text-white"}
                `}
                onClick={clickOnCamera}
            >
                <Camera size={18} />
            </div>
        }


        <input
            ref={inpRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={selectImg}
        />
    </div>
}