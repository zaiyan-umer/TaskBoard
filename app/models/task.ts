import mongoose, { model, models, Schema } from "mongoose";

interface TaskInterface{
    title: string,
    description: string,
    status: 'todo' | 'in-progress' | 'done',
    priority: 'high' | 'low' | 'medium',
    dueDate: string,
    createdBy: mongoose.Types.ObjectId,
    assignedTo: mongoose.Types.ObjectId,
    createdAt? : Date,
    updatedAt? : Date,
    _id? : mongoose.Types.ObjectId
}

const TaskSchema = new Schema<TaskInterface>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: 'todo'
    },
    priority: {
        type: String,
        required: true,
        default: 'low'
    },
    dueDate: {
        type: String,
        default: 'no due date'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

const Task = models?.task || model("task", TaskSchema);

export default Task;