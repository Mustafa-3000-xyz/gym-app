import { dayDetails } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
import { updatePropertyInDaysDetails_Type } from "../../types";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");


export const addRowInDaysDetailsTable = createAsyncThunk(
    "daysDetailsSlice/addRowInDaysDetailsTable",
    async function (data: dayDetails) {
        const query = "INSERT INTO daysDetails (dayId, accountId, trainers) VALUES (?, ?, ?)";
        const values = [
            data.dayId,
            data.accountId,
            JSON.stringify(data.trainers)
        ];
        const createRow = await database.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        }
    }
);

export const deleteRowInDaysDetailsTableById = createAsyncThunk(
    "daysDetailsSlice/removeRowInDaysDetailsTable",
    async function (id: number) {
        const query = "DELETE FROM daysDetails WHERE id = ?";
        const value = [id];

        await database.execute(query, value);

        return id;
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

        await database.execute(query, [column == "trainers" ? JSON.stringify(value) : value, id]);

        const result = await database.select("SELECT * FROM daysDetails WHERE id = ?", [id]);

        return (result as any)[0];
    }
);


const daysDetailsSlice = createSlice({
    name: "daysDetailsSlice",
    initialState: [],
    reducers: {},


    extraReducers: function (builder) {
        builder.addCase(addRowInDaysDetailsTable.fulfilled, function (state, action) {
            return [...state, action.payload] as any;
        });

        builder.addCase(deleteRowInDaysDetailsTableById.fulfilled, function (state: dayDetails[], action) {
            return state.filter(ele => ele.id != action.payload) as any;
        });

        builder.addCase(updatePropertyInRowInDaysDetailsTable.fulfilled, function (state: dayDetails[], action) {
            const removeOldRow = state.filter(ele => ele.id != action.payload.id);
            return [...removeOldRow, action.payload] as any;
        });
    }
});


export default daysDetailsSlice.reducer;