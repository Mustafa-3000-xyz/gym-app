export interface accounte {
    id?: number | string,
    name: string,
    age: number | string,
    password: string,
    type: "manager" | "captain",
    img: string,
    permissions?: [] | "fullAccess",
}