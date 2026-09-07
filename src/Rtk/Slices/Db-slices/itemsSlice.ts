import { item_Type } from "@/Pages/types";
import { updateSomePropertiesInRowInItemsTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:gym-app.db");



export const getAllRowsInItemsTableLinkedToDay = createAsyncThunk(
    "itemsSlice/getAllRowsInItemsTableLinkedToDay",
    async function (dayId: number) {
        return await database.select(
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
                linkWithDay, itemName, category, price
            ) VALUES (?, ?, ?, ?)
        `;

        const values = [
            data.linkWithDay,
            data.itemName,
            data.category,
            data.price,
        ];

        const createRow = await database.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const deleteRowInItemsTableById = createAsyncThunk(
    "itemsSlice/deleteRowInItemsTableById",
    async function (itemId: number) {
        const query = "DELETE FROM items WHERE id = ?";

        await database.execute(query, [itemId]);
        return itemId;
    }
);

export const updateSomePropertiesInRowInItemsTable = createAsyncThunk(
    "itemsSlice/updateSomePropertiesInRowInItemsTable",
    async function ({ id, values }: updateSomePropertiesInRowInItemsTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await database.execute(
            `UPDATE items SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getItmeAfterUpdate = await database.select(
            `SELECT * FROM items WHERE id = ?`,
            [id]
        );

        return (getItmeAfterUpdate as item_Type[])[0];
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

        builde.addCase(deleteRowInItemsTableById.fulfilled as any, (state: item_Type[], action): any => {
            return state.filter(ele => ele.id != action.payload);
        });

        builde.addCase(updateSomePropertiesInRowInItemsTable.fulfilled as any, (state: item_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});

export default itemsSlice.reducer;