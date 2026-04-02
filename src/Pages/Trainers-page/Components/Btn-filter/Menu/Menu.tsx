import Animation from '@/Global-components/Animation/Animation';
import { activeSubscriptions, allSubscriptions, finishedSubscriptions, fromNewToOld, fromOldToNew, pendingSubscriptions, stateIsActive, stateIsFinished, stateIsPending } from '@/Lib/constants';
import { filter, Menu_Props } from "@/Pages/types";
import { store_Type } from '@/Rtk/types';
import { ArrowDown, ArrowUp, ShieldCheck, ShieldOff, ShieldQuestionMark, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// ========================================================== //
export default function Menu(
    {
        btnFilterEle,
        filterObj,
        onIsShowMenu,
        onGetFilterResult
    }: Menu_Props
) {
    const state = useSelector(state => state as store_Type);


    const listRef = useRef<HTMLUListElement>(null);
    const [allSubscriptionActive, setAllSubscriptionActive] = useState(0);
    const [allSubscriptionPending, setAllSubscriptionPending] = useState(0);
    const [allSubscriptionFinished, setAllSubscriptionFinished] = useState(0);



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


    useEffect(function () {
        const result1 = state.trainers.filter(ele => ele.subscriptionState == stateIsActive);
        const result2 = state.trainers.filter(ele => ele.subscriptionState == stateIsPending);
        const result3 = state.trainers.filter(ele => ele.subscriptionState == stateIsFinished);


        setAllSubscriptionActive(result1.length);
        setAllSubscriptionPending(result2.length);
        setAllSubscriptionFinished(result3.length);
    }, [state.trainers]);

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
                    p-3
                    flex gap-1 items-center
                    transition duration-300 font-bold rounded-md mb-2 cursor-pointer 
                    ${filterObj.arrange == fromOldToNew ? "bg-indigo-500 text-white" : "hover:bg-indigo-500 hover:text-white"}
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
                    p-3
                    flex gap-1 items-center
                    transition duration-300 font-bold rounded-md mb-2 cursor-pointer 
                    ${filterObj.arrange == fromNewToOld ? "bg-indigo-500 text-white" : "hover:bg-indigo-500 hover:text-white"}
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
                    p-3
                    flex items-center justify-between
                    transition duration-300 font-bold my-2 rounded-md cursor-pointer
                    ${filterObj.subscriptionType == allSubscriptions ? "bg-indigo-500 text-white" : "hover:bg-indigo-500 hover:text-white"}
                `}
            >
                <div className='  flex gap-1 items-center'>
                    <Users size={23} />

                    <p>
                        كل المتدربين
                    </p>
                </div>

                <p>( {state.trainers.length} )</p>
            </li>

            <li
                onClick={() => clickOnSubscription(activeSubscriptions)}
                className={`
                    p-3
                    flex items-center justify-between
                    transition duration-300 font-bold my-2 rounded-md cursor-pointer
                    ${filterObj.subscriptionType == activeSubscriptions ? "bg-indigo-500 text-white" : "hover:bg-indigo-500 hover:text-white"}
                `}
            >
                <div className='flex gap-1 items-center'>
                    <ShieldCheck size={23} />

                    <p>
                        الاشتراكات المُفعله
                    </p>
                </div>

                <p>( {allSubscriptionActive} )</p>
            </li>

            <li
                onClick={() => clickOnSubscription(pendingSubscriptions)}
                className={`
                    p-3
                    flex items-center justify-between
                    transition duration-300 font-bold my-2 rounded-md cursor-pointer
                    ${filterObj.subscriptionType == pendingSubscriptions ? "bg-indigo-500 text-white" : "hover:bg-indigo-500 hover:text-white"}
                `}
            >
                <div className='flex gap-1 items-center'>
                    <ShieldQuestionMark size={23} />

                    <p>
                        الاشتراكات المُعلقه
                    </p>
                </div>

                <p>( {allSubscriptionPending} )</p>
            </li>

            <li
                onClick={() => clickOnSubscription(finishedSubscriptions)}
                className={`
                    p-3
                    flex items-center justify-between
                    transition duration-300 font-bold my-2 rounded-md cursor-pointer
                    ${filterObj.subscriptionType == finishedSubscriptions ? "bg-indigo-500 text-white" : "hover:bg-indigo-500 hover:text-white"}
                `}
            >
                <div className='flex gap-1 items-center'>
                    <ShieldOff size={23} />

                    <p>
                        الاشتراكات المنتهيه
                    </p>
                </div>

                <p>( {allSubscriptionFinished} )</p>
            </li>
        </ul>
    </Animation>
}