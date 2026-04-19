import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { accountsTable } from "../tables";
import { accounte } from "@/Pages/types";
import { updatePropertyInAccount_Type, updateSomePropertiesInAccount_Type } from "../types";
// ======================================= //
export const getAllAccounts = createAsyncThunk("accountsSlice/getAllAccounts", async function () {
    const database = await accountsTable();
    const accountsList: accounte[] = await database.select("SELECT * FROM accounts");
    const result = accountsList.sort((a, b) => a.id as any - (b.id as any));
    return result
});

export const addAccount = createAsyncThunk("accountsSlice/addAccount", async function (data: accounte) {
    const database = await accountsTable();
    const query = `INSERT INTO accounts (
        name, age, password, type, profileImg, coverImg, 
        loginDate, logOutDate, workingHours, totalForActiveSessions, permissions
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.name,
        data.age,
        data.password,
        data.type,
        data.profileImg,
        data.coverImg,
        data.loginDate,
        data.logOutDate,
        data.workingHours,
        data.totalForActiveSessions,
        data.permissions
    ];
    const getId = await database.execute(query, values);

    return {
        id: getId.lastInsertId,
        ...data
    };
});

export const deleteAccountById = createAsyncThunk(
    "accountsSlice/deleteAccountById",
    async function (id: number | string) {
        const database = await accountsTable();

        await database.execute(
            "DELETE FROM accounts WHERE id = ?",
            [id]
        );

        return id;
});

export const updatePropertyInAccount = createAsyncThunk(
    "accountsSlice/updatePropertyInAccount",
    async function ({
        id,
        column,
        value
    }: updatePropertyInAccount_Type) {
        const database = await accountsTable();

        await database.execute(
            `UPDATE accounts SET ${column} = ? WHERE id = ?`,
            [value, id]
        );

        const result = await database.select(
            `SELECT * FROM accounts WHERE id = ?`,
            [id]
        );


        return (result as accounte[])[0];
});

export const updateSomePropertiesInAccount = createAsyncThunk(
    "accountsSlice/updateSomePropertiesInAccount",
    async function (
        { id, values }: updateSomePropertiesInAccount_Type
    ) {
        const database = await accountsTable();
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
});


const accountsSlice = createSlice({
    name: "accountsSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllAccounts.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builde.addCase(addAccount.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builde.addCase(deleteAccountById.fulfilled as any, (state: accounte[], action): any => {
            const result = state.filter(ele => ele.id != action.payload);
            return result;
        });

        builde.addCase(updatePropertyInAccount.fulfilled as any, (state: accounte[], action): any => {
            const filter = state.filter(ele => ele.id != action.payload.id);
            const result = [...filter, action.payload].sort((a, b) => a.id - b.id);
            return result;
        });

        builde.addCase(updateSomePropertiesInAccount.fulfilled as any, (state: accounte[], action): any => {
            const filter = state.filter(ele => ele.id != action.payload.id);
            const result = [...filter, action.payload].sort((a, b) => a.id - b.id);
            return result;
        });
    }
});

export default accountsSlice.reducer;