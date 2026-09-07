import { daysProfitsAndExpenses_Type } from "@/Pages/types";
import { updatePropertyInRowInDaysProfetsAndExpensesTable_Type, updateSomePropertiesInRowInDaysProfitsAndExpensesTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:gym-app.db");



export const getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable = createAsyncThunk(
    "daysProfitsAndExpensesSlice/getAllRowsInDaysProfitsAndExpensesLinkedToMonthTable",
    async function (monthId: number) {
        return await database.select(
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
            data.target
        ];

        const createRow = await database.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const updatePropertyInRowInDaysProfitsAndExpensesTable = createAsyncThunk(
    "daysProfitsAndExpensesSlice/updatePropertyInRowInDaysProfitsAndExpensesTable",
    async function ({
        id,
        column,
        value
    }: updatePropertyInRowInDaysProfetsAndExpensesTable_Type) {
        const query = `UPDATE daysProfitsAndExpenses SET ${column} = ? WHERE id = ?`;

        await database.execute(query, [value, id]);

        const getDayAfterUpdate = await database.select(
            `SELECT * FROM daysProfitsAndExpenses WHERE id = ?`,
            [id]
        );


        return (getDayAfterUpdate as daysProfitsAndExpenses_Type[])[0];
    }
);

export const updateSomePropertiesInRowInDaysProfitsAndExpensesTable = createAsyncThunk(
    "daysProfitsAndExpensesSlice/updateSomePropertiesInRowInDaysProfitsAndExpensesTable",
    async function ({ id, values }: updateSomePropertiesInRowInDaysProfitsAndExpensesTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await database.execute(
            `UPDATE daysProfitsAndExpenses SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getDayAfterUpdate = await database.select(
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

        builde.addCase(updatePropertyInRowInDaysProfitsAndExpensesTable.fulfilled as any, (state: daysProfitsAndExpenses_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });

        builde.addCase(updateSomePropertiesInRowInDaysProfitsAndExpensesTable.fulfilled as any, (state: daysProfitsAndExpenses_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});

export default daysProfitsAndExpensesSlice.reducer;