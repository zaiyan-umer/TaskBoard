import { connectToDB } from "@/lib/db";
import Task, { TaskInterface } from "@/models/task";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import { canDeleteTask, canUpdateTask, canViewTask } from "@/controllers/permissions";
import { getUserIdByCookies } from "@/controllers/helpers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({
            message: "No proper id"
        }, { status: 400 })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({
            message: "Invalid task ID"
        }, { status: 400 })
    }

    try {
        const userId = await getUserIdByCookies();
        if (!userId) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        await connectToDB();
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json({
                message: "Task not found"
            }, { status: 404 })
        }

        if (!canViewTask(user, task)) {
            return NextResponse.json({
                message: "Unauthorized to view this task"
            }, { status: 403 })
        }

        return NextResponse.json({
            message: "Task returned",
            task
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error while fetching task: ", error);
        return NextResponse.json({
            message: "Error while fetching task"
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({
            message: "No proper id"
        }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({
            message: "Invalid task ID"
        }, { status: 400 })
    }

    try {
        const userId = await getUserIdByCookies();
        if (!userId) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        await connectToDB();
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json({
                message: "Task not found"
            }, { status: 404 })
        }

        if (!canDeleteTask(user, task)) {
            return NextResponse.json({
                message: "Unauthorized to delete this task"
            }, { status: 403 })
        }

        await Task.deleteOne({ _id: id });

        return NextResponse.json({
            message: "Task deleted"
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error while deleting task: ", error);
        return NextResponse.json({
            message: "Error while deleting task"
        }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { title, description, status, priority, dueDate, assignedTo } = await request.json();

    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();

    if (trimmedTitle !== undefined && !trimmedTitle) {
        return NextResponse.json({
            message: "Title cannot be empty"
        }, { status: 400 })
    }
    if (status && !["todo", "in_progress", "done"].includes(status)) {
        return NextResponse.json({
            message: "Invalid status value"
        }, { status: 400 })
    }
    if (priority && !['high', 'medium', 'low'].includes(priority)) {
        return NextResponse.json({
            message: "Invalid priority value"
        }, { status: 400 })
    }
    let parsedDueDate: undefined | Date = undefined;
    if (dueDate) {
        parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            return NextResponse.json({
                message: "Invalid date format"
            }, { status: 400 })
        }
    }

    const { id } = await params;
    if (!id) {
        return NextResponse.json({
            message: "No proper id"
        }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({
            message: "Invalid task ID"
        }, { status: 400 })
    }
    try {
        const userId = await getUserIdByCookies();
        if (!userId) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        await connectToDB();
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json({
                message: "Task not found"
            }, { status: 404 })
        }

        // Authorization
        if (!canUpdateTask(user, task)) {
            return NextResponse.json({
                message: "Unauthorized to update this task"
            }, { status: 403 })
        }

        let assignedUserId = task.assignedTo;
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser) {
                return NextResponse.json({
                    message: "Assigned user not found"
                }, { status: 400 })
            }
            assignedUserId = assignedUser._id;
        }

        // Update task
        const updateData: Partial<TaskInterface> = {};
        if (trimmedTitle !== undefined) updateData.title = trimmedTitle;
        if (trimmedDescription !== undefined) updateData.description = trimmedDescription;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = parsedDueDate;
        if (assignedUserId !== task.assignedTo) updateData.assignedTo = assignedUserId;

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json({
            message: "Task updated successfully",
            task: updatedTask
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error while updating task: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({
            message: errorMessage
        }, { status: 500 })
    }
}