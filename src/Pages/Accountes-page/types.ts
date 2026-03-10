export interface accounte {
    id?: number | string,
    name: string,
    age: number,
    password: string | number,
    type: "manager" | "captain",
    permissions?: [] | "fullAccess",
    attendanceList?: attendanceList_Type[] | [],
}

export interface attendanceList_Type {
    trainerId: string | number,
    date: Date | string,
    sessions: number[],
}