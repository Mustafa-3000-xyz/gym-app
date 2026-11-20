import { createSlice } from "@reduxjs/toolkit";
// ======================================= //
const sideBarSlice = createSlice({
    name: "sideBarSlice",
    initialState: "show",

    reducers: {
        changeStatusTheShowForSideBar: function (_, action) {
            return action.payload as "show" | "hidden";
        }
    }
});

export default sideBarSlice.reducer;
export const { changeStatusTheShowForSideBar } = sideBarSlice.actions;