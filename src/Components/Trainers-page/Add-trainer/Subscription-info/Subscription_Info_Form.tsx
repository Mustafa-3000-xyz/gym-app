interface Subscription_Info_Form_Props{
    subscriptionName: string,
    sessionsCount: number,
    price: number,
    setSubscriptionName: (x: string)=> void,
    setSessionsCount: (x: number)=> void,
    setPrice: (x: number)=> void,
}


export default function Subscription_Info_Form(
    {
        subscriptionName,
        sessionsCount,
        price,
        setSubscriptionName, 
        setSessionsCount, 
        setPrice
    }: Subscription_Info_Form_Props
) {
    return <form className="px-3 flex justify-center flex-wrap gap-2 mb-5">
        <div>
            <h4>اسم الاشتراك</h4>
            <input
                defaultValue={subscriptionName}
                onChange={(e) => setSubscriptionName(e.target.value)}
                type="text"
                className=" bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0"
            />
        </div>

        <div>
            <h4>عدد الحصص</h4>
            <input
                defaultValue={sessionsCount}
                onChange={(e) => setSessionsCount(Number(e.target.value))}
                type="number"
                className={`
                    bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0
                    appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                `}
            />
        </div>

        <div>
            <h4>السعر</h4>
            <input
                defaultValue={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                className={`
                    bg-slate-100 border border-slate-200 p-2 rounded-lg focus:outline-0
                    appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none"
                `}
            />
        </div>
    </form>
}