import { configureStore } from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/Db-slices/trainersSlice";
import accountsSlice from "../Rtk/Slices/Db-slices/accountsSlice";
import subscriptionsMenuSlice from "./Slices/Db-slices/subscriptionsMenusSlice";
import daysSlice from "./Slices/Db-slices/daysSlice";
import daysDetailsSlice from "./Slices/Db-slices/daysDetailsSlice";
import trainerDetailsSlice from "./Slices/UI-slices/trainerDetailsSlice";
import logInInfoSlice from "./Slices/UI-slices/logInInfoSlice";
import sessionsCountSlice from "./Slices/UI-slices/sessionsCountSlice";
import subscriptionStartSlice from "./Slices/UI-slices/subscriptionStartSlice";
import subscriptionEndSlice from "./Slices/UI-slices/subscriptionEndSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        // Db slices
        trainers: trainersSlice,
        accountes: accountsSlice,
        subscriptionsMenus: subscriptionsMenuSlice,
        days: daysSlice,
        daysDetails: daysDetailsSlice,

        // Ui slices
        trainerDetails: trainerDetailsSlice,
        logInInfo: logInInfoSlice,
        sessionsCount: sessionsCountSlice,
        subscriptionStart: subscriptionStartSlice,
        subscriptionEnd: subscriptionEndSlice
    },
});

export default store;