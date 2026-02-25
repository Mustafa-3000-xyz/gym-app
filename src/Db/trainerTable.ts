import Database from "@tauri-apps/plugin-sql";
import { updateOneColumn } from "./types";
import { trainer } from "@/Pages/Trainers-page/types";
// ========================================================== //
async function getTable() {
    const db = await Database.load("sqlite:app-gym-db.db");

    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS trainers (
                trainerId TEXT, 
                subscriptionState TEXT,
                activeSessionsList TEXT,
                firstName TEXT,
                lastName TEXT,
                phone INTEGER,
                address TEXT,
                subscriptionName TEXT,
                sessionsCount INTEGER,
                price INTEGER,
                subscriptionStart TEXT,
                subscriptionEnd TEXT,
                dateAdded TEXT
            )
        `);
    } catch (error) {
        console.error("DB Error:", error);
        throw error;
    }

    return db;
}

export async function addTrainer(data: any) {
    const database = await getTable();
    const query = `INSERT INTO trainers (
        trainerId, subscriptionState, activeSessionsList, firstName, lastName, 
        phone, address, subscriptionName, sessionsCount, 
        price, subscriptionStart, subscriptionEnd, dateAdded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.trainerId,
        data.subscriptionState,
        data.activeSessionsList,
        data.firstName,
        data.lastName,
        data.phone,
        data.address,
        data.subscriptionName,
        data.sessionsCount,
        data.price,
        data.subscriptionStart,
        data.subscriptionEnd,
        data.dateAdded
    ];

    return await database.execute(query, values);
}

export async function getTrainers() {
    const database = await getTable();
    return await database.select("SELECT * FROM trainers");
}

export async function getTrainerById(id: number) {
    const database = await getTable();
    const result = await database.select<any[]>(
        "SELECT * FROM trainers WHERE trainerId = ?",
        [id]
    );

    return result[0];
}

export async function deleteTrainerById(id: number) {
    const database = await getTable();

    await database.execute(
        "DELETE FROM trainers WHERE trainerId = ?",
        [id]
    );
}

export async function updateTrainer(
    trainerId: number,
    data: Partial<trainer>
) {
    const database = await getTable();
    const keys = Object.keys(data);


    if (keys.length === 0) return;

    const setClause = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => (data as any)[key]);

    await database.execute(
        `UPDATE trainers SET ${setClause} WHERE trainerId = ?`,
        [...values, trainerId]
    );
}

export async function updatePropertyInTrainer(
    trainerId: number,
    column: updateOneColumn,
    value: string | number | boolean
) {
    const database = await getTable();

    await database.execute(
        `UPDATE trainers SET ${column} = ? WHERE trainerId = ?`,
        [value, trainerId]
    );
}