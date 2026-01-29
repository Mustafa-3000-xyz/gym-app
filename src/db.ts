import Database from "@tauri-apps/plugin-sql";

let db: Awaited<ReturnType<typeof Database.load>> | null = null;

export async function getDb() {
    if (!db) {
        try {
            db = await Database.load("sqlite:app_v10.db");

            await db.execute(`
                CREATE TABLE IF NOT EXISTS trainers (
                    trainerId INTEGER PRIMARY KEY, 
                    isSubscriptionActive BOOLEAN,
                    activeSessionsList ARRAY,
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
            console.error(error);
            throw error;
        }
    }
    return db;
}

export async function addTrainer(data: any) {
    const database = await getDb();
    const query = `INSERT INTO trainers (
        trainerId, isSubscriptionActive, activeSessionsList, firstName, lastName, 
        phone, address, subscriptionName, sessionsCount, 
        price, subscriptionStart, subscriptionEnd
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.trainerId,
        data.isSubscriptionActive,
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

    if (result.length > 0) {
        return result[0];
    }

    return null;
}