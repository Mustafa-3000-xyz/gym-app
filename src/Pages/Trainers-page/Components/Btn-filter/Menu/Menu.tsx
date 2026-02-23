import Animation from '@/Global-components/Animation/Animation';
import { activeSubscriptions, allSubscriptions, finishedSubscriptions, fromNewToOld, fromOldToNew, pendingSubscriptions } from '@/Lib/customs';
import { filter, Menu_Props } from '@/Pages/Trainers-page/types';
import { ArrowDown, ArrowUp, ShieldCheck, ShieldOff, ShieldQuestionMark, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
// ========================================================== //
export default function Menu(
    { btnFilterEle, filterObj, onIsShowMenu, onGetFilterResult }: Menu_Props
) {
    const listRef = useRef<HTMLUListElement>(null);


    function clickOnArrange(type: string) {
        const obj = {
            ...filterObj,
            arrange: type
        } as filter

        onGetFilterResult(obj);
    }


    function clickOnSubscription(type: string) {
        const obj = {
            ...filterObj,
            subscriptionType: type
        } as filter

        onGetFilterResult(obj);
    }


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                !listRef.current?.contains(e.target as any)
                &&
                (btnFilterEle != e.target && !btnFilterEle?.contains(e.target as any))
            ) {
                onIsShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [btnFilterEle, listRef]);


    return <Animation
        className='absolute top-full mt-2'

        initial={{
            y: -30
        }}

        animate={{
            y: 10
        }}
    >
        <ul
            ref={listRef}
            className='bg-slate-100 w-[350px] shadow-2xl p-4 rounded-md select-none'
        >
            <li
                onClick={() => clickOnArrange(fromOldToNew)}
                className={`
                    ${filterObj.arrange == fromOldToNew ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}
                    flex gap-1 items-center
                    transition duration-300 font-bold p-2 pb-3 ps-3 rounded-md mb-2 cursor-pointer 
                `}
            >
                <ArrowDown size={23} className=' mt-1' />

                <p>
                    من اقدم اشتراك الى الاحدث
                </p>
            </li>

            <li
                onClick={() => clickOnArrange(fromNewToOld)}
                className={`
                    ${filterObj.arrange == fromNewToOld ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}
                    flex gap-1 items-center
                    transition duration-300 font-bold p-2 pb-3 ps-3 rounded-md mb-2 cursor-pointer 
                `}
            >
                <ArrowUp size={23} className=' mt-1' />

                <p>
                    من احدث اشتراك الى الاقدم
                </p>
            </li>

            <hr />

            <li
                onClick={() => clickOnSubscription(allSubscriptions)}
                className={`
                    ${filterObj.subscriptionType == allSubscriptions ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}
                    flex gap-1 items-center
                    transition duration-300 font-bold p-2 pb-3 ps-3 my-2 rounded-md cursor-pointer
                `}
            >
                <Users size={23} />

                <p>
                    كل المتدربين
                </p>
            </li>

            <li
                onClick={() => clickOnSubscription(activeSubscriptions)}
                className={`
                    ${filterObj.subscriptionType == activeSubscriptions ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}
                    flex gap-1 items-center
                    transition duration-300 font-bold p-2 pb-3 ps-3 my-2 rounded-md cursor-pointer
                `}
            >
                <ShieldCheck size={23} />

                <p>
                    الاشتراكات المُفعله
                </p>
            </li>

            <li
                onClick={() => clickOnSubscription(pendingSubscriptions)}
                className={`
                    ${filterObj.subscriptionType == pendingSubscriptions ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}
                    flex gap-1 items-center
                    transition duration-300 font-bold p-2 pb-3 ps-3 rounded-md mb-2 cursor-pointer 
                `}
            >
                <ShieldQuestionMark size={23} />

                <p>
                    الاشتراكات المُعلقه
                </p>
            </li>

            <li
                onClick={() => clickOnSubscription(finishedSubscriptions)}
                className={`
                    ${filterObj.subscriptionType == finishedSubscriptions ? "bg-blue-500 text-white" : "hover:bg-blue-500 hover:text-white"}
                    flex gap-1 items-center
                    transition duration-300 font-bold p-2 pb-3 ps-3 rounded-md cursor-pointer 
                `}
            >
                <ShieldOff size={23} />

                <p>
                    الاشتراكات المنتهيه
                </p>
            </li>
        </ul>
    </Animation>
}