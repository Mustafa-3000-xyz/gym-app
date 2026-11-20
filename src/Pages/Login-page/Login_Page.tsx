import All_Accounts from "@/Global-components/All-accountes/All_Accounts"
// ========================================================== //
export default function Login_Page() {
    return <section className="h-screen flex flex-col justify-center items-center gap-10 mb-10">
        <h1 className="font-bold text-2xl select-none mt-10">
            قم بختيار حساب لتسجيل الدخول
        </h1>

        <All_Accounts />
    </section>
}