import All_Accounts from "@/Global-components/All-accountes/All_Accounts"
// ========================================================== //
export default function Login_Page() {
    return <section>
        <h1 className=" text-center mb-10 font-bold text-2xl select-none">
            قم بختيار حساب لتسجيل الدخول
        </h1>

        <div className="flex justify-center items-center flex-wrap gap-3">
            <All_Accounts />
        </div>
    </section>
}
