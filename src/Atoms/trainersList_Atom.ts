import { trainer } from '@/Pages/Trainers-page/types'
import { atom } from 'jotai'
// ========================================================== //
const trainersList_Atom = atom<trainer[]>([]);
export default trainersList_Atom;