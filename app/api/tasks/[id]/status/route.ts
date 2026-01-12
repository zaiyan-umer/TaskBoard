import { getUserIdByCookies } from "@/app/controllers/helpers";
import { canUpdateStatus } from "@/app/controllers/permissions";
import { connectToDB } from "@/app/lib/db";
import Task from "@/app/models/task";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(request : NextRequest, {params} : {params: Promise<{id: string}>}){
    const {status} = await request.json();

    if(status && !['todo', 'in_progress', 'done'].includes(status)){
        return NextResponse.json({
            message: "Invalid status value"
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
        const userId = await getUserIdByCookies();
        if(!userId){
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

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

        if(!canUpdateStatus(user, task)){
            return NextResponse.json({
                message: "Unauthorized to update the status"
            }, { status: 403 })
        }

        const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

        return NextResponse.json({
            message: "Status updated successfully",
            task: updatedTask
        }, {status: 200})
    }
    catch (error) {
        console.error("Error while updating Status: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json({
            message: errorMessage
        }, { status: 500 })
    }
}