import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { accountsTable } from "../tables";
import { accounte } from "@/Pages/types";
import { updatePropertyInAccount_Type, updateSomePropertiesInAccount_Type } from "../types";
// ======================================= //
export const getAllAccountes = createAsyncThunk("accountsSlice/getAllAccountes", async function () {
    const database = await accountsTable();
    const accountesList: accounte[] = await database.select("SELECT * FROM accountes");
    const result = accountesList.sort((a, b) => a.id as any - (b.id as any));
    return result
});

export const addAccount = createAsyncThunk("accountsSlice/addAccount", async function (data: accounte) {
    const database = await accountsTable();
    const query = `INSERT INTO accountes (
        name, age, password, type, img, permissions
    ) VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
        data.name,
        data.age,
        data.password,
        data.type,
        data.img,
        data.permissions,
    ];
    const getId = await database.execute(query, values);

    return {
        ...data,
        id: getId.lastInsertId
    };
});

export const deleteAccountById = createAsyncThunk(
    "accountsSlice/deleteAccountById",
    async function (id: number | string) {
        const database = await accountsTable();

        await database.execute(
            "DELETE FROM accountes WHERE id = ?",
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
            `UPDATE accountes SET ${column} = ? WHERE id = ?`,
            [value, id]
        );

        const result = await database.select(
            `SELECT * FROM accountes WHERE id = ?`,
            [id]
        );


        return (result as accounte[])[0];
});

export const updateSomePropertiesInAccount = createAsyncThunk(
    "accountsSlice/updateSomePropertiesInAccount",
    async function (
        { id, accounte }: updateSomePropertiesInAccount_Type
    ) {
        const database = await accountsTable();
        const keys = Object.keys(accounte);


        if (keys.length === 0) return;

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const values = keys.map(key => (accounte as any)[key]);

        await database.execute(
            `UPDATE accountes SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        const result = await database.select(
            `SELECT * FROM accountes WHERE id = ?`,
            [id]
        );

        return (result as accounte[])[0];
});


const accountsSlice = createSlice({
    name: "accountsSlice",
    initialState: [],
    reducers: {},

    extraReducers: function (builde) {
        builde.addCase(getAllAccountes.fulfilled as any, (_, action) => {
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