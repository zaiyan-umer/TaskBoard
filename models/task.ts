import mongoose, { model, models, Schema } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface TaskInterface {
    title: string,
    description: string,
    status: TaskStatus,
    priority: 'high' | 'low' | 'medium',
    dueDate?: Date,
    createdBy: mongoose.Types.ObjectId,
    assignedTo: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
    _id?: mongoose.Types.ObjectId
}

export interface PopulatedTask extends Omit<TaskInterface, 'createdBy' | 'assignedTo'> {
    createdBy: {
        _id: mongoose.Types.ObjectId;
        username: string;
    };
    assignedTo?: {
        _id: mongoose.Types.ObjectId;
        username: string;
    };
}

const TaskSchema = new Schema({
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
        type: Date
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const Task = models?.Task || model("Task", TaskSchema);

export default Task;