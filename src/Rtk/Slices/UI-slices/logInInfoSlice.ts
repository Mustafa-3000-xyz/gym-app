import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const logInInfoSlice = createSlice({
    name: "logInInfoSlice",
    initialState: localStorage.getItem("theAccount"),

    reducers: {
        getLogInInfo: function (state) {
            if (typeof (state) == "string") {
                return JSON.parse(state as any);
            }
            else{
                return state;
            }
        },

        changeLogInInfo(_, action) {
            localStorage.setItem("theAccount", JSON.stringify(action.payload))
            return action.payload;
        }
    }
});

export default logInInfoSlice.reducer;
export const { getLogInInfo, changeLogInInfo } = logInInfoSlice.actions;