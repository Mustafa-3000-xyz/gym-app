import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
const db = await Database.load("sqlite:gym-app.db");



export async function trainerTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS trainers (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                firstName TEXT,
                lastName TEXT,
                phone INTEGER,
                address TEXT,
                trainerType TEXT,
                subscriptionName TEXT,
                sessionsCount INTEGER,
                price INTEGER,
                subscriptionStart TEXT,
                subscriptionEnd TEXT,
                subscriptionStatus TEXT
            )
        `);

        try {
            await db.execute(`ALTER TABLE trainers ADD COLUMN notes TEXT;`);
        } catch (e) {

        }

        try {
            await db.execute(`ALTER TABLE trainers ADD COLUMN debt INTEGER;`);
        } catch (e) {

        }

        try {
            await db.execute(`ALTER TABLE trainers DROP COLUMN lastRenewalSubscription;`);
        } catch (e) {

        }

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
                color TEXT,
                profileImg TEXT,
                coverImg TEXT,
                trainersTotal INTEGER,
                numberOfActiveSessions INTEGER,
                permissions TEXT
            )
        `);
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    }


    try {
        await db.execute(`ALTER TABLE accounts RENAME COLUMN numberOfActiveSessions TO numberOfActiveSessions;`);
    } catch (e) {

    }

    try {
        await db.execute(`ALTER TABLE accounts ADD COLUMN numberOfDeletedTrainers INTEGER;`);
    } catch (e) {

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
                itemName TEXT,
                category TEXT,
                price INTEGER
            )
        `)

        try {
            await db.execute(`ALTER TABLE items ADD COLUMN additionTime TEXT;`);
        } catch (e) {

        }

    } catch (error) {
        console.log(error);
    }
}

export async function reportsTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                linkWithPerson INTEGER,
                additionTime TEXT,
                title TEXT,
                description TEXT,
                reportedBy TEXT
            )
        `);
    } catch (error) {
        console.error("Error creating reports table:", error);
        throw error;
    }
}

export async function settingsTable() {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT UNIQUE NOT NULL,
                value TEXT NOT NULL
            );
        `);


        await db.execute(`
            INSERT OR IGNORE INTO settings (key, value) VALUES 
            ('rowsInTrainerTable', '6'),
            ('rowsInAttendanceTable', '6'),
            ('rowsInItemsTable', '6'),
            ('isDeleteSomeTrainersWhoNotRenwal', 'true'),
            ('isActiveMoreSessionInDay', 'false')
        `);

    } catch (error) {
        console.log(error);
    }
}