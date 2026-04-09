import Discription from "../Description/Discription";
import { Title_And_Discription_For_Pages_Props } from "../types";
// ========================================================== //
export default function Title_And_Discription_For_Pages(
    {title, discription}: Title_And_Discription_For_Pages_Props
) {
    return <div className="select-none mb-7 w-full">
        <h1 className="text-2xl font-bold">
            {title}
        </h1>
        <Discription
            discription={discription}
        />
    </div>
}