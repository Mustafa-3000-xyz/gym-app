import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
type TrainerColumn =
    | "subscriptionState"
    | "activeSessionsList"
    | "firstName"
    | "lastName"
    | "phone"
    | "address"
    | "subscriptionName"
    | "sessionsCount"
    | "price"
    | "subscriptionStart"
    | "subscriptionEnd";


async function getDb() {
    const db = await Database.load("sqlite:app-gym-db.db");

    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS trainers (
                trainerId INTEGER PRIMARY KEY, 
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
                subscriptionEnd TEXT
            )
        `);
    } catch (error) {
        console.error("DB Error:", error);
        throw error;
    }

    return db;
}

export async function addTrainer(data: any) {
    const database = await getDb();
    const query = `INSERT INTO trainers (
        trainerId, subscriptionState, activeSessionsList, firstName, lastName, 
        phone, address, subscriptionName, sessionsCount, 
        price, subscriptionStart, subscriptionEnd
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
        data.subscriptionEnd
    ];

    return await database.execute(query, values);
}

export async function getTrainers() {
    const database = await getDb();
    return await database.select("SELECT * FROM trainers");
}

export async function getTrainerById(id: number) {
    const database = await getDb();
    const result = await database.select<any[]>(
        "SELECT * FROM trainers WHERE trainerId = ?",
        [id]
    );

    return result[0];
}

export async function deleteTrainerById(id: number) {
    const database = await getDb();

    await database.execute(
        "DELETE FROM trainers WHERE trainerId = ?",
        [id]
    );
}

export async function updateTrainerProperty(
    trainerId: number,
    column: TrainerColumn,
    value: string | number | boolean
) {
    const database = await getDb();

    await database.execute(
        `UPDATE trainers SET ${column} = ? WHERE trainerId = ?`,
        [value, trainerId]
    );
}