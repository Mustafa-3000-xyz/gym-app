import { configureStore } from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/Db-slices/trainersSlice";
import accountsSlice from "../Rtk/Slices/Db-slices/accountsSlice";
import subscriptionsMenuSlice from "./Slices/Db-slices/subscriptionsMenusSlice";
import attendanceSlice from "./Slices/Db-slices/attendanceSlice";
import yearsProfitsAndExpensesSlice from "./Slices/Db-slices/yearsProfitsAndExpensesSlice";
import monthsProfitsAndExpensesSlice from "./Slices/Db-slices/monthsProfitsAndExpensesSlice";
import daysProfitsAndExpensesSlice from "./Slices/Db-slices/daysProfitsAndExpensesSlice";
import itemsSlice from "./Slices/Db-slices/itemsSlice";
import trainerDetailsSlice from "./Slices/UI-slices/trainerDetailsSlice";
import logInInfoSlice from "./Slices/UI-slices/logInInfoSlice";
import sessionsCountSlice from "./Slices/UI-slices/sessionsCountSlice";
import subscriptionStartSlice from "./Slices/UI-slices/subscriptionStartSlice";
import subscriptionEndSlice from "./Slices/UI-slices/subscriptionEndSlice";
import sideBarSlice from "./Slices/UI-slices/sideBarSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        // Db slices
        trainers: trainersSlice,
        accountes: accountsSlice,
        subscriptionsMenus: subscriptionsMenuSlice,
        attendance: attendanceSlice,
        yearsProfitsAndExpenses: yearsProfitsAndExpensesSlice,
        monthsProfitsAndExpenses: monthsProfitsAndExpensesSlice,
        daysProfitsAndExpenses: daysProfitsAndExpensesSlice,
        items: itemsSlice,

        // Ui slices
        trainerDetails: trainerDetailsSlice,
        logInInfo: logInInfoSlice,
        sessionsCount: sessionsCountSlice,
        subscriptionStart: subscriptionStartSlice,
        subscriptionEnd: subscriptionEndSlice,
        sideBar: sideBarSlice
    },
});

export default store;