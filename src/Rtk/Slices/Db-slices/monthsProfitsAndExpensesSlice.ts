import { monthsProfitsAndExpenses_Type } from "@/Pages/types";
import { updateAnyPropertyInRowInMonthsProfitsAndExpensesTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable = createAsyncThunk(
    "monthsProfitsAndExpensesSlice/getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable",
    async function (yearId: number) {
        return await db.select(
            "SELECT * FROM monthsProfitsAndExpenses WHERE linkWithYear = ?",
            [yearId]
        );
    }
);

export const addRowInMonthsProfitsAndExpensesTable = createAsyncThunk(
    "monthsProfitsAndExpensesSlice/addRowInMonthsProfitsAndExpensesTable",
    async function (data: monthsProfitsAndExpenses_Type) {
        const query = `
            INSERT INTO monthsProfitsAndExpenses (
                linkWithYear, monthName, monthNumber, profitsTotal, expensesTotal, target
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.linkWithYear,
            data.monthName,
            data.monthNumber,
            data.profitsTotal,
            data.expensesTotal,
            data.target,
        ];

        const createRow = await db.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const updateAnyPropertyInRowInMonthsProfitsAndExpensesTable = createAsyncThunk(
    "monthsProfitsAndExpensesSlice/updateAnyPropertyInRowInMonthsProfitsAndExpensesTable",
    async function ({ id, values }: updateAnyPropertyInRowInMonthsProfitsAndExpensesTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await db.execute(
            `UPDATE monthsProfitsAndExpenses SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getMonthAfterUpdate = await db.select(
            `SELECT * FROM monthsProfitsAndExpenses WHERE id = ?`,
            [id]
        );

        return (getMonthAfterUpdate as monthsProfitsAndExpenses_Type[])[0];
    }
);



const monthsProfitsAndExpensesSlice = createSlice({
    name: "monthsProfitsAndExpensesSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInMonthsProfitsAndExpensesLinkedToYearTable.fulfilled as any, (_, action) => {
            return action.payload
        });

        builde.addCase(addRowInMonthsProfitsAndExpensesTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(updateAnyPropertyInRowInMonthsProfitsAndExpensesTable.fulfilled as any, (state: monthsProfitsAndExpenses_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});

export default monthsProfitsAndExpensesSlice.reducer;