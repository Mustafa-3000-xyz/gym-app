import { trainer } from '@/Pages/Trainers-page/types'
import { atom } from 'jotai'
// ========================================================== //
const trainerDetails_Atom = atom<trainer | null>(null);
export default trainerDetails_Atom;