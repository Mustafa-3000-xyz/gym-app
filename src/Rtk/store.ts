import { configureStore } from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/trainersSlice";
import accountsSlice from "../Rtk/Slices/accountsSlice";
import subscriptionsMenuSlice from "./Slices/subscriptionsMenusSlice";
import trainerDetailsSlice from "../Rtk/Slices/trainerDetailsSlice";
import logInInfoSlice from "../Rtk/Slices/logInInfoSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        trainers: trainersSlice,
        accountes: accountsSlice,
        subscriptionsMenu: subscriptionsMenuSlice,
        trainerDetails: trainerDetailsSlice,
        logInInfo: logInInfoSlice
    },
});

export default store;