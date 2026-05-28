import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const sessionsCountSlice = createSlice({
    name: "sessionsCountSlice",
    initialState: 0 as number,

    reducers: {
        getAllSessions: function (state) {
            return state;
        },

        addSessions: function (_, action) {
            return action.payload as number;
        },

        removeAllSessions: function(){
            return 0;
        }
    }
});

export default sessionsCountSlice.reducer;
export const { addSessions, getAllSessions, removeAllSessions } = sessionsCountSlice.actions;