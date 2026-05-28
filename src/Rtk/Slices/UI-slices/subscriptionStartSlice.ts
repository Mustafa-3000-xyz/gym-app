import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const subscriptionStartSlice = createSlice({
    name: "subscriptionStartSlice",
    initialState: null as string | null,

    reducers: {
        getSubscriptionStart: function (state) {
            return state;
        },

        addSubscriptionStart: function (_, action) {
            return action.payload as string;
        },

        removeSubscriptionStart: function(){
            return null;
        }
    }
});

export default subscriptionStartSlice.reducer;
export const { getSubscriptionStart, addSubscriptionStart, removeSubscriptionStart } = subscriptionStartSlice.actions;