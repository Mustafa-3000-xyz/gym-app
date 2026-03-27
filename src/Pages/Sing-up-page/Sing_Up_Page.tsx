import { useState } from "react";
import Welcome_Message from "./Components/Welcome-message/Welcome_Message";
import Data_Inputs from "./Components/Data-inputs/Data_Inputs";
import End_Message from "./Components/End-message/End_Message";
import { accounte } from "@/Pages/Accountes-page/types";
// ========================================================== //
export default function Sing_Up_Page() {
    const [isWelcomeMessegeFinished, setIsWelcomeMessegeFinished] = useState(false);
    const [isShowEndMessage, setIsShowEndMessage] = useState(false);
    const [managerInfo, setManagerInfo] = useState({});


    return <section className="select-none">
        {
            !isWelcomeMessegeFinished && !isShowEndMessage ?
                <Welcome_Message onIsWelcomeMessegeFinished={setIsWelcomeMessegeFinished} />
                :
                null
        }

        {
            isWelcomeMessegeFinished && !isShowEndMessage ?
                <Data_Inputs
                    onGetManagerInfo={setManagerInfo}
                    onIsShowEndMessage={setIsShowEndMessage}
                />
                :
                null
        }

        {
            isWelcomeMessegeFinished && isShowEndMessage ?
                <End_Message managerInfo={managerInfo as accounte} />
                :
                null
        }
    </section>
}