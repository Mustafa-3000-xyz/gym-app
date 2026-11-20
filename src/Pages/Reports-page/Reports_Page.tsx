import Custom_Btn from "@/Global-components/Custom-btn/Custom_Btn";
import Max_Min_Length from "@/Global-components/Max-min-length/Max_Min_Length";
import Not_Found from "@/Global-components/Not-found/Not_Found";
import Popup_Component from "@/Global-components/Popup-component/Popup_Component";
import { styleDate } from "@/Lib/constants";
import { customAlert, normalAlert } from "@/Lib/functions";
import { regexReportDescription, regexReportTitle } from "@/Lib/REGEX";
import { addRowInReportsTable, deleteRowInReportsTableById, getAllRowsInReportsTable } from "@/Rtk/Slices/Db-slices/reportsSlice";
import { store_Type } from "@/Rtk/types";
import { format } from "date-fns";
import { Plus, Trash } from "lucide-react";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// ========================================================== //
export default function Reports_Page() {
    const dispatch = useDispatch();
    const state = useSelector(function (state: store_Type) {
        return {
            logInInfo: state.logInInfo,
            reports: state.reports,
        }
    }, shallowEqual);


    const [isShowCreateNewReport, setIsShowCreateNewReport] = useState(false);
    const [reportTitle, setReportTitle] = useState({
        value: "",
        isTrue: false
    });
    const [reportDescription, setReportDescription] = useState({
        value: "",
        isTrue: false
    });




    function saveData() {
        const errorsMessagesList = [];

        if (!reportTitle.isTrue) {
            errorsMessagesList.push("يجب عنوان البلاغ لا يقل عن ثلاثة احرف ولا يزيد عن اربعين حرف");
        }

        if (!reportDescription.isTrue) {
            errorsMessagesList.push("وصف البلاغ لا يقل عن ثلاثة احرف ولا يزيد عن خمسين حرف");
        }


        if (errorsMessagesList.length > 0) {
            normalAlert({
                title: "يوجد بيانات غير صالحه",
                text: errorsMessagesList.join(" / "),
                icon: "error"
            });
        }
        else {
            customAlert({
                textBeforeSubmitAction: "هل انت متأكد من اضافة ذلك البلاغ ؟",
                textAfterSubmitAction: "تم الإضافه بنجاح",
                runFunctionAfterConfirm() {
                    dispatch(addRowInReportsTable({
                        linkWithPerson: Number(state.logInInfo?.id),
                        additionTime: new Date().toISOString(),
                        title: reportTitle.value,
                        description: reportDescription.value,
                        reportedBy: `حساب رقم ${state.logInInfo?.id}`
                    }) as any);


                    setIsShowCreateNewReport(false);

                    setReportTitle({
                        value: "",
                        isTrue: false
                    });

                    setReportDescription({
                        value: "",
                        isTrue: false
                    });
                },
            })
        }
    }

    function cancel() {
        if (reportTitle.value || reportDescription.value) {
            customAlert({
                textBeforeSubmitAction: "هل تريد بالفعل عدم استكمال البلاغ ؟",
                runFunctionAfterConfirm() {
                    setIsShowCreateNewReport(false);

                    setReportTitle({
                        value: "",
                        isTrue: false
                    });

                    setReportDescription({
                        value: "",
                        isTrue: false
                    });
                },
            })
        }
        else {
            setIsShowCreateNewReport(false);

            setReportTitle({
                value: "",
                isTrue: false
            });

            setReportDescription({
                value: "",
                isTrue: false
            });
        }
    }

    function deleteReport(id: number) {
        customAlert({
            textBeforeSubmitAction: "هل تريد بالفعل حذف هذا البلاغ ؟",
            textAfterSubmitAction: "تم الحذف بنجاح",
            runFunctionAfterConfirm: function () {
                dispatch(deleteRowInReportsTableById(id) as any);
            }
        })
    }



    useEffect(function () {
        if (state.reports.length == 0) {
            dispatch(getAllRowsInReportsTable() as any);
        }
    }, [state.reports]);






    return <section className="mt-10">
        <Custom_Btn
            className="bg-emerald-500! border-emerald-600! flex items-center justify-center py-7 gap-3 font-bold w-full"
            onClick={() => setIsShowCreateNewReport(true)}
        >
            <Plus />

            <span>
                إضافة بلاغ جديد
            </span>
        </Custom_Btn>

        {/* All reports */}
        <div className="flex flex-col gap-4 p-4 mt-5">
            {
                state.reports.length > 0 ?
                    state.reports.map(function (ele) {
                        return <div
                            key={ele.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Title & date */}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 m-0">
                                    {ele.title}
                                </h3>

                                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-mono">
                                    {
                                        format(new Date(ele.additionTime), styleDate)
                                    }
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {ele.description}
                            </p>

                            {/* Footer */}
                            <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3 font-bold">
                                <p>
                                    صاحب البلاغ : {ele.reportedBy}
                                </p>

                                <div>
                                    {
                                        state.logInInfo?.id == ele.linkWithPerson || state.logInInfo?.type == "manager" ?
                                            <Custom_Btn
                                                className="px-2! py-2!"
                                                onClick={() => deleteReport(Number(ele.id))}
                                            >
                                                <Trash size={15} className="font-bold" />
                                            </Custom_Btn>
                                            :
                                            null
                                    }

                                </div>
                            </div>
                        </div>
                    })
                    :
                    <Not_Found
                        srcImg="/not_found_for_boxes.svg"
                        title="لا يوجد اي بلاغات الان"
                    />
            }
        </div>

        {
            isShowCreateNewReport ?
                <Popup_Component
                    title="إضافة بلاغ جديد"
                    classNameForContainer="grid grid-cols-2 gap-5"
                    clickOnSaveBtn={saveData}
                    clickOnCancel={cancel}
                >
                    {/* Report title */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-bold">
                            عنوان البلاع
                        </label>

                        <InputText
                            className="h-10 text-center!"
                            value={reportTitle.value}
                            onChange={(e) => {
                                const value = e.target.value;


                                if (value.match(regexReportTitle)) {
                                    setReportTitle({
                                        value: value,
                                        isTrue: true
                                    })
                                }
                                else {
                                    setReportTitle({
                                        value: value,
                                        isTrue: false
                                    })
                                }
                            }}
                        />

                        <small
                            id="username-help"
                            className="text-[15px] font-bold"
                        >
                            <Max_Min_Length
                                maxLength={40}
                                minLength={reportTitle.value.length}
                                isGreenFlag={reportTitle.value?.match(regexReportTitle) ? true : false}
                            />
                        </small>
                    </div>

                    {/* Report description */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-bold">
                            الوصف
                        </label>

                        <InputText
                            className="h-10 text-center!"
                            value={reportDescription.value}
                            onChange={(e) => {
                                const value = e.target.value;


                                if (value.match(regexReportDescription)) {
                                    setReportDescription({
                                        value: value,
                                        isTrue: true
                                    })
                                }
                                else {
                                    setReportDescription({
                                        value: value,
                                        isTrue: false
                                    })
                                }
                            }}
                        />

                        <small
                            id="username-help"
                            className="text-[15px] font-bold"
                        >
                            <Max_Min_Length
                                maxLength={50}
                                minLength={reportDescription.value.length}
                                isGreenFlag={reportDescription.value?.match(regexReportDescription) ? true : false}
                            />
                        </small>
                    </div>
                </Popup_Component>
                :
                null
        }
    </section>
}