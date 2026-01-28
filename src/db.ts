import Database from "@tauri-apps/plugin-sql";

let db: Awaited<ReturnType<typeof Database.load>> | null = null;

export async function getDb() {
    if (!db) {
        try {
            db = await Database.load("sqlite:app_v5.db");

            await db.execute(`
                CREATE TABLE IF NOT EXISTS trainers (
                    id INTEGER PRIMARY KEY, 
                    firstName TEXT,
                    lastName TEXT,
                    phone TEXT,
                    address TEXT,
                    subscriptionName TEXT,
                    sessionsCount INTEGER,
                    isSubscriptionActive BOOLEAN,
                    price REAL,
                    subscriptionStart TEXT,
                    subscriptionEnd TEXT
                )
            `);
        } catch (error) {
            console.error("Error : ", error);
            throw error;
        }
    }
    return db;
}

export async function addTrainer(data: any) {
    const database = await getDb();
    const query = `INSERT INTO trainers (
        id, firstName, lastName, phone, address, 
        subscriptionName, sessionsCount, isSubscriptionActive, price, 
        subscriptionStart, subscriptionEnd
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        Number(data.trainerId),
        data.firstName,
        data.lastName,
        data.phone?.toString() || "",
        data.address,
        data.subscriptionName,
        data.sessionsCount,
        data.isSubscriptionActive == "true" ? true : false,
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
        "SELECT * FROM trainers WHERE id = ?", 
        [id]
    );

    if (result.length > 0) {
        return result[0];
    }

    return null;
}