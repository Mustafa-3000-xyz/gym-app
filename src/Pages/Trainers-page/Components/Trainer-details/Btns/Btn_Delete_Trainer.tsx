import { Trash } from 'lucide-react'
// ========================================================== //
export default function Btn_Delete_Trainer(
    { onDeleteTrainer }: { onDeleteTrainer: () => void }
) {
    return <button
        onClick={onDeleteTrainer}
        className="flex items-center gap-2 font-bold px-6 py-3 cursor-pointer rounded-lg bg-red-300/40 text-amber-700"
    >
        <span>
            <Trash size={23} />
        </span>

        <span>
            حذف المتدرب
        </span>
    </button>
}