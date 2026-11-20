import { item_Type } from "@/Pages/types";
import { updateAnyPropertyInRowInItemsTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInItemsTableLinkedToDay = createAsyncThunk(
    "itemsSlice/getAllRowsInItemsTableLinkedToDay",
    async function (dayId: number) {
        return await db.select(
            "SELECT * FROM items WHERE linkWithDay = ?",
            [dayId]
        );
    }
);

export const addRowInItemsTable = createAsyncThunk(
    "itemsSlice/addRowInItemsTable",
    async function (data: item_Type) {
        const query = `
            INSERT INTO items (
                linkWithDay, additionTime, category, itemName, price
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.linkWithDay,
            data.additionTime,
            data.category,
            data.itemName,
            data.price,
        ];

        const createRow = await db.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const updateAnyPropertyInRowInItemsTable = createAsyncThunk(
    "itemsSlice/updateAnyPropertyInRowInItemsTable",
    async function ({ id, values }: updateAnyPropertyInRowInItemsTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await db.execute(
            `UPDATE items SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getRowAfterUpdate = await db.select(
            `SELECT * FROM items WHERE id = ?`,
            [id]
        );

        return (getRowAfterUpdate as item_Type[])[0];
    }
);

export const deleteRowInItemsTableById = createAsyncThunk(
    "itemsSlice/deleteRowInItemsTableById",
    async function (id: number) {
        const query = "DELETE FROM items WHERE id = ?";

        await db.execute(query, [id]);
        return id;
    }
);



const itemsSlice = createSlice({
    name: "itemsSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInItemsTableLinkedToDay.fulfilled as any, (_, action) => {
            return action.payload
        });

        builde.addCase(addRowInItemsTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(updateAnyPropertyInRowInItemsTable.fulfilled as any, (state: item_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });

        builde.addCase(deleteRowInItemsTableById.fulfilled as any, (state: item_Type[], action): any => {
            return state.filter(ele => ele.id != action.payload);
        });
    }
});

export default itemsSlice.reducer;