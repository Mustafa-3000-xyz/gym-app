import Account_Card from "@/Global-components/Account-card/Account_Card";
import { getAllAccountes } from "@/Rtk/Slices/accountsSlice";
import { store_Type } from "@/Rtk/types"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
// ========================================================== //
export default function Login_Page() {
    const getAllAcountes = useSelector(state => state as store_Type);
    const dispatch = useDispatch();


    useEffect(function () {
        dispatch(getAllAccountes() as any);
    }, []);



    return <section>
        <h1 className=" text-center mb-4 font-bold text-2xl select-none">
            قم بتسجيل الدخول
        </h1>

        <div className="flex justify-center items-center flex-wrap gap-3">
            {
                getAllAcountes.accountes.map(ele => <Account_Card
                    key={ele.id}
                    id={ele.id}
                    name={ele.name}
                    age={ele.age}
                    password={String(ele.password)}
                    type={ele.type}
                />)
            }
        </div>
    </section>
}
