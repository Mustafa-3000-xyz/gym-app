import accountDetails_Atom from "@/Atoms/Details/accountDetails_Atom";
import isShowAccountDetails_Atom from "@/Atoms/Is/isShowAccountDetails_Atom";
import Account_Img from "@/Global-components/All-accountes/Account-img/Account_Img";
import Popup from "@/Global-components/Popup/Popup";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import Permissions from "../Permissions/Permissions";
import { Eye, EyeClosed, KeyRound } from "lucide-react";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { deleteAccountById, updateSomePropertiesInAccount } from "@/Rtk/Slices/accountsSlice";
import { useDispatch } from "react-redux";
import { alert } from "@/Lib/customs";
// ========================================================== //
export default function Account_Details() {
    const dispatch = useDispatch();

    const setIsShowAccountDetailsAtom = useSetAtom(isShowAccountDetails_Atom);
    const [accountDetailsAtom, setAccountDetailsAtom] = useAtom(accountDetails_Atom);
    const isLogInAtom = useAtomValue(isLogin_Atom);


    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isAnyValueChange, setIsAnyValueChange] = useState(false);

    const [name, setName] = useState(accountDetailsAtom?.name);
    const [age, setAge] = useState(Math.trunc(accountDetailsAtom?.age as any));
    const [password, setPassword] = useState(accountDetailsAtom?.password);
    const [img, setImg] = useState(accountDetailsAtom?.img);
    const permissionsList = useState(accountDetailsAtom?.permissions == "fullAccess" ? "fullAccess" : JSON.parse(accountDetailsAtom?.permissions as any))[0];

    const theConditional = isLogInAtom.id != accountDetailsAtom?.id;



    function clickOnSaveBtn() {
        const obj = {
            name,
            age,
            password,
            img,
            permissions: permissionsList
        }


        dispatch(updateSomePropertiesInAccount({
            id: accountDetailsAtom?.id as any,
            accounte: obj as any
        }) as any);

        setIsShowAccountDetailsAtom(false);
        setAccountDetailsAtom(null);
    }

    function deleteAccount() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل حذف ذلك الحساب",
            titleAfterClickOnOk: "تم حذف الحساب بنجاح",
            funRunWhenClickOnOk: function () {
                dispatch(deleteAccountById(accountDetailsAtom?.id as any) as any);
                setIsShowAccountDetailsAtom(false);
                setAccountDetailsAtom(null);
            }
        })
    }

    function clickOnEye() {
        if (isLogInAtom.id != accountDetailsAtom?.id) return;

        if (isShowPassword) {
            setIsShowPassword(false);
        } else {
            setIsShowPassword(true);
        }
    }



    useEffect(function () {
        if (!name || !age || !password || !img) {
            setIsAnyValueChange(false);
            return;
        }



        if (
            (name != accountDetailsAtom?.name)
            ||
            (age != accountDetailsAtom?.age)
            ||
            (password != accountDetailsAtom?.password)
            ||
            (img != accountDetailsAtom?.img)
        ) {
            setIsAnyValueChange(true);
        } else {
            setIsAnyValueChange(false);
        }
    }, [name, age, password, img]);



    return <Popup
        titel="تفاصيل الحساب"
        discription="تلك كل معلومات الخاصه بالحساب"
        typeBtn="save change"
        isSave={isAnyValueChange}
        clickOnSaveBtn={clickOnSaveBtn}
        clickOnCancel={() => setIsShowAccountDetailsAtom(false)}
    >
        {/* Img */}
        <div className=" flex justify-center mb-7">
            <Account_Img
                img={accountDetailsAtom?.img as string}
                accountType={accountDetailsAtom?.type as any}
                isShowCamera={isLogInAtom.id == accountDetailsAtom?.id}
                whenClickOnCameraCloseAccountDetails={false}
                onGetImg={setImg}
            />
        </div>

        <form className="mb-5">
            {/* Name & age */}
            <div className="flex gap-2 justify-center mb-2">
                {/* Name */}
                <div>
                    <h3 className="mb-1 font-bold">الاسم</h3>
                    <input
                        className={`
                            rounded-lg border border-black p-1 px-3 focus:outline-none
                            ${theConditional && "opacity-45 cursor-not-allowed"}
                        `}
                        type="text"
                        value={name}
                        onChange={theConditional ? () => null : (e) => setName(e.target.value)}
                    />
                </div>

                {/* Age */}
                <div>
                    <h3 className="mb-1 font-bold">العمر</h3>
                    <input
                        className={`
                            rounded-lg border border-black p-1 px-3 focus:outline-none
                            ${theConditional && "opacity-45 cursor-not-allowed"}
                        `}
                        type="number"
                        value={age}
                        onChange={theConditional ? () => null : (e) => setAge(+e.target.value)}
                    />
                </div>
            </div>

            {/* Password */}
            <div className="flex gap-2 justify-center">
                <div>
                    <h3 className="mb-1 font-bold">كلمة السر</h3>
                    <div className="relative">
                        <input
                            value={password}
                            dir="ltr"
                            className={`
                                rounded-lg border border-black p-1 px-3 focus:outline-none 
                                ${theConditional && "opacity-45 cursor-not-allowed"}
                            `}
                            type={isShowPassword ? "text" : "password"}
                            onChange={theConditional ? () => null : (e) => setPassword(e.target.value)}
                        />

                        {
                            isShowPassword ?
                                <Eye
                                    className="absolute top-1.5 right-1.5 cursor-pointer"
                                    onClick={clickOnEye}
                                />
                                :
                                <EyeClosed
                                    className={`
                                        absolute top-1.5 right-1.5
                                        ${theConditional ? "opacity-45 cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                    onClick={clickOnEye}
                                />
                        }
                    </div>
                </div>
            </div>
        </form>

        {/* Permissions */}
        <div className="px-3 mb-5">
            <div className="flex gap-1 mb-2">
                <KeyRound
                    strokeWidth={2.5}
                    className="text-amber-500"
                />

                <h3 className="font-bold ">
                    الصلاحيات :
                </h3>
            </div>

            <Permissions
                permissions={permissionsList}
                accountId={accountDetailsAtom?.id as number}
                accountType={accountDetailsAtom?.type}
            />
        </div>

        {/* Delete account for account captain */}
        <div className="flex justify-center items-center">
            {
                accountDetailsAtom?.type != "manager" &&
                <button
                    className="transition duration-300 hover:bg-red-600 bg-red-500 cursor-pointer py-2 w-3/4 text-white rounded-lg font-bold"
                    onClick={deleteAccount}
                >
                    حذف الحساب
                </button>
            }
        </div>
    </Popup>
}