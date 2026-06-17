import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const sessionsCountSlice = createSlice({
    name: "sessionsCountSlice",
    initialState: null as number | null,

    reducers: {
        getAllSessions: function (state) {
            return state;
        },

        addSessions: function (_, action) {
            return action.payload as number | null;
        },

        removeAllSessions: function(){
            return null;
        }
    }
});

export default sessionsCountSlice.reducer;
export const { addSessions, getAllSessions, removeAllSessions } = sessionsCountSlice.actions;