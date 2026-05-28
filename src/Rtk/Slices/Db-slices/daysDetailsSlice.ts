import { dayDetails } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
import { updatePropertyInDaysDetails_Type } from "../../types";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");


export const getAllRowsInDaysDetailsTable = createAsyncThunk(
    "daysDetailsSlice/getAllRowsInDaysDetailsTable",
    async function () {
        return await database.select("SELECT * FROM daysDetails");
    }
)

export const addRowInDaysDetailsTable = createAsyncThunk(
    "daysDetailsSlice/addRowInDaysDetailsTable",
    async function (data: dayDetails) {
        const query = "INSERT INTO daysDetails (dateId, accountId, trainers) VALUES (?, ?, ?)";
        const values = [
            data.dateId,
            data.accountId,
            data.trainers
        ];
        const createRow = await database.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        }
    }
)

export const updatePropertyInRowInDaysDetailsTable = createAsyncThunk(
    "daysDetailsSlice/updatePropertyInRowInDaysDetailsTable",
    async function (
        {
            id,
            column,
            value
        }: updatePropertyInDaysDetails_Type
    ) {
        const query = `UPDATE daysDetails SET ${column} = ? WHERE id = ?`;

        await database.execute(query, [value, id]);

        const result = await database.select("SELECT * FROM daysDetails WHERE id = ?", [id]);

        return (result as any)[0];
    }
)


const daysDetailsSlice = createSlice({
    name: "daysDetailsSlice",
    initialState: [],
    reducers: {},


    extraReducers: function (builder) {
        builder.addCase(getAllRowsInDaysDetailsTable.fulfilled, function (_, action) {
            return action.payload as any;
        });

        builder.addCase(addRowInDaysDetailsTable.fulfilled, function (state, action) {
            return [...state, action.payload] as any;
        });

        builder.addCase(updatePropertyInRowInDaysDetailsTable.fulfilled, function (state: dayDetails[], action) {
            const removeOldRow = state.filter(ele => ele.id != action.payload.id);
            return [...removeOldRow, action.payload] as any;
        });
    }
});


export default daysDetailsSlice.reducer;