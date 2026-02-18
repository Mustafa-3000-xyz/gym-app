export default function Not_Found(
    {srcImg, title}: {srcImg: string, title: string}
) {
    return <div className="flex flex-col justify-center items-center select-none">
        <div className="w-96">
            <img
                className="h-full w-full pointer-events-none"
                src={srcImg}
                alt=""
            />
        </div>

        <h3 className=" mt-5 font-bold opacity-40">{title}</h3>
    </div>
}