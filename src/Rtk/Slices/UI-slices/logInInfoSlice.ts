import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const logInInfoSlice = createSlice({
    name: "logInInfoSlice",
    initialState: localStorage.getItem("theAccount") == "null" ? null : localStorage.getItem("theAccount"),

    reducers: {
        changeLogInInfo(_, action) {
            localStorage.setItem("theAccount", JSON.stringify(action.payload))
            return action.payload;
        }
    }
});

export default logInInfoSlice.reducer;
export const { changeLogInInfo } = logInInfoSlice.actions;