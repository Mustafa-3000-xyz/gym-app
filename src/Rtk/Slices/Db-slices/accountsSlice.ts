import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { accounte_Type } from "@/Pages/types";
import { updateAnyPropertyInAccount_Type } from "../../types";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
export const getAllRowsInAccountsTable = createAsyncThunk(
    "accountsSlice/getAllRowsInAccountsTable",
    async function () {
        const db = await Database.load("sqlite:gym-app.db");

        return await db.select("SELECT * FROM accounts");
    }
);

export const addRowInAccountsTable = createAsyncThunk(
    "accountsSlice/addRowInAccountsTable",
    async function (data: accounte_Type) {
        const db = await Database.load("sqlite:gym-app.db");
        const query = `
            INSERT INTO accounts (
                name, age, password, type, color, profileImg, coverImg, 
                trainersTotal, numberOfActiveSessions, permissions, numberOfDeletedTrainers
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.name,
            data.age,
            data.password,
            data.type,
            data.color,
            data.profileImg,
            data.coverImg,
            data.trainersTotal,
            data.numberOfActiveSessions,
            data.permissions,
            data.numberOfDeletedTrainers
        ];

        const getId = (await db.execute(query, values)).lastInsertId;


        return {
            id: getId,
            ...data
        };
    }
);

export const deleteRowInAccountsTableById = createAsyncThunk(
    "accountsSlice/deleteRowInAccountsTableById",
    async function (id: number) {
        const db = await Database.load("sqlite:gym-app.db");

        await db.execute(
            "DELETE FROM accounts WHERE id = ?",
            [id]
        );

        return id;
    }
);

export const deleteAllRowsInAccountsTable = createAsyncThunk(
    "accountsSlice/deleteAllRowsInAccountsTable",
    async function () {
        const db = await Database.load("sqlite:gym-app.db");

        await db.execute(`DELETE FROM accounts WHERE type != 'manager';`);
    }
);

export const updateAnyPropertyInRowInAccountsTable = createAsyncThunk(
    "accountsSlice/updateAnyPropertyInRowInAccountsTable",
    async function (
        { id, values }: updateAnyPropertyInAccount_Type
    ) {
        const db = await Database.load("sqlite:gym-app.db");
        const keys = Object.keys(values);


        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const result = keys.map(key => (values as any)[key]);

        await db.execute(
            `UPDATE accounts SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const getRowAfterUpdate = await db.select(
            `SELECT * FROM accounts WHERE id = ?`,
            [id]
        );

        return (getRowAfterUpdate as accounte_Type[])[0];
    }
);



const accountsSlice = createSlice({
    name: "accountsSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builder) {
        builder.addCase(getAllRowsInAccountsTable.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builder.addCase(addRowInAccountsTable.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builder.addCase(deleteRowInAccountsTableById.fulfilled as any, (state: accounte_Type[], action): any => {
            return state.filter(ele => ele.id != action.payload)
        });

        builder.addCase(deleteAllRowsInAccountsTable.fulfilled as any, (state: accounte_Type[]): any => {
            return state.filter(account => account.type == "manager");
        });

        builder.addCase(updateAnyPropertyInRowInAccountsTable.fulfilled as any, (state: accounte_Type[], action): any => {
            const index = state.findIndex(ele => ele.id == action.payload.id);

            if (index != -1) {
                state[index] = action.payload;
            }
        });
    }
});

export default accountsSlice.reducer;