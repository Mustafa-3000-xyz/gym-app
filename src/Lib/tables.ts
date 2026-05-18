import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
const db = await Database.load("sqlite:app-gym-db.db");


export async function trainerTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS trainers (
                trainerId INTEGER PRIMARY KEY AUTOINCREMENT, 
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
                logOutDate TEXT,
                workingHours INTEGER,
                totalForActiveSessions INTEGER,
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
                trainersTotal INTEGER,
                price INTEGER,
                isActive TEXT
            )
        `);
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    }
}

export async function daysTable() {
    try {
        db.execute(`
            CREATE TABLE IF NOT EXISTS days(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT
            )
        `);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function daysDetailsTable() {
    try {
        await db.execute("PRAGMA foreign_keys = ON;");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS daysDetails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dateId INTEGER,
                accountId INTEGER,
                trainers JSON,
                FOREIGN KEY (dateId) REFERENCES days (id) ON DELETE CASCADE
            )
        `);
    } catch (err) {
        console.log(err);
        throw err;
    }
}