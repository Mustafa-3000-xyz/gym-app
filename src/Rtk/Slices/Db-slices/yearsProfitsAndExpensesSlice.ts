import { yearsProfitsAndExpenses_Type } from "@/Pages/types";
import { updateِAnyPropertyInRowInYearsProfitsAndExpensesTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInYearsProfitsAndExpensesTable = createAsyncThunk(
    "yearsProfitsAndExpensesSlice/getAllRowsInYearsProfitsAndExpensesTable",
    async function () {
        return await db.select("SELECT * FROM yearsProfitsAndExpenses");
    }
);

export const addRowInYearsProfitsAndExpensesTable = createAsyncThunk(
    "yearsProfitsAndExpensesSlice/addRowInYearsProfitsAndExpensesTable",
    async function (data: yearsProfitsAndExpenses_Type) {
        const query = `
            INSERT INTO yearsProfitsAndExpenses (
                yearNumber, profitsTotal, expensesTotal, target
            ) VALUES (?, ?, ?, ?)
        `;

        const values = [
            data.yearNumber,
            data.profitsTotal,
            data.expensesTotal,
            data.target
        ];

        const createRow = await db.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const updateِAnyPropertyInRowInYearsProfitsAndExpensesTable = createAsyncThunk(
    "yearsProfitsAndExpensesSlice/updateِAnyPropertyInRowInYearsProfitsAndExpensesTable",
    async function ({ id, values }: updateِAnyPropertyInRowInYearsProfitsAndExpensesTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await db.execute(
            `UPDATE yearsProfitsAndExpenses SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getYearAfterUpdate = await db.select(
            `SELECT * FROM yearsProfitsAndExpenses WHERE id = ?`,
            [id]
        );

        return (getYearAfterUpdate as yearsProfitsAndExpenses_Type[])[0];
    }
);




const yearsProfitsAndExpensesSlice = createSlice({
    name: "yearsProfitsAndExpensesSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInYearsProfitsAndExpensesTable.fulfilled as any, (_, action) => {
            return action.payload
        });

        builde.addCase(addRowInYearsProfitsAndExpensesTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(updateِAnyPropertyInRowInYearsProfitsAndExpensesTable.fulfilled as any, (state: yearsProfitsAndExpenses_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});

export default yearsProfitsAndExpensesSlice.reducer;