import { configureStore } from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/trainersSlice";
import accountsSlice from "../Rtk/Slices/accountsSlice";
import subscriptionsMenuSlice from "../Rtk/Slices/subscriptionsMenuSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        trainers: trainersSlice,
        accountes: accountsSlice,
        subscriptionsMenu: subscriptionsMenuSlice
    },
});

export default store;