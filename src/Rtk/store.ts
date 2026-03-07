import {configureStore} from "@reduxjs/toolkit";
import trainersSlice from "../Rtk/Slices/trainersSlice";
// ======================================= //
const store = configureStore({
    reducer: {
        trainers: trainersSlice
    },
});

export default store;