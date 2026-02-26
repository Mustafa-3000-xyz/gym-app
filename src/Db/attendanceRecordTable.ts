import { attendanceToday } from "@/Pages/Trainers-page/types";
import Database from "@tauri-apps/plugin-sql";
import { updateOneColumnInDays } from "./types";
// ========================================================== //
async function getTable() {
    const db = await Database.load("sqlite:app-gym-db.db");

    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS days (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                theDay TEXT,
                attendanceAndCaptainsList JSON
            )
        `);
    } catch (error) {
        console.error("DB Error:", error);
        throw error;
    }

    return db;
}

export async function addTheDay(data: any) {
    const database = await getTable();
    const query = `INSERT INTO days (
        theDay, attendanceAndCaptainsList
    ) VALUES (?, ?)`;
    const values = [
        data.theDay,
        data.attendanceAndCaptainsList
    ];

    return await database.execute(query, values);
}

export async function getDays() {
    const database = await getTable();
    return await database.select("SELECT * FROM days");
}

export async function getTheDayById(id: number) {
    const database = await getTable();
    const result = await database.select<any[]>(
        "SELECT * FROM days WHERE id = ?",
        [id]
    );

    return result[0];
}

export async function deleteTheDayById(id: number) {
    const database = await getTable();

    await database.execute(
        "DELETE FROM days WHERE id = ?",
        [id]
    );
}

export async function updateTheDay(
    id: number,
    data: Partial<attendanceToday>
) {
    const database = await getTable();
    const keys = Object.keys(data);

    if (keys.length === 0) return;

    const setClause = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => (data as any)[key]);

    await database.execute(
        `UPDATE days SET ${setClause} WHERE id = ?`,
        [...values, id]
    );
}

export async function updatePropertyInTheDay(
    id: number,
    column: updateOneColumnInDays,
    value: string | number
) {
    const database = await getTable();

    await database.execute(
        `UPDATE days SET ${column} = ? WHERE id = ?`,
        [value, id]
    );
}