import { daysProfitsAndExpenses_Type } from "@/Pages/types";
import { updateAnyPropertyInRowInDaysProfitsAndExpensesTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const db = await Database.load("sqlite:gym-app.db");



export const getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable = createAsyncThunk(
    "daysProfitsAndExpensesSlice/getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable",
    async function (monthId: number) {
        return await db.select(
            "SELECT * FROM daysProfitsAndExpenses WHERE linkWithMonth = ?",
            [monthId]
        );
    }
);

export const addRowInDaysProfitsAndExpensesTable = createAsyncThunk(
    "daysProfitsAndExpensesSlice/addRowInDaysProfitsAndExpensesTable",
    async function (data: daysProfitsAndExpenses_Type) {
        const query = `
            INSERT INTO daysProfitsAndExpenses (
                linkWithMonth, dayNumber, profitsTotal, expensesTotal, target
            ) VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.linkWithMonth,
            data.dayNumber,
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

export const updateAnyPropertyInRowInDaysProfitsAndExpensesTable = createAsyncThunk(
    "daysProfitsAndExpensesSlice/updateAnyPropertyInRowInDaysProfitsAndExpensesTable",
    async function ({ id, values }: updateAnyPropertyInRowInDaysProfitsAndExpensesTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await db.execute(
            `UPDATE daysProfitsAndExpenses SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getDayAfterUpdate = await db.select(
            `SELECT * FROM daysProfitsAndExpenses WHERE id = ?`,
            [id]
        );

        return (getDayAfterUpdate as daysProfitsAndExpenses_Type[])[0];
    }
);



const daysProfitsAndExpensesSlice = createSlice({
    name: "daysProfitsAndExpensesSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable.fulfilled as any, (_, action) => {
            return action.payload
        });

        builde.addCase(addRowInDaysProfitsAndExpensesTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(updateAnyPropertyInRowInDaysProfitsAndExpensesTable.fulfilled as any, (state: daysProfitsAndExpenses_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});

export default daysProfitsAndExpensesSlice.reducer;