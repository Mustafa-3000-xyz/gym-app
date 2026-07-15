import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// ======================================= //
const sideBarSlice = createSlice({
    name: "sideBarSlice",
    initialState: "show",

    reducers: {
        hiddenOrShowSideBar: function (_, action: PayloadAction<"hidden" | "show">) {
            return action.payload;
        },
    }
});

export default sideBarSlice.reducer;
export const { hiddenOrShowSideBar } = sideBarSlice.actions;