import { IUser } from "@/app/models/user"
import { api } from "./axios"


export async function fetchAllUsers(): Promise<IUser[]> {
    const res = await api.get("/users");
    console.log(res.data.users);
    
    return res.data.users;
}

export async function updateTaskStatus({id, newStatus}: {id: string, newStatus: string}) {
    const res = await api.patch(`/tasks/${id}/status`, { status: newStatus });
    return res;
}