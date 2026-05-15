import { trainer } from "@/Pages/types";
import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const trainerDetailsSlice = createSlice({
    name: "trainerDetailsSlice",
    initialState: null as trainer | null,

    reducers: {
        addTrainerDetails: function (_, action) {
            return action.payload as trainer;
        },

        getTrainerDetails: function (state) {
            return state;
        },

        removeTrainerDetails: function () {
            return null;
        }
    }
});

export default trainerDetailsSlice.reducer;
export const { addTrainerDetails, getTrainerDetails, removeTrainerDetails } = trainerDetailsSlice.actions;