import { configureStore } from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/trainersSlice";
import accountsSlice from "../Rtk/Slices/accountsSlice";
import subscriptionsMenuSlice from "./Slices/subscriptionsMenusSlice";
import daysSlice from "./Slices/daysSlice";
import daysDetailsSlice from "./Slices/daysDetailsSlice";
import trainerDetailsSlice from "../Rtk/Slices/trainerDetailsSlice";
import logInInfoSlice from "../Rtk/Slices/logInInfoSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        trainers: trainersSlice,
        accountes: accountsSlice,
        subscriptionsMenus: subscriptionsMenuSlice,
        days: daysSlice,
        daysDetails: daysDetailsSlice,
        
        trainerDetails: trainerDetailsSlice,
        logInInfo: logInInfoSlice
    },
});

export default store;