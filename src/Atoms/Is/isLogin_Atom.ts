import { atom } from 'jotai';
// ========================================================== //
const isLogin_Atom = atom<any>(
    JSON.parse(localStorage.getItem("theAccount") as any)
);
export default isLogin_Atom;