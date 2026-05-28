import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const subscriptionEndSlice = createSlice({
    name: "subscriptionEndSlice",
    initialState: null as string | null,

    reducers: {
        getSubscriptionEnd: function (state) {
            return state;
        },

        addSubscriptionEnd: function (_, action) {
            return action.payload as string;
        },

        removeSubscriptionEnd: function(){
            return null;
        }
    }
});

export default subscriptionEndSlice.reducer;
export const { getSubscriptionEnd, addSubscriptionEnd, removeSubscriptionEnd } = subscriptionEndSlice.actions;