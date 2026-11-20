import { settings_Type } from "@/Pages/types";
import { updateAnyPropertyInRowInSettingsTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInSettingsTable = createAsyncThunk(
    "settingsSlice/getAllRowsInSettingsTable",
    async function () {
        const getData = await db.select(
            "SELECT * FROM settings",
        ) as any;

        const settingsObject = getData.reduce((key: any, row: any) => {
            key[row.key] = row.value;
            return key;
        }, {} as Record<string, any>);


        return settingsObject;
    }
);

export const updateAnyPropertyInRowInSettingsTable = createAsyncThunk(
    "settingsSlice/updateAnyPropertyInRowInSettingsTable",
    async function (settings: updateAnyPropertyInRowInSettingsTable_Type) {
        const keys = Object.keys(settings) as (keyof settings_Type)[];

        if (keys.length === 0) return {};

        for (const key of keys) {
            const value = settings[key];

            if (value != undefined) {
                const stringValue = String(value);

                const query = `UPDATE settings SET value = ? WHERE key = ?`;
                await db.execute(query, [stringValue, key]);
            }

        }

        return settings;
    }
);



const settingsSlice = createSlice({
    name: "settingsSlice",
    initialState: {},
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInSettingsTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builde.addCase(updateAnyPropertyInRowInSettingsTable.fulfilled as any, (state, action): any => {
            return {
                ...state,
                ... action.payload
            };
        });
    }
});

export default settingsSlice.reducer;