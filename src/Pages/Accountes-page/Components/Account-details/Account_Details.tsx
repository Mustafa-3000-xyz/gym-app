import accountDetails_Atom from "@/Atoms/Details/accountDetails_Atom";
import isShowAccountDetails_Atom from "@/Atoms/Is/isShowAccountDetails_Atom";
import Account_Img from "@/Global-components/All-accountes/Account-img/Account_Img";
import Popup from "@/Global-components/Popup/Popup";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import Permissions from "../Permissions/Permissions";
import isLogin_Atom from "@/Atoms/Is/isLogin_Atom";
import { deleteAccountById, updateSomePropertiesInAccount } from "@/Rtk/Slices/accountsSlice";
import { useDispatch } from "react-redux";
import { alert } from "@/Lib/customs";
import Account_Form from "@/Global-components/Account-form/Account_Form";
// ========================================================== //
export default function Account_Details() {
    const dispatch = useDispatch();

    const setIsShowAccountDetailsAtom = useSetAtom(isShowAccountDetails_Atom);
    const [accountDetailsAtom, setAccountDetailsAtom] = useAtom(accountDetails_Atom);
    const isLogInAtom = useAtomValue(isLogin_Atom);


    const [isAnyValueChange, setIsAnyValueChange] = useState(false);
    const [getName, setGetName] = useState("");
    const [getAge, setGetAge] = useState("");
    const [getPassword, setGetPassword] = useState("");
    const [img, setImg] = useState(accountDetailsAtom?.img);
    const permissionsList = useState(accountDetailsAtom?.permissions == "fullAccess" ? "fullAccess" : JSON.parse(accountDetailsAtom?.permissions as any))[0];



    function clickOnSaveBtn() {
        alert({
            titleBeforeClickOnOk: "هل تريد بالفعل تحديث بيانات الحساب",
            titleAfterClickOnOk: "تم التحديث بنجاح",
            showMessageAfterClickOnOk: true,
            funRunWhenClickOnOk: function () {
                const obj = {
                    name: getName,
                    age: getAge,
                    password: getPassword,
                    img,
                }


                dispatch(updateSomePropertiesInAccount({
                    id: accountDetailsAtom?.id as any,
                    values: obj as any
                }) as any);

                setIsShowAccountDetailsAtom(false);
                setAccountDetailsAtom(null);
            }
        })

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



    useEffect(function () {
        if (!getName || !getAge || !getPassword || !img) {
            setIsAnyValueChange(false);
            return;
        }



        if (
            (getName != accountDetailsAtom?.name)
            ||
            (getAge != accountDetailsAtom?.age)
            ||
            (getPassword != accountDetailsAtom?.password)
            ||
            (img != accountDetailsAtom?.img)
        ) {
            setIsAnyValueChange(true);
        } else {
            setIsAnyValueChange(false);
        }
    }, [getName, getAge, getPassword, img]);




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

        <Account_Form
            name={accountDetailsAtom?.name as string}
            age={Math.trunc(accountDetailsAtom?.age as number)}
            password={accountDetailsAtom?.password as string}
            dontChangeValues={isLogInAtom.id != accountDetailsAtom?.id}
            accountType={accountDetailsAtom?.type as any}
            onGetName={setGetName}
            onGetAge={setGetAge as any}
            onGetPassword={setGetPassword}
        />

        {/* Permissions */}
        <div className="my-5">
            <Permissions
                permissions={permissionsList}
                accountId={accountDetailsAtom?.id as number}
                accountType={accountDetailsAtom?.type}
            />
        </div>

        {/* Delete account for account captain */}
        <div className="flex justify-end items-center">
            {
                accountDetailsAtom?.type == "captain" && isLogInAtom.type == "manager" &&
                <button
                    className="transition duration-300 hover:bg-red-600 bg-red-500 cursor-pointer p-3 text-white rounded-lg font-bold"
                    onClick={deleteAccount}
                >
                    حذف الحساب
                </button>
            }
        </div>
    </Popup>
}