import { trainer_Type } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateAnyPropertyInRowInTrainersTable_Type } from "../../types";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInTrainersTable = createAsyncThunk(
    "trainersSlice/getAllRowsInTrainersTable",
    async function () {
        return await db.select("SELECT * FROM trainers");
    }
);

export const addRowInTrainersTable = createAsyncThunk(
    "trainersSlice/addRowInTrainersTable",
    async function (data: trainer_Type) {
        const query = `
            INSERT INTO trainers (
                trainerType, firstName, lastName, phone, address, notes,
                subscriptionName, sessionsCount, price, 
                subscriptionStart, subscriptionEnd, subscriptionStatus, debt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.trainerType,
            data.firstName,
            data.lastName,
            data.phone,
            data.address,
            data.notes,
            data.subscriptionName,
            data.sessionsCount,
            data.price,
            data.subscriptionStart,
            data.subscriptionEnd,
            data.subscriptionStatus,
            data.debt
        ];

        const createRow = await db.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const updateAnyPropertyInRowInTrainersTable = createAsyncThunk(
    "trainersSlice/updateAnyPropertyInRowInTrainersTable",
    async function ({ id, values }: updateAnyPropertyInRowInTrainersTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await db.execute(
            `UPDATE trainers SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getTrainerAfterUpdate = await db.select(
            `SELECT * FROM trainers WHERE id = ?`,
            [id]
        );

        return (getTrainerAfterUpdate as trainer_Type[])[0];
    }
);

export const deleteRowInTrainersTableById = createAsyncThunk(
    "trainersSlice/deleteRowInTrainersTableById",
    async function (id: number) {
        const query = "DELETE FROM trainers WHERE id = ?";

        await db.execute(query, [id]);
        return id;
    }
);

export const deleteAllRowsInTrainersTable = createAsyncThunk(
    "trainersSlice/deleteAllRowsInTrainersTable",
    async function () {
        await db.execute(`DELETE FROM trainers;`);
        return [];
    }
);




const trainersSlice = createSlice({
    name: "trainersSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInTrainersTable.fulfilled as any, (_, action) => {
            return action.payload
        });

        builde.addCase(addRowInTrainersTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(deleteRowInTrainersTableById.fulfilled as any, (state: trainer_Type[], action): any => {
            return state.filter(ele => ele.id != action.payload);
        });

        builde.addCase(deleteAllRowsInTrainersTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builde.addCase(updateAnyPropertyInRowInTrainersTable.fulfilled as any, (state: trainer_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});


export default trainersSlice.reducer;