import { Account_Img_Props } from "@/Global-components/types";
import { updatePropertyInRowInAccountsTable } from "@/Rtk/Slices/accountsSlice";
import { Camera, ImageOff } from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Account_Img(
    {
        accountId,
        img,
        isChangeTheImg,
        accountType,
    }: Account_Img_Props
) {
    const dispatch = useDispatch();
    const inpRef = useRef<HTMLInputElement>(null);



    function clickOnCamera(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        inpRef.current?.click();
    }

    function clickOnRemoveImg(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        dispatch(updatePropertyInRowInAccountsTable({
            id: accountId as any,
            column: "profileImg",
            value: ""
        }) as any);
    }

    function selectImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;


            dispatch(updatePropertyInRowInAccountsTable({
                id: accountId as any,
                column: "profileImg",
                value: base64
            }) as any);
        };
    }




    return <div className={`
            w-28 h-28 relative
            border-4 rounded-full
            flex items-center justify-center text-white group 
            ${isChangeTheImg ? "cursor-default" : "cursor-not-allowed"}
            ${accountType == "manager" ? "border-(--managerColor)" : "border-(--captainColor)"}
        `}
    >
        <img
            className="w-full h-full object-cover rounded-full"
            src={img ? img : "/account.png"}
            alt="account"
        />

        {
            isChangeTheImg ?
                <button
                    className={`
                        duration-500
                        bottom-0 start-0 -translate-x-5 opacity-0
                        group-hover:translate-x-14 group-hover:-translate-y-9 group-hover:opacity-100
                        hover:scale-110 active:scale-125
                        absolute -z-10 p-2 rounded-full  cursor-pointer
                        bg-[#d3d0cb] text-black
                    `}
                    onClick={clickOnCamera}
                >
                    <Camera size={30} />
                </button>
                :
                null
        }


        {
            isChangeTheImg && img != ""?
                <button
                    className={`
                        duration-500
                        bottom-0 start-0 -translate-x-5  opacity-0
                        group-hover:translate-x-14 group-hover:translate-y-5 group-hover:opacity-100
                        hover:scale-110 active:scale-125
                        absolute -z-10 p-2 rounded-full  cursor-pointer
                        bg-red-500 text-white
                    `}
                    onClick={clickOnRemoveImg}
                >
                    <ImageOff size={30} />
                </button>
                :
                null
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