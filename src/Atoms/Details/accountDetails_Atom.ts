import { accounte } from "@/Pages/types";
import { atom } from 'jotai'
// ========================================================== //
const accountDetails_Atom = atom<accounte | null>(null);
export default accountDetails_Atom;