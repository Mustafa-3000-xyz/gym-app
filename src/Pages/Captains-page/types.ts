export interface accounte{
    id: number | string,
    type: "manager" | "captain",
    permissions: [] | string,
    attendanceList: attendanceList_Type[] | [],
}

export interface attendanceList_Type{
    trainerId: string | number,
    date: Date | string,
    sessions: number[],
}