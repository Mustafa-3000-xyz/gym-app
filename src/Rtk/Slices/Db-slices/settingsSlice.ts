import { settings_Type } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:gym-app.db");



export const getAllRowsInSettingsTable = createAsyncThunk(
    "settingsSlice/getAllRowsInSettingsTable",
    async function () {
        const getData = await database.select(
            "SELECT * FROM settings",
        ) as any;

        const settingsObject = getData.reduce((key: any, row: any) => {
            key[row.key] = row.value;
            return key;
        }, {} as Record<string, any>);


        return settingsObject;
    }
);

export const updateSomePropertiesInRowInSettingsTable = createAsyncThunk(
    "settingsSlice/updateSomePropertiesInRowInSettingsTable",
    async function (settings: settings_Type) {
        const keys = Object.keys(settings) as (keyof settings_Type)[];

        if (keys.length === 0) return {};

        for (const key of keys) {
            const value = settings[key];

            if (value != undefined) {
                const stringValue = String(value);

                const query = `UPDATE settings SET value = ? WHERE key = ?`;
                await database.execute(query, [stringValue, key]);
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

        builde.addCase(updateSomePropertiesInRowInSettingsTable.fulfilled as any, (_, action): any => {
            return action.payload;
        });
    }
});

export default settingsSlice.reducer;