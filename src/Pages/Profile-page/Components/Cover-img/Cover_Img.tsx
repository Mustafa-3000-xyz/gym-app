import { Cover_Img_Props } from "@/Pages/types";
import { updatePropertyInRowInAccountsTable } from "@/Rtk/Slices/Db-slices/accountsSlice";
import { Trash } from "lucide-react";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
// ========================================================== //
export default function Cover_Img(
    {
        accountId,
        coverImgSrc,
        isChangeCoverImg
    }: Cover_Img_Props
) {
    const dispatch = useDispatch();
    const inpRef = useRef<HTMLInputElement | null>(null);




    function clickOnCover() {
        if (!isChangeCoverImg) return;
        inpRef.current?.click()
    }

    function selectCoverImg(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;

            dispatch(updatePropertyInRowInAccountsTable({
                id: accountId as any,
                column: "coverImg",
                value: base64
            }) as any);
        };
    }

    function clickOnRemoveCoverImgBtn(e: React.ChangeEvent<HTMLButtonElement>) {
        e.stopPropagation();

        dispatch(updatePropertyInRowInAccountsTable({
            id: accountId as any,
            column: "coverImg",
            value: ""
        }) as any);
    }




    return <div
        className={`
            transition duration-300
            w-full h-96 relative group 
            ${isChangeCoverImg ? "opacity-100 hover:opacity-80 cursor-pointer" : "cursor-not-allowed"}
        `}
        onClick={clickOnCover}
    >
        <img
            className="rounded-lg w-full h-full object-cover"
            src={coverImgSrc ? coverImgSrc : "/background_for_account.jpg"}
            alt="background_for_account"
        />

        {
            isChangeCoverImg && coverImgSrc != "" ?
                <button
                    className={`
                        transition duration-300
                        absolute top-0 end-0 m-3 bg-red-500 p-2 rounded-lg text-white
                        opacity-0 group-hover:opacity-100 cursor-cell
                    `}
                    onClick={clickOnRemoveCoverImgBtn as any}
                >
                    <Trash size={15} />
                </button>
                :
                null
        }


        <input
            ref={inpRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => selectCoverImg(e)}
        />
    </div>
}