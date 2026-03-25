export interface accounte {
    id?: number | string,
    name: string,
    age: number,
    password: string | number,
    type: "manager" | "captain",
    img: string,
    permissions?: [] | "fullAccess",
}