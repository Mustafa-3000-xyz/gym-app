import { trainer_Type } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updatePropertyInTrainer_Type, updateSomePropertiesInTrainer_Type } from "../../types";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");


export const getAllRowsInTrainersTable = createAsyncThunk(
    "trainersSlice/getAllRowsInTrainersTable",
    async function () {
        return await database.select("SELECT * FROM trainers");
    }
);

export const addRowInTrainersTable = createAsyncThunk(
    "trainersSlice/addRowInTrainersTable",
    async function (data: trainer_Type) {
        const query = `
            INSERT INTO trainers (
                firstName, lastName, phone, address, 
                subscriptionName, sessionsCount, price, 
                subscriptionStart, subscriptionEnd, subscriptionStatus, lastRenewalSubscription
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.firstName,
            data.lastName,
            data.phone,
            data.address,
            data.subscriptionName,
            data.sessionsCount,
            data.price,
            data.subscriptionStart,
            data.subscriptionEnd,
            data.subscriptionStatus,
            data.lastRenewalSubscription
        ];

        const createRow = await database.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const deleteRowInTrainersTableById = createAsyncThunk(
    "trainersSlice/deleteRowInTrainersTableById",
    async function (id: number | string) {
        const query = "DELETE FROM trainers WHERE id = ?";

        await database.execute(query, [id]);
        return id;
    }
);

export const updatePropertyInRowInTrainersTable = createAsyncThunk(
    "trainersSlice/updatePropertyInRowInTrainersTable",
    async function ({
        id,
        column,
        value
    }: updatePropertyInTrainer_Type) {
        const query = `UPDATE trainers SET ${column} = ? WHERE id = ?`;

        await database.execute(query, [value, id]);

        const getTrainerAfterUpdate = await database.select(
            `SELECT * FROM trainers WHERE id = ?`,
            [id]
        );


        return (getTrainerAfterUpdate as trainer_Type[])[0];
    }
);

export const updateSomePropertiesInRowInTrainersTable = createAsyncThunk(
    "trainersSlice/updateSomePropertiesInRowInTrainersTable",
    async function ({ id, values }: updateSomePropertiesInTrainer_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await database.execute(
            `UPDATE trainers SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getTrainerAfterUpdate = await database.select(
            `SELECT * FROM trainers WHERE id = ?`,
            [id]
        );

        return (getTrainerAfterUpdate as trainer_Type[])[0];
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

        builde.addCase(updatePropertyInRowInTrainersTable.fulfilled as any, (state: trainer_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });

        builde.addCase(updateSomePropertiesInRowInTrainersTable.fulfilled as any, (state: trainer_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});


export default trainersSlice.reducer;