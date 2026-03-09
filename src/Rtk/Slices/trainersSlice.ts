import { trainer } from "@/Pages/Trainers-page/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updatePropertyInTrainer_Type, updateSomePropertiesInTrainer_Type } from "../types";
import { trainerTable } from "@/Rtk/tables";
// ======================================= //
export const getAllTrainers = createAsyncThunk("trainersSlice/getAllTrainers", async function () {
    const database = await trainerTable();
    return await database.select("SELECT * FROM trainers");
});

export const addTrainer = createAsyncThunk("trainersSlice/addTrainer", async function (data: trainer) {
    const database = await trainerTable();
    const query = `INSERT INTO trainers (
        trainerId, subscriptionState, activeSessionsList, firstName, lastName, 
        phone, address, subscriptionName, sessionsCount, 
        price, subscriptionStart, subscriptionEnd, dateAdded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.trainerId,
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

    await database.execute(query, values);
    return data;
});

export const deleteTrainerById = createAsyncThunk(
    "trainersSlice/deleteTrainerById",
    async function (id: number | string) {
        const database = await trainerTable();

        await database.execute(
            "DELETE FROM trainers WHERE trainerId = ?",
            [id]
        );

        return id;
});

export const updatePropertyInTrainer = createAsyncThunk(
    "trainersSlice/updatePropertyInTrainer",
    async function ({
        trainerId,
        column,
        value
    }: updatePropertyInTrainer_Type) {
        const database = await trainerTable();

        await database.execute(
            `UPDATE trainers SET ${column} = ? WHERE trainerId = ?`,
            [value, trainerId]
        );

        const result = await database.select(
            `SELECT * FROM trainers WHERE trainerId = ?`,
            [trainerId]
        );


        return (result as trainer[])[0];
});

export const updateSomePropertiesInTrainer = createAsyncThunk(
    "trainersSlice/updateSomePropertiesInTrainer",
    async function (
        { trainerId, trainer }: updateSomePropertiesInTrainer_Type
    ) {
        const database = await trainerTable();
        const keys = Object.keys(trainer);


        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const values = keys.map(key => (trainer as any)[key]);

        await database.execute(
            `UPDATE trainers SET ${setClause} WHERE trainerId = ?`,
            [...values, trainerId]
        );

        return trainer;
});



const trainersSlice = createSlice({
    name: "trainersSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllTrainers.fulfilled as any, (_, action) => {
            return action.payload
        });

        builde.addCase(addTrainer.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(deleteTrainerById.fulfilled as any, (state: trainer[], action): any => {
            const result = state.filter(ele => ele.trainerId != action.payload);
            return result;
        });

        builde.addCase(updatePropertyInTrainer.fulfilled as any, (state: trainer[], action): any => {
            const result = state.filter(ele => ele.trainerId != action.payload.trainerId);
            return [...result, action.payload];
        });

        builde.addCase(updateSomePropertiesInTrainer.fulfilled as any, (state: trainer[], action): any => {
            const result = state.filter(ele => ele.trainerId != action.payload.trainerId);
            return [...result, action.payload];
        });
    }
});


export default trainersSlice.reducer;