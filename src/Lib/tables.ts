import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
const db = await Database.load("sqlite:app-gym-db.db");



export async function trainerTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS trainers (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                firstName TEXT,
                lastName TEXT,
                phone INTEGER,
                address TEXT,
                subscriptionName TEXT,
                sessionsCount INTEGER,
                price INTEGER,
                subscriptionStart TEXT,
                subscriptionEnd TEXT,
                subscriptionStatus TEXT,
                lastRenewalSubscription TEXT
            )
        `);
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    }
}

export async function activeSessionsTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS activeSessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                linkWithTrainer INTEGER,
                accountId INTEGER,
                sessionNumber INTEGER,
                activationDate TEXT
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

export async function yearsProfitsAndExpensesTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS yearsProfitsAndExpenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                yearNumber INTEGER,
                profitsTotal INTEGER,
                expensesTotal INTEGER,
                target INTEGER
            )
        `)

    } catch (error) {
        console.log(error);
    }
}

export async function monthsProfitsAndExpensesTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS monthsProfitsAndExpenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                linkWithYear INTEGER,
                monthName TEXT,
                monthNumber INTEGER,
                profitsTotal INTEGER,
                expensesTotal INTEGER,
                target INTEGER
            )
        `)

    } catch (error) {
        console.log(error);
    }
}

export async function daysProfitsAndExpensesTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS daysProfitsAndExpenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                linkWithMonth INTEGER,
                dayNumber INTEGER,
                profitsTotal INTEGER,
                expensesTotal INTEGER,
                target INTEGER
            )
        `)

    } catch (error) {
        console.log(error);
    }
}

export async function itemsTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                linkWithDay INTEGER,
                linkedWithTrainer INTEGER,
                itemName TEXT,
                category TEXT,
                price INTEGER
            )
        `)

    } catch (error) {
        console.log(error);
    }
}