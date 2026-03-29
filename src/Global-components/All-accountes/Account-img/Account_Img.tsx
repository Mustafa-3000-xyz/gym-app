import isShowAccountDetails_Atom from "@/Atoms/Is/isShowAccountDetails_Atom";
import { Account_Img_Props } from "@/Global-components/types";
import { useSetAtom } from "jotai";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
// ========================================================== //
export default function Account_Img(
    {
        img,
        accountType,
        isShowCamera,
        whenClickOnCameraCloseAccountDetails = true,
        onGetImg
    }: Account_Img_Props
) {
    const setIsShowAccountDetailsAtom = useSetAtom(isShowAccountDetails_Atom);


    const [theImg, setTheImg] = useState<string>(img);
    const inpRef = useRef<HTMLInputElement>(null);



    function clickOnCamera(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        inpRef.current?.click();

        if (whenClickOnCameraCloseAccountDetails) {
            setIsShowAccountDetailsAtom(false);
        }
    }

    function selectImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setTheImg(base64);
        };
    }




    useEffect(function () {
        if (theImg != img) {
            onGetImg?.(theImg);
        }
    }, [theImg]);




    return <div className={`
            w-28 h-28 relative
            border-4 rounded-full
            flex items-center justify-center text-white
            ${accountType == "manager" ? "border-amber-500" : "border-blue-500"}
        `}
    >
        <img
            className={"w-full h-full object-cover rounded-full"}
            src={theImg ? theImg : "account.png"}
            alt="account"
        />

        {
            isShowCamera &&
            <button
                className={`
                    transition duration-300
                    hover:scale-110 active:scale-125
                    absolute bottom-0 start-0 p-2 rounded-full  cursor-pointer
                    ${accountType == "manager" ? "bg-amber-500 text-black" : "bg-blue-500 text-white"}
                `}
                onClick={clickOnCamera}
            >
                <Camera size={18} />
            </button>
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