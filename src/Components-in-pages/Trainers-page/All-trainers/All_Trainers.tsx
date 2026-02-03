import { All_Trainers_Props, trainer } from "@/Pages/Trainers-page/trainersTypes";
import { getTrainerById } from "@/db/trainerDb";
import { useEffect, useState } from "react";
// ========================================================== //
export default function All_Trainers(
    {
        trainersList,
        setGetTrainerDetails,
        setIsShowTrainerDetails,
    }: All_Trainers_Props
) {
    const [allPrice, setAllPrice] = useState(0);


    async function showDetailsTrainer(id: number) {
        const trainerInof = await getTrainerById(id);

        setIsShowTrainerDetails(true);
        setGetTrainerDetails(trainerInof as trainer);
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
                <td className="p-2 py-4 rounded-tl-2xl">الحاله</td>
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
                    <td className="p-2 py-4">{ele.subscriptionStart}</td>
                    <td className="p-2 py-4">{ele.subscriptionEnd}</td>
                    <td className="p-2 py-4">
                        <span className={`
                                    ${ele.isSubscriptionActive ?
                                "bg-emerald-100 text-emerald-500"
                                :
                                "bg-yellow-100 text-yellow-500"
                            }
                                    p-1 px-2 rounded-full
                                `}
                        >
                            {
                                ele.isSubscriptionActive ?
                                    "مفعل"
                                    :
                                    "معلق"
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