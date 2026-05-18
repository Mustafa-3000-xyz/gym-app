import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { subscriptionsMenus } from "@/Pages/types";
import { updatePropertyInSubscriptionsMenu_Type, updateSomePropertiesInSubscriptionsMenu_Type } from "../types";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");


export const getAllRowsInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/getAllRowsInSubscriptionsMenusTable",
    async function () {
        return await database.select("SELECT * FROM subscriptionsMenus");
    }
);

export const addRowInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/addRowInSubscriptionsMenusTable",
    async function (data: subscriptionsMenus) {
        const query = `
            INSERT INTO subscriptionsMenus (
                subscriptionName, sessionsCount, trainersTotal, price, isActive
            ) VALUES (?, ?, ?, ?, ?)
        `;



        const values = [
            data.subscriptionName,
            data.sessionsCount,
            data.trainersTotal,
            data.price,
            data.isActive
        ];

        const createRow = await database.execute(query, values);


        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const deleteRowInSubscriptionsMenusTableById = createAsyncThunk(
    "subscriptionsMenusSlice/deleteRowInSubscriptionsMenusTableById",
    async function (id: number | string) {
        const query = "DELETE FROM subscriptionsMenus WHERE id = ?";

        await database.execute(query, [id]);

        return id;
    }
);

export const updatePropertyInRowInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/updatePropertyInRowInSubscriptionsMenusTable",
    async function (
        {
            id,
            column,
            value
        }: updatePropertyInSubscriptionsMenu_Type
    ) {
        const query = `UPDATE subscriptionsMenus SET ${column} = ? WHERE id = ?`;

        await database.execute(query, [value, id]);

        const result = await database.select(
            `SELECT * FROM subscriptionsMenus WHERE id = ?`,
            [id]
        );

        return (result as subscriptionsMenus[])[0];
    }
);

export const updateSomePropertiesInRowInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/updateSomePropertiesInRowInSubscriptionsMenusTable",
    async function ({ id, values }: updateSomePropertiesInSubscriptionsMenu_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const result = keys.map((key) => (values as any)[key]);

        await database.execute(
            `UPDATE subscriptionsMenus SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const updatedSubscription = await database.select(
            `SELECT * FROM subscriptionsMenus WHERE id = ?`,
            [id]
        );

        return (updatedSubscription as subscriptionsMenus[])[0];
    }
);


const subscriptionsMenusSlice = createSlice({
    name: "subscriptionsMenuSlice",
    initialState: [] as subscriptionsMenus[],
    reducers: {},

    extraReducers: function (builder) {
        builder.addCase(getAllRowsInSubscriptionsMenusTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builder.addCase(addRowInSubscriptionsMenusTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builder.addCase(deleteRowInSubscriptionsMenusTableById.fulfilled as any, (state: subscriptionsMenus[], action): any => {
            return state.filter((ele) => ele.id != action.payload);
        });

        builder.addCase(updatePropertyInRowInSubscriptionsMenusTable.fulfilled as any, (state: subscriptionsMenus[], action): any => {
            const filter = state.filter((ele) => ele.id != action.payload.id);
            return [...filter, action.payload].sort((a, b) => Number(a.id) - Number(b.id));
        });

        builder.addCase(updateSomePropertiesInRowInSubscriptionsMenusTable.fulfilled as any, (state: subscriptionsMenus[], action): any => {
            const filter = state.filter((ele) => ele.id != action.payload.id);
            return [...filter, action.payload].sort((a, b) => Number(a.id) - Number(b.id));
        });
    }
});

export default subscriptionsMenusSlice.reducer;