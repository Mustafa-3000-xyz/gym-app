import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { subscriptionsMenus_Type } from "@/Pages/types";
import { updateAnyPropertyInRowInSubscriptionsMenusTable_Type } from "../../types";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/getAllRowsInSubscriptionsMenusTable",
    async function () {
        return await db.select("SELECT * FROM subscriptionsMenus");
    }
);

export const addRowInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/addRowInSubscriptionsMenusTable",
    async function (data: subscriptionsMenus_Type) {
        const query = `
            INSERT INTO subscriptionsMenus (
                subscriptionName, sessionsCount, price, isActive
            ) VALUES (?, ?, ?, ?)
        `;



        const values = [
            data.subscriptionName,
            data.sessionsCount,
            data.price,
            data.isActive
        ];

        const createRow = await db.execute(query, values);


        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const updateAnyPropertyInRowInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/updateAnyPropertyInRowInSubscriptionsMenusTable",
    async function ({ id, values }: updateAnyPropertyInRowInSubscriptionsMenusTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const result = keys.map((key) => (values as any)[key]);

        await db.execute(
            `UPDATE subscriptionsMenus SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getMenuAfterUpdate = await db.select(
            `SELECT * FROM subscriptionsMenus WHERE id = ?`,
            [id]
        );

        return (getMenuAfterUpdate as subscriptionsMenus_Type[])[0];
    }
);

export const deleteRowInSubscriptionsMenusTableById = createAsyncThunk(
    "subscriptionsMenusSlice/deleteRowInSubscriptionsMenusTableById",
    async function (id: number | string) {
        const query = "DELETE FROM subscriptionsMenus WHERE id = ?";

        await db.execute(query, [id]);

        return id;
    }
);

export const deleteAllRowsInSubscriptionsMenusTable = createAsyncThunk(
    "subscriptionsMenusSlice/deleteAllRowsInSubscriptionsMenusTable",
    async function () {
        await db.execute(`DELETE FROM subscriptionsMenus;`);
        return [];
    }
);




const subscriptionsMenusSlice = createSlice({
    name: "subscriptionsMenuSlice",
    initialState: [] as subscriptionsMenus_Type[],
    reducers: {},

    extraReducers: function (builder) {
        builder.addCase(getAllRowsInSubscriptionsMenusTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builder.addCase(addRowInSubscriptionsMenusTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builder.addCase(deleteRowInSubscriptionsMenusTableById.fulfilled as any, (state: subscriptionsMenus_Type[], action): any => {
            return state.filter((ele) => ele.id != action.payload);
        });

        builder.addCase(deleteAllRowsInSubscriptionsMenusTable.fulfilled as any, (_, action): any => {
            return action.payload;
        });

        builder.addCase(updateAnyPropertyInRowInSubscriptionsMenusTable.fulfilled as any, (state: subscriptionsMenus_Type[], action): any => {
            const filter = state.filter((ele) => ele.id != action.payload.id);
            return [...filter, action.payload].sort((a, b) => Number(a.id) - Number(b.id));
        });
    }
});

export default subscriptionsMenusSlice.reducer;