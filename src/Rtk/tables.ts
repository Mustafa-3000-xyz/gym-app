import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
export async function trainerTable() {
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

export async function accountsTable() {
    const db = await Database.load("sqlite:app-gym-db.db");

    try {
        await db.execute(`
                CREATE TABLE IF NOT EXISTS accountes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    age TEXT,
                    password TEXT,
                    type TEXT,
                    img TEXT,
                    permissions JSON
                )
            `);
    } catch (error) {
        console.error("DB Error:", error);
        throw error;
    }

    return db;
}