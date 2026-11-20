import { configureStore } from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/Db-slices/trainersSlice";
import accountsSlice from "../Rtk/Slices/Db-slices/accountsSlice";
import subscriptionsMenuSlice from "./Slices/Db-slices/subscriptionsMenusSlice";
import attendanceSlice from "./Slices/Db-slices/attendanceSlice";
import yearsProfitsAndExpensesSlice from "./Slices/Db-slices/yearsProfitsAndExpensesSlice";
import monthsProfitsAndExpensesSlice from "./Slices/Db-slices/monthsProfitsAndExpensesSlice";
import daysProfitsAndExpensesSlice from "./Slices/Db-slices/daysProfitsAndExpensesSlice";
import itemsSlice from "./Slices/Db-slices/itemsSlice";
import reportsSlice from "./Slices/Db-slices/reportsSlice";
import settingsSlice from "./Slices/Db-slices/settingsSlice";
import logInInfoSlice from "./Slices/UI-slices/logInInfoSlice";
import sideBarSlice from "./Slices/UI-slices/sideBarSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        // Db slices
        trainers: trainersSlice,
        accounts: accountsSlice,
        subscriptionsMenus: subscriptionsMenuSlice,
        attendance: attendanceSlice,
        yearsProfitsAndExpenses: yearsProfitsAndExpensesSlice,
        monthsProfitsAndExpenses: monthsProfitsAndExpensesSlice,
        daysProfitsAndExpenses: daysProfitsAndExpensesSlice,
        items: itemsSlice,
        reports: reportsSlice,
        settings: settingsSlice,

        // Ui slices
        logInInfo: logInInfoSlice,
        sideBar: sideBarSlice 
    },
});

export default store;