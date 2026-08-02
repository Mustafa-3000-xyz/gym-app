import { attendanceDetails_Type } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
import { updatePropertyInAttendance_Type } from "../../types";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");



export const getAllRowsInAttendanceTable = createAsyncThunk(
    "attendanceSlice/getAllRowsInAttendanceTable",
    async function () {
        return await database.select("SELECT * FROM attendance");
    }
);

export const addRowInAttendanceTable = createAsyncThunk(
    " attendanceSlice/addRowInAttendanceTable",
    async function (data: attendanceDetails_Type) {
        const query = "INSERT INTO attendance (date, accountId, trainers) VALUES (?, ?, ?)";
        const values = [
            data.date,
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

export const deleteRowInAttendanceTableById = createAsyncThunk(
    "attendanceSlice/deleteRowInAttendanceTableById",
    async function (id: number) {
        const query = "DELETE FROM attendance WHERE id = ?";
        const value = [id];

        await database.execute(query, value);

        return id;
    }
)

export const updatePropertyInRowInAttendanceTable = createAsyncThunk(
    "attendanceSlice/updatePropertyInRowInAttendanceTable",
    async function (
        {
            id,
            column,
            value
        }: updatePropertyInAttendance_Type
    ) {
        const query = `UPDATE attendance SET ${column} = ? WHERE id = ?`;
        const theValue = column == "trainers" ? JSON.stringify(value) : value;

        await database.execute(query, [theValue, id]);

        const getDayAfterUpdate = await database.select("SELECT * FROM attendance WHERE id = ?", [id]);

        return (getDayAfterUpdate as any)[0];
    }
);


const attendanceSlice = createSlice({
    name: " attendanceSlice",
    initialState: [],
    reducers: {},


    extraReducers: function (builder) {
        builder.addCase(getAllRowsInAttendanceTable.fulfilled, function (_, action) {
            return action.payload as any;
        });

        builder.addCase(addRowInAttendanceTable.fulfilled, function (state, action) {
            return [...state, action.payload] as any;
        });

        builder.addCase(deleteRowInAttendanceTableById.fulfilled, function (state: attendanceDetails_Type[], action) {
            return state.filter(ele => ele.id != action.payload) as any;
        });

        builder.addCase(updatePropertyInRowInAttendanceTable.fulfilled, function (state: attendanceDetails_Type[], action) {
            const removeOldRow = state.filter(ele => ele.id != action.payload.id);
            return [...removeOldRow, action.payload] as any;
        });
    }
});


export default attendanceSlice.reducer;