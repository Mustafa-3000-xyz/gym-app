import { Account_Img_Props } from "@/Global-components/types";
import { updatePropertyInAccount } from "@/Rtk/Slices/accountsSlice";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Account_Img(
    {
        accountId,
        img,
        accountType,
        isShowCamera,
    }: Account_Img_Props
) {
    const dispatch = useDispatch();
    const inpRef = useRef<HTMLInputElement>(null);



    function clickOnCamera(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        inpRef.current?.click();
    }

    function selectImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;


            dispatch(updatePropertyInAccount({
                id: accountId as any,
                column: "profileImg",
                value: base64
            }) as any);
        };
    }




    return <div className={`
            w-28 h-28 relative
            border-4 rounded-full
            flex items-center justify-center text-white
            ${accountType == "manager" ? "border-(--managerColor)" : "border-(--captainColor)"}
        `}
    >
        <img
            className="w-full h-full object-cover rounded-full"
            src={img ? img : "account.png"}
            alt="account"
        />

        {
            isShowCamera &&
            <button
                className={`
                    transition duration-300
                    hover:scale-110 active:scale-125
                    absolute bottom-0 start-0 p-2 rounded-full  cursor-pointer
                    bg-[#d3d0cb] text-black
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