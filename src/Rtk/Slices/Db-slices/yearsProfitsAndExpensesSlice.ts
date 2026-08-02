import { yearsProfitsAndExpenses_Type } from "@/Pages/types";
import { updatePropertyInRowYearsProfetsAndExpensesTable_Type, updateSomePropertiesInRowInYearsProfitsAndExpensesTable_Type } from "@/Rtk/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");



export const getAllRowsInYearsProfitsAndExpensesTable = createAsyncThunk(
    "yearsProfitsAndExpensesSlice/getAllRowsInYearsProfitsAndExpensesTable",
    async function () {
        return await database.select("SELECT * FROM yearsProfitsAndExpenses");
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

        const createRow = await database.execute(query, values);

        return {
            id: createRow.lastInsertId,
            ...data
        };
    }
);

export const updatePropertyInRowYearsInProfitsAndExpensesTable = createAsyncThunk(
    "yearsProfitsAndExpensesSlice/updatePropertyInRowYearsInProfitsAndExpensesTable",
    async function ({
        id,
        column,
        value
    }: updatePropertyInRowYearsProfetsAndExpensesTable_Type) {
        const query = `UPDATE yearsProfitsAndExpenses SET ${column} = ? WHERE id = ?`;

        await database.execute(query, [value, id]);

        const getYearAfterUpdate = await database.select(
            `SELECT * FROM yearsProfitsAndExpenses WHERE id = ?`,
            [id]
        );


        return (getYearAfterUpdate as yearsProfitsAndExpenses_Type[])[0];
    }
);

export const updateSomePropertiesInRowInYearsProfitsAndExpensesTable = createAsyncThunk(
    "yearsProfitsAndExpensesSlice/updateSomePropertiesInRowInYearsProfitsAndExpensesTable",
    async function ({ id, values }: updateSomePropertiesInRowInYearsProfitsAndExpensesTable_Type) {
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await database.execute(
            `UPDATE yearsProfitsAndExpenses SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getYearAfterUpdate = await database.select(
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

        builde.addCase(updatePropertyInRowYearsInProfitsAndExpensesTable.fulfilled as any, (state: yearsProfitsAndExpenses_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });

        builde.addCase(updateSomePropertiesInRowInYearsProfitsAndExpensesTable.fulfilled as any, (state: yearsProfitsAndExpenses_Type[], action): any => {
            const result = state.filter(ele => ele.id != action.payload.id);
            return [...result, action.payload];
        });
    }
});

export default yearsProfitsAndExpensesSlice.reducer;