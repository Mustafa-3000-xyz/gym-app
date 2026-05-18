import { day } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");


export const getAllRowsInDaysTable = createAsyncThunk(
    "daysSlice/getAllRowsInDaysTable",
    async function () {
        return await database.select("SELECT * FROM days");
    }
)

export const addRowInDaysTable = createAsyncThunk(
    "daysSlice/addRowInDaysTable",
    async function (data: day) {
        const query = "INSERT INTO days (date) VALUES (?)";
        const value = [data.date];

        const createRow = await database.execute(query, value);

        return {
            id: createRow.lastInsertId,
            ...data
        }
    }
)

export const deleteRowInDaysTableById = createAsyncThunk(
    "daysSlice/deleteRowInDaysTableById",
    async function (id: number) {
        const query = "DELETE FROM days WHERE id = ?";
        const value = [id];

        await database.execute(query, value);

        return id;
    }
)


const daysSlice = createSlice({
    name: "daysSlice",
    initialState: [],
    reducers: {},


    extraReducers: function (builder) {
        builder.addCase(getAllRowsInDaysTable.fulfilled, function (_, action) {
            return action.payload as any;
        });

        builder.addCase(addRowInDaysTable.fulfilled, function (state, action) {
            return [...state, action.payload] as any;
        });

        builder.addCase(deleteRowInDaysTableById.fulfilled, function (state: day[], action) {
            return state.filter(ele => ele.id != action.payload) as any;
        });
    }
});


export default daysSlice.reducer;