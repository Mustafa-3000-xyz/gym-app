import { trainer } from "@/Pages/types";
import { atom } from 'jotai'
// ========================================================== //
const trainerDetails_Atom = atom<trainer | null>(null);
export default trainerDetails_Atom;