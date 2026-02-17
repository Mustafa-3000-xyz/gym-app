import trainerDetails_Atom from "@/Atoms/trainerDetails_Atom";
import { All_Trainers_Props } from "@/Pages/Trainers-page/trainersTypes";
import { getTrainerById } from "@/Db/trainerDb";
import { stateIsActive, stateIsFinished, stateIsPending, styleDate } from "@/Lib/customs";
import { format } from "date-fns";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
// ========================================================== //
export default function All_Trainers(
    {
        trainersList,
        setIsShowTrainerDetails,
    }: All_Trainers_Props
) {
    const [allPrice, setAllPrice] = useState(0);
    const setTrainerDetailsAtom = useAtom(trainerDetails_Atom)[1];


    async function showDetailsTrainer(id: number) {
        const trainerInof = await getTrainerById(id);

        setIsShowTrainerDetails(true);
        setTrainerDetailsAtom(trainerInof);
    }


    useEffect(function () {
        const totalPrice = trainersList.reduce((sum, ele) => sum += ele.price, 0);
        setAllPrice(totalPrice);
    }, [trainersList]);



    return <table className="w-full mt-10 border-separate select-none">
        <thead>
            <tr className="bg-black/5 text-center">
                <td className="rounded-tr-2xl">ID</td>
                <td className="p-2 py-4">المتدرب</td>
                <td className="p-2 py-4">الاشتراك</td>
                <td className="p-2 py-4">بداية الاشتراك</td>
                <td className="p-2 py-4">نهاية الاشتراك</td>
                <td className="p-2 py-4 rounded-tl-2xl">حالة الاشتراك</td>
            </tr>
        </thead>

        <tbody>
            {
                trainersList.map(ele => <tr
                    key={ele.trainerId}
                    onClick={() => showDetailsTrainer(ele.trainerId)}
                    className="text-center bg-slate-100 cursor-pointer transition duration-100 hover:bg-[var(--primary)] hover:text-white"
                >
                    <td>{ele.trainerId}</td>
                    <td className="p-2 py-4">{ele.firstName} {ele.lastName}</td>
                    <td className="p-2 py-4">{ele.subscriptionName}</td>
                    <td className="p-2 py-4">
                        {format(ele.subscriptionStart, styleDate)}
                    </td>
                    <td className="p-2 py-4">
                        {format(ele.subscriptionEnd, styleDate)}
                    </td>
                    <td className="p-2 py-4">
                        <span className={`
                            px-3 py-1 rounded-full font-bold
                            ${ele.subscriptionState == stateIsActive ?
                                "bg-emerald-100 text-emerald-500"
                                : ele.subscriptionState == stateIsPending ?
                                    "bg-amber-100 text-amber-500"
                                    : ele.subscriptionState == stateIsFinished && "bg-red-100 text-red-500"
                            }
                        `}
                        >
                            {ele.subscriptionState == stateIsActive ?
                                "مفعل"
                                : ele.subscriptionState == stateIsPending ?
                                    "معلق"
                                    : ele.subscriptionState == stateIsFinished && "منتهي"
                            }
                        </span>
                    </td>
                </tr>)
            }
        </tbody>

        <tfoot>
            <tr>
                <td className="p-4 bg-black/5 rounded-b-2xl text-center" colSpan={7}>
                    <span>مجموع ارباح الاشتراكات الحاليه : </span>
                    <span className=" text-emerald-600">
                        {allPrice}$
                    </span>
                </td>
            </tr>
        </tfoot>
    </table>
}