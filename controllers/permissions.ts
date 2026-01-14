import { IUser } from "../../models/user";
import { TaskInterface } from "../../models/task";

export function canViewTask(user: IUser, task: TaskInterface) {
  if (user.role === "admin") return true;

  return (
    task.createdBy.equals(user._id) ||
    task.assignedTo?.equals(user._id)
  );
}

export function canDeleteTask(user: IUser, task: TaskInterface) {
  if (user.role === "admin") return true;

  return task.createdBy.equals(user._id);
}

export function canUpdateTask(user: IUser, task: TaskInterface) {
    if(user.role === "admin")   return true;

    const isCreator = task.createdBy.toString() === user._id!.toString();
    const isAssignee = task.assignedTo.toString() === user._id!.toString();
    if(user.role === 'user' && !isCreator && !isAssignee){
        return false;
    }
    return true;
}

export function canUpdateStatus(user: IUser, task: TaskInterface){
    if(user.role === "admin")   return true;
    return (
        task.createdBy.equals(user._id) ||
        task.assignedTo?.equals(user._id)
    );
}