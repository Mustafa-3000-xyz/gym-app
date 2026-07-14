import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
const db = await Database.load("sqlite:app-gym-db.db");



export async function trainerTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS trainers (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                subscriptionState TEXT,
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
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    }
}

export async function activeSessionsTable() {
    try {
        await db.execute("PRAGMA foreign_keys = ON;");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS activeSessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                linkWithTrainer INTEGER,
                accountId INTEGER,
                sessionNumber INTEGER,
                activationDate TEXT,
                FOREIGN KEY (linkWithTrainer) REFERENCES trainers(id) ON DELETE CASCADE
            )
        `);
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    }
}

export async function accountsTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age INTEGER,
                password TEXT,
                type TEXT,
                profileImg TEXT,
                coverImg TEXT,
                loginDate TEXT,
                workingHours INTEGER,
                totalActiveSubscriptions INTEGER,
                permissions TEXT
            )
        `);
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    }
}

export async function subscriptionsMenusTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS subscriptionsMenus (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subscriptionName TEXT,
                sessionsCount INTEGER,
                price INTEGER,
                isActive TEXT
            )
        `);
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    }
}

export async function attendanceTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date INTEGER,
                accountId INTEGER,
                trainers JSON
            )
        `);
    } catch (err) {
        console.log(err);
        throw err;
    }
}