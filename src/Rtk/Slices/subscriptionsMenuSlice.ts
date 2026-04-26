import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { subscriptionsMenuTable } from "../../Lib/tables";
import { subscriptionsMenu } from "@/Pages/types";
import { updatePropertyInSubscriptionsMenu_Type, updateSomePropertiesInSubscriptionsMenu_Type } from "../types";
// ======================================= //
export const getAllSubscriptionsMenu = createAsyncThunk(
    "subscriptionsMenuSlice/getAllSubscriptionsMenu",
    async function () {
        const database = await subscriptionsMenuTable();
        const list: subscriptionsMenu[] = await database.select("SELECT * FROM subscriptionsMenu");
        const result = list.sort((a, b) => (a.id as number) - (b.id as number));
        return result;
    }
);

export const addSubscriptionMenu = createAsyncThunk(
    "subscriptionsMenuSlice/addSubscriptionMenu",
    async function (data: subscriptionsMenu) {
        const database = await subscriptionsMenuTable();
        const query = `INSERT INTO subscriptionsMenu (
            subscriptionName, sessionsCount, trainersTotal, price, isActive
        ) VALUES (?, ?, ?, ?, ?)`;



        const values = [
            data.subscriptionName,
            data.sessionsCount,
            data.trainersTotal,
            data.price,
            data.isActive
        ];

        const getId = await database.execute(query, values);


        return {
            id: getId.lastInsertId,
            ...data
        };
    }
);

export const deleteSubscriptionMenuById = createAsyncThunk(
    "subscriptionsMenuSlice/deleteSubscriptionMenuById",
    async function (id: number | string) {
        const database = await subscriptionsMenuTable();

        await database.execute(
            "DELETE FROM subscriptionsMenu WHERE id = ?",
            [id]
        );

        return id;
    }
);

export const updatePropertyInSubscriptionMenu = createAsyncThunk(
    "subscriptionsMenuSlice/updatePropertyInSubscriptionMenu",
    async function ({ id, column, value }: updatePropertyInSubscriptionsMenu_Type) {
        const database = await subscriptionsMenuTable();

        await database.execute(
            `UPDATE subscriptionsMenu SET ${column} = ? WHERE id = ?`,
            [value, id]
        );

        const result = await database.select(
            `SELECT * FROM subscriptionsMenu WHERE id = ?`,
            [id]
        );

        return (result as subscriptionsMenu[])[0];
    }
);

export const updateSomePropertiesInSubscriptionMenu = createAsyncThunk(
    "subscriptionsMenuSlice/updateSomePropertiesInSubscriptionMenu",
    async function ({ id, values }: updateSomePropertiesInSubscriptionsMenu_Type) {
        const database = await subscriptionsMenuTable();
        const keys = Object.keys(values);

        if (keys.length === 0) return;

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        const result = keys.map((key) => (values as any)[key]);

        await database.execute(
            `UPDATE subscriptionsMenu SET ${setClause} WHERE id = ?`,
            [...result, id]
        );

        const updatedSubscription = await database.select(
            `SELECT * FROM subscriptionsMenu WHERE id = ?`,
            [id]
        );

        return (updatedSubscription as subscriptionsMenu[])[0];
    }
);

const subscriptionsMenuSlice = createSlice({
    name: "subscriptionsMenuSlice",
    initialState: [] as subscriptionsMenu[],
    reducers: {},

    extraReducers: function (builder) {
        builder.addCase(getAllSubscriptionsMenu.fulfilled as any, (_, action) => {
            return action.payload;
        });

        builder.addCase(addSubscriptionMenu.fulfilled as any, (state, action): any => {
            return [...state, action.payload];
        });

        builder.addCase(deleteSubscriptionMenuById.fulfilled as any, (state: subscriptionsMenu[], action): any => {
            return state.filter((ele) => ele.id != action.payload);
        });

        builder.addCase(updatePropertyInSubscriptionMenu.fulfilled as any, (state: subscriptionsMenu[], action): any => {
            const filter = state.filter((ele) => ele.id != action.payload.id);
            return [...filter, action.payload].sort((a, b) => (a.id as number) - (b.id as number));
        });

        builder.addCase(updateSomePropertiesInSubscriptionMenu.fulfilled as any, (state: subscriptionsMenu[], action): any => {
            const filter = state.filter((ele) => ele.id != action.payload.id);
            return [...filter, action.payload].sort((a, b) => (a.id as number) - (b.id as number));
        });
    }
});

export default subscriptionsMenuSlice.reducer;