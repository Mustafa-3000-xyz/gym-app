import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateAnyPropertyInRowInReportsTable_Type } from "../../types";
import Database from "@tauri-apps/plugin-sql";
import { reports_Type } from "@/Pages/types";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInReportsTable = createAsyncThunk(
    "reportsSlice/getAllRowsInReportsTable",
    async function () {
        return await db.select("SELECT * FROM reports");
    }
);

export const addRowInReportsTable = createAsyncThunk(
    "reportsSlice/addRowInReportsTable",
    async function (data: reports_Type) {
        const query = `
            INSERT INTO reports (
                linkWithPerson, additionTime, title, description, reportedBy 
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.linkWithPerson,
            data.additionTime,
            data.title,
            data.description,
            data.reportedBy
        ];

        const getId = (await db.execute(query, values)).lastInsertId;


        return {
            id: getId,
            ...data
        };
    }
);

export const updateAnyPropertyInRowInReportsTable = createAsyncThunk(
    "reportsSlice/updateSomePropertiesInRowInReportsTable",
    async function (
        { id, values }: updateAnyPropertyInRowInReportsTable_Type
    ) {
        const keys = Object.keys(values);


        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await db.execute(
            `UPDATE reports SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getRowAfterUpdate = await db.select(
            `SELECT * FROM reports WHERE id = ?`,
            [id]
        );

        return (getRowAfterUpdate as reports_Type[])[0];
    }
);

export const deleteRowInReportsTableById = createAsyncThunk(
    "reportsSlice/deleteRowInReportsTableById",
    async function (id: number | string) {

        await db.execute(
            "DELETE FROM reports WHERE id = ?",
            [id]
        );

        return id;
    }
);

export const deleteAllRowsInReportsTable = createAsyncThunk(
    "reportsSlice/deleteAllRowsInReportsTable",
    async function () {
        await db.execute(`DELETE FROM reports;`);
    }
);



const reportsSlice = createSlice({
    name: "reportsSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInReportsTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builde.addCase(addRowInReportsTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(deleteRowInReportsTableById.fulfilled as any, (state: reports_Type[], action): any => {
            return state.filter(ele => ele.id != action.payload);
        });

        builde.addCase(deleteAllRowsInReportsTable.fulfilled as any, (): any => {
            return []
        });

        builde.addCase(updateAnyPropertyInRowInReportsTable.fulfilled as any, (state: reports_Type[], action): any => {
            const filter = state.filter(ele => ele.id != action.payload.id);
            return [...filter, action.payload]
        });
    }
});

export default reportsSlice.reducer;