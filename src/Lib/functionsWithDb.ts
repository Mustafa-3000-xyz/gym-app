import Database from "@tauri-apps/plugin-sql";
// ========================================================== //
const database = await Database.load("sqlite:gym-app.db");



export async function getAllAttendanceInSpecificDate(date: Date | string) {
    return await database.select(
        "SELECT * FROM attendance WHERE date = ?",
        [date]
    );
}