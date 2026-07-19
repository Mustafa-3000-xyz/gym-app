import Add_Btn from "@/Global-components/Add-btn/Add_Btn";
import Progress from "@/Global-components/Progress/Progress";
import { Cuboid, Package, PackageOpen } from "lucide-react";
// ========================================================== //
export default function Profits_And_Expenses_Page() {
    return <section className="select-none grid grid-cols-3 gap-10">
        {/* Years */}
        <div>
            {/* Title & icon */}
            <div className="flex itmes-center gap-2 font-bold mb-5">
                <PackageOpen size={33} />

                <h3 className="text-2xl">
                    التقارير السنويه
                </h3>
            </div>

            {/* All Boxes for years */}
            <div className="flex flex-col items-center gap-3 h-[50vh] overflow-y-auto p-5 mb-5">
                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">2026</h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className={`
                        cursor-pointer w-full p-5 rounded-lg bg-slate-100
                    `}
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">2025</h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {2000}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {1000}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1500}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={100}
                            percentage={100}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {1000}$
                    </h3>
                </div>

                <div
                    className={`
                        cursor-pointer w-full p-5 rounded-lg bg-slate-100
                    `}
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">2025</h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {2000}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {1000}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1500}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={100}
                            percentage={100}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {1000}$
                    </h3>
                </div>
            </div>

            <Add_Btn
                title="إضافة سنة جديده"
                className="cursor-pointer py-3"
                onClick={() => null}
            />
        </div>

        {/* Monthes */}
        <div>
            {/* Title & icon */}
            <div className="flex itmes-center gap-2 font-bold mb-5">
                <Package size={33} />

                <h3 className="text-2xl">
                    التقارير الشهريه
                </h3>
            </div>

            {/* All Boxes for monthes */}
            <div className="flex flex-col items-center gap-3 h-[68vh] overflow-y-auto p-5 mb-5">
                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            اكتوبر <span>(2026)</span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            اكتوبر <span>(2026)</span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            اكتوبر <span>(2026)</span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            اكتوبر <span>(2026)</span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>
            </div>

            <Add_Btn
                title="إضافة شهر جديده"
                className="cursor-pointer py-3"
                onClick={() => null}
            />
        </div>

        {/* Days */}
        <div>
            {/* Title & icon */}
            <div className="flex itmes-center gap-2 font-bold mb-5">
                <Cuboid size={33} />

                <h3 className="text-2xl">
                    التقارير اليوميه
                </h3>
            </div>

            {/* All Boxes for days */}
            <div className="flex flex-col items-center gap-3 h-[80vh] overflow-y-auto p-5 mb-5">
                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            <span>26</span>
                            <span>اكتوبر</span>
                            <span> (2026) </span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            <span>26</span>
                            <span>اكتوبر</span>
                            <span> (2026) </span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            <span>26</span>
                            <span>اكتوبر</span>
                            <span> (2026) </span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            <span>26</span>
                            <span>اكتوبر</span>
                            <span> (2026) </span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>

                <div
                    className="w-full p-5 rounded-lg bg-slate-100 drop-shadow-[6px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Title */}
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-bold opacity-30">
                            <span>26</span>
                            <span>اكتوبر</span>
                            <span> (2026) </span>
                        </h3>

                        <h3 className="bg-emerald-100 rounded-full text-[12px] font-bold py-2 px-4">
                            الحالي
                        </h3>
                    </div>

                    {/* Infos */}
                    <div className="mb-10">
                        <ul className=" list-disc ps-4 mb-3">
                            <li className="font-bold text-emerald-500">
                                مجموع الارباح : {900}$
                            </li>

                            <li className="font-bold text-red-500">
                                مجموع المصروفات : {20}$
                            </li>

                            <li className="font-bold text-amber-500">
                                الهدف السنوي : {1000}$
                            </li>
                        </ul>

                        <Progress
                            widthChild={90}
                            percentage={90}
                        />
                    </div>

                    {/* Profits */}
                    <h3 className="font-bold text-2xl">
                        صافي الربح : {978}$
                    </h3>
                </div>
            </div>

            <Add_Btn
                title="إضافة يوم جديده"
                className="cursor-pointer py-3"
                onClick={() => null}
            />
        </div>
    </section>
}