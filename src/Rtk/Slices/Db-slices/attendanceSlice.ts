import { attendanceDetails_Type } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
import { updatePropertyInAttendance_Type } from "../../types";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInAttendanceTable = createAsyncThunk(
    "attendanceSlice/getAllRowsInAttendanceTable",
    async function () {
        return await db.select("SELECT * FROM attendance");
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
        const createRow = await db.execute(query, values);

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

        await db.execute(query, value);

        return id;
    }
);

export const deleteAllRowsInAttendanceTable = createAsyncThunk(
    "attendanceSlice/deleteAllRowsInAttendanceTable",
    async function () {
        await db.execute(`DELETE FROM attendance;`);
        return [];
    }
);

export const updatePropertyInRowInAttendanceTable = createAsyncThunk(
    "attendanceSlice/updatePropertyInRowInAttendanceTable",
    async function (
        {
            id,
            column,
            value
        }: updatePropertyInAttendance_Type
    ) {

        await db.execute(`UPDATE attendance SET ${column} = ? WHERE id = ?`, [JSON.stringify(value), id]);

        const getRowAfterUpdate = await db.select("SELECT * FROM attendance WHERE id = ?", [id]);

        return (getRowAfterUpdate as any)[0];
    }
);




const attendanceSlice = createSlice({
    name: "attendanceSlice",
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

        builder.addCase(deleteAllRowsInAttendanceTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builder.addCase(updatePropertyInRowInAttendanceTable.fulfilled, function (state: attendanceDetails_Type[], action) {
            const removeOldRow = state.filter(ele => ele.id != action.payload.id);
            return [...removeOldRow, action.payload] as any;
        });
    }
});


export default attendanceSlice.reducer;