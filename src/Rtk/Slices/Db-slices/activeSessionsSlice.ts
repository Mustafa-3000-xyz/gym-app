import { activeSession_Type } from "@/Pages/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "@tauri-apps/plugin-sql";
// ======================================= //
const database = await Database.load("sqlite:gym-app.db");



export const getAllRowsInActiveSessionsTableToLinkedTheTrainer = createAsyncThunk(
    "activeSessionsSlice/getAllRowsInActiveSessionsTableToLinkedTheTrainer",
    async function (trainerId: number) {
        return await database.select(
            "SELECT * FROM activeSessions WHERE linkWithTrainer = ?",
            [trainerId]
        );
    }
)

export const addRowInActiveSessionsTableAndLinkedTheTrainer = createAsyncThunk(
    "activeSessionsSlice/addRowInActiveSessionsTableAndLinkedTheTrainer",
    async function (data: activeSession_Type) {
        const query = `
            INSERT INTO activeSessions (
                linkWithTrainer, accountId, sessionNumber, activationDate
            ) VALUES(?, ?, ?, ?)
        `;

        const values = [
            data.linkWithTrainer,
            data.accountId,
            data.sessionNumber,
            data.activationDate
        ]

        const createRow = await database.execute(query, values);


        return {
            id: createRow.lastInsertId,
            ...data
        }
    }
)

export const deleteRowInActiveSessionsTableToLinkedTheTrainerById = createAsyncThunk(
    "activeSessionsSlice/deleteRowInActiveSessionsTableToLinkedTheTrainerById",
    async function (sessionId: number) {
        const query = "DELETE FROM activeSessions WHERE id = ?";
        const value = [sessionId];

        await database.execute(query, value);
        return sessionId;
    }
)

export const deleteAllRowsInActiveSessionsTableToLinkedTheTrainer = createAsyncThunk(
    "activeSessionsSlice/deleteAllRowsInActiveSessionsTableToLinkedTheTrainer",
    async function (trainerId: number) {
        const query = "DELETE FROM activeSessions WHERE linkWithTrainer = ?";
        const value = [trainerId];

        await database.execute(query, value);
    }
)



const activeSessionsSlice = createSlice({
    name: "activeSessionsSlice",
    initialState: [],
    reducers: {},


    extraReducers: function (builder) {
        builder.addCase(getAllRowsInActiveSessionsTableToLinkedTheTrainer.fulfilled, function (_, action) {
            return action.payload as any;
        });

        builder.addCase(addRowInActiveSessionsTableAndLinkedTheTrainer.fulfilled, function (state, action) {
            return [...state, action.payload] as any;
        });

        builder.addCase(deleteRowInActiveSessionsTableToLinkedTheTrainerById.fulfilled as any, (state: activeSession_Type[], action): any => {
            return state.filter(ele => ele.id != action.payload);
        });
    }
});


export default activeSessionsSlice.reducer;