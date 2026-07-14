import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { accounte } from "@/Pages/types";
import { updatePropertyInAccount_Type, updateSomePropertiesInAccount_Type } from "../../types";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:app-gym-db.db");


export const getAllRowsInAccountsTable = createAsyncThunk(
    "accountsSlice/getAllRowsInAccountsTable",
    async function () {
        return await database.select("SELECT * FROM accounts");
    }
);

export const addRowInAccountsTable = createAsyncThunk(
    "accountsSlice/addRowInAccountsTable",
    async function (data: accounte) {
        const query = `
            INSERT INTO accounts (
                name, age, password, type, profileImg, coverImg, 
                loginDate, workingHours, totalActiveSubscriptions, permissions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.name,
            data.age,
            data.password,
            data.type,
            data.profileImg,
            data.coverImg,
            data.loginDate,
            data.workingHours,
            data.totalActiveSubscriptions,
            data.permissions
        ];

        const getId = (await database.execute(query, values)).lastInsertId;


        return {
            id: getId,
            ...data
        };
    }
);

export const deleteRowInAccountsTableById = createAsyncThunk(
    "accountsSlice/deleteRowInAccountsTableById",
    async function (id: number | string) {

        await database.execute(
            "DELETE FROM accounts WHERE id = ?",
            [id]
        );

        return id;
    }
);

export const updatePropertyInRowInAccountsTable = createAsyncThunk(
    "accountsSlice/updatePropertyInRowInAccountsTable",
    async function ({
        id,
        column,
        value
    }: updatePropertyInAccount_Type) {
        const query = `UPDATE accounts SET ${column} = ? WHERE id = ?`;

        await database.execute(query, [value, id]);

        const getAccountAfterUpdate = await database.select(
            `SELECT * FROM accounts WHERE id = ?`,
            [id]
        );


        return (getAccountAfterUpdate as accounte[])[0];
    }
);

export const updateSomePropertiesInRowInAccountsTable = createAsyncThunk(
    "accountsSlice/updateSomePropertiesInRowInAccountsTable",
    async function (
        { id, values }: updateSomePropertiesInAccount_Type
    ) {
        const keys = Object.keys(values);


        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await database.execute(
            `UPDATE accounts SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const updatedTrainer = await database.select(
            `SELECT * FROM accounts WHERE id = ?`,
            [id]
        );

        return (updatedTrainer as accounte[])[0];
    }
);


const accountsSlice = createSlice({
    name: "accountsSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllRowsInAccountsTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builde.addCase(addRowInAccountsTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(deleteRowInAccountsTableById.fulfilled as any, (state: accounte[], action): any => {
            return state.filter(ele => ele.id != action.payload);
        });

        builde.addCase(updatePropertyInRowInAccountsTable.fulfilled as any, (state: accounte[], action): any => {
            const filter = state.filter(ele => ele.id != action.payload.id);
            return [...filter, action.payload].sort((a, b) => a.id - b.id);
        });

        builde.addCase(updateSomePropertiesInRowInAccountsTable.fulfilled as any, (state: accounte[], action): any => {
            const filter = state.filter(ele => ele.id != action.payload.id);
            return [...filter, action.payload].sort((a, b) => a.id - b.id);;
        });
    }
});

export default accountsSlice.reducer;