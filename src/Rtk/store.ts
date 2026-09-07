import { configureStore } from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/Db-slices/trainersSlice";
import activeSessionsSlice from "../Rtk/Slices/Db-slices/activeSessionsSlice";
import accountsSlice from "../Rtk/Slices/Db-slices/accountsSlice";
import subscriptionsMenuSlice from "./Slices/Db-slices/subscriptionsMenusSlice";
import attendanceSlice from "./Slices/Db-slices/attendanceSlice";
import yearsProfitsAndExpensesSlice from "./Slices/Db-slices/yearsProfitsAndExpensesSlice";
import monthsProfitsAndExpensesSlice from "./Slices/Db-slices/monthsProfitsAndExpensesSlice";
import daysProfitsAndExpensesSlice from "./Slices/Db-slices/daysProfitsAndExpensesSlice";
import itemsSlice from "./Slices/Db-slices/itemsSlice";
import settingsSlice from "./Slices/Db-slices/settingsSlice";

import trainerDetailsSlice from "./Slices/UI-slices/trainerDetailsSlice";
import logInInfoSlice from "./Slices/UI-slices/logInInfoSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        // Db slices
        trainers: trainersSlice,
        activeSessions: activeSessionsSlice,
        accounts: accountsSlice,
        subscriptionsMenus: subscriptionsMenuSlice,
        attendance: attendanceSlice,
        yearsProfitsAndExpenses: yearsProfitsAndExpensesSlice,
        monthsProfitsAndExpenses: monthsProfitsAndExpensesSlice,
        daysProfitsAndExpenses: daysProfitsAndExpensesSlice,
        items: itemsSlice,
        settings: settingsSlice,

        // Ui slices
        trainerDetails: trainerDetailsSlice,
        logInInfo: logInInfoSlice,
    },
});

export default store;