export default function Btn_Cancel(
    {onCloseThisWinow}: {onCloseThisWinow: ()=> void}
) {
    return <button
        onClick={onCloseThisWinow}
        className={`
            transition duration-300 hover:bg-red-600 py-2
            bg-red-500 text-white px-5 cursor-pointer rounded-lg
        `}
    >
        إلغاء
    </button>
}