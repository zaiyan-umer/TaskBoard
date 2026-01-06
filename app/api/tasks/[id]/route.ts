import { connectToDB } from "@/app/lib/db";
import Task from "@/app/models/task";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

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
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (!token) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        await connectToDB();
        const user = await User.findOne({_id: userId});
        if(!user){
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const task = await Task.findById(id);

        if(!task){
            return NextResponse.json({
                message: "Task not found"
            }, { status: 404 })
        }

        if(user.role === 'user'){
            if(task.assignedTo.toString() !== user._id.toString() && task.createdBy.toString() !== user._id.toString()){
                return NextResponse.json({
                    message: "Unauthorized to view this task"
                }, { status: 403 })
            }
        }

        return NextResponse.json({
            message: "Task returned",
            task
        }, {status: 200})
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
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (!token) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        await connectToDB();
        const user = await User.findOne({_id: userId});
        if(!user){
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const task = await Task.findById(id);

        if(!task){
            return NextResponse.json({
                message: "Task not found"
            }, { status: 404 })
        }

        if(user.role === 'user'){
            return NextResponse.json({
                    message: "Unauthorized to delete this task"
                }, { status: 403 })
        }

        await Task.deleteOne({_id: id});

        return NextResponse.json({
            message: "Task deleted"
        }, {status: 200})
    }
    catch (error) {
        console.error("Error while deleting task: ", error);
        return NextResponse.json({
            message: "Error while deleting task"
        }, { status: 500 })
    }
}

export async function PUT(request : NextRequest, {params} : {params: Promise<{id: string}>}){
    const {title, description, status, priority, dueDate, assignedTo} = await request.json();

    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();

    if(trimmedTitle !== undefined && !trimmedTitle){
        return NextResponse.json({
            message: "Title cannot be empty"
        }, { status: 400 })
    }
    if(status && !['todo', 'in-progress', 'done'].includes(status)){
        return NextResponse.json({
            message: "Invalid status value"
        }, { status: 400 })
    }
    if(priority && !['high', 'medium', 'low'].includes(priority)){
        return NextResponse.json({
            message: "Invalid priority value"
        }, { status: 400 })
    }
    if(dueDate && typeof dueDate !== 'string'){
        return NextResponse.json({
            message: "Invalid due date format"
        }, { status: 400 })
    }

    const {id} = await params;
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
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (!token) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        await connectToDB();
        const user = await User.findOne({_id: userId});
        if(!user){
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        const task = await Task.findById(id);

        if(!task){
            return NextResponse.json({
                message: "Task not found"
            }, { status: 404 })
        }

        // Authorization
        const isCreator = task.createdBy.toString() === user._id.toString();
        const isAssignee = task.assignedTo.toString() === user._id.toString();
        if(user.role === 'user' && !isCreator && !isAssignee){
            return NextResponse.json({
                message: "Unauthorized to update this task"
            }, { status: 403 })
        }
        if(user.role === 'user' && assignedTo && assignedTo !== task.assignedTo.toString()){
            return NextResponse.json({
                message: "Unauthorized to reassign this task"
            }, { status: 403 })
        }

        let assignedUserId = task.assignedTo;
        if(assignedTo){
            const assignedUser = await User.findById(assignedTo);
            if(!assignedUser){
                return NextResponse.json({
                    message: "Assigned user not found"
                }, { status: 400 })
            }
            assignedUserId = assignedUser._id;
        }

        // Update task
        const updateData: any = {};
        if(trimmedTitle !== undefined) updateData.title = trimmedTitle;
        if(trimmedDescription !== undefined) updateData.description = trimmedDescription;
        if(status !== undefined) updateData.status = status;
        if(priority !== undefined) updateData.priority = priority;
        if(dueDate !== undefined) updateData.dueDate = dueDate;
        if(assignedUserId !== task.assignedTo) updateData.assignedTo = assignedUserId;

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json({
            message: "Task updated successfully",
            task: updatedTask
        }, {status: 200})
    }
    catch (error) {
        console.error("Error while updating task: ", error);
        return NextResponse.json({
            message: "Error while updating task"
        }, { status: 500 })
    }
}