import { trainer } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updatePropertyInTrainer_Type, updateSomePropertiesInTrainer_Type } from "../types";
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
    async function (data: trainer) {
        const query = `
            INSERT INTO trainers (
                subscriptionState, activeSessionsList, firstName, lastName, 
                phone, address, subscriptionName, sessionsCount, 
                price, subscriptionStart, subscriptionEnd, dateAdded
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.subscriptionState,
            data.activeSessionsList,
            data.firstName,
            data.lastName,
            data.phone,
            data.address,
            data.subscriptionName,
            data.sessionsCount,
            data.price,
            data.subscriptionStart,
            data.subscriptionEnd,
            data.dateAdded
        ];

        const createRow = await database.execute(query, values);

        return {
            trainerId: createRow.lastInsertId,
            ...data
        };
    }
);

export const deleteRowInTrainersTableById = createAsyncThunk(
    "trainersSlice/deleteRowInTrainersTableById",
    async function (id: number | string) {
        const query = "DELETE FROM trainers WHERE trainerId = ?";

        await database.execute(query, [id]);
        return id;
    }
);

export const updatePropertyInRowInTrainersTable = createAsyncThunk(
    "trainersSlice/updatePropertyInRowInTrainersTable",
    async function ({
        trainerId,
        column,
        value
    }: updatePropertyInTrainer_Type) {
        const query = `UPDATE trainers SET ${column} = ? WHERE trainerId = ?`;

        await database.execute(query, [value, trainerId]);

        const getTrainerAfterUpdate = await database.select(
            `SELECT * FROM trainers WHERE trainerId = ?`,
            [trainerId]
        );


        return (getTrainerAfterUpdate as trainer[])[0];
    }
);

export const updateSomePropertiesInRowInTrainersTable = createAsyncThunk(
    "trainersSlice/updateSomePropertiesInRowInTrainersTable",
    async function (
        { trainerId, values }: updateSomePropertiesInTrainer_Type
    ) {
        const keys = Object.keys(values);


        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await database.execute(
            `UPDATE trainers SET ${setClause} WHERE trainerId = ?`,
            [...result, trainerId]
        );

        const updatedTrainer = await database.select(
            `SELECT * FROM trainers WHERE trainerId = ?`,
            [trainerId]
        );

        return (updatedTrainer as trainer[])[0];
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

        builde.addCase(deleteRowInTrainersTableById.fulfilled as any, (state: trainer[], action): any => {
            return state.filter(ele => ele.trainerId != action.payload);
        });

        builde.addCase(updatePropertyInRowInTrainersTable.fulfilled as any, (state: trainer[], action): any => {
            const result = state.filter(ele => ele.trainerId != action.payload.trainerId);
            return [...result, action.payload];
        });

        builde.addCase(updateSomePropertiesInRowInTrainersTable.fulfilled as any, (state: trainer[], action): any => {
            const result = state.filter(ele => ele.trainerId != action.payload.trainerId);
            return [...result, action.payload];
        });
    }
});


export default trainersSlice.reducer;