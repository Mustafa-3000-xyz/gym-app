import {configureStore} from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/trainersSlice";
import accountsSlice from "../Rtk/Slices/accountsSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        trainers: trainersSlice,
        accountes: accountsSlice
    },
});

export default store;