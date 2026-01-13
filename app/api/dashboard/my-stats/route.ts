import { getUserIdByCookies } from "@/app/controllers/helpers";
import { connectToDB } from "@/lib/db";
import Task from "@/models/task";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdByCookies();
        if (!userId) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        await connectToDB();
        const currUser = await User.findOne({ _id: userId });
        if (!currUser) {
            return NextResponse.json({
                message: "No such user"
            }, { status: 404 })
        }

        const baseFilter = {
            $or: [
                { assignedTo: userId },
                { createdBy: userId }
            ]
        };

        const totalTasks = await Task.countDocuments(baseFilter);
        const highPriorityCount = await Task.countDocuments({ ...baseFilter, priority: "high" });
        const mediumPriorityCount = await Task.countDocuments({ ...baseFilter, priority: "medium" });
        const lowPriorityCount = await Task.countDocuments({ ...baseFilter, priority: "low" });
        const todoCount = await Task.countDocuments({ ...baseFilter, status: "todo" });
        const inProgressCount = await Task.countDocuments({ ...baseFilter, status: "in-progress" });
        const doneCount = await Task.countDocuments({ ...baseFilter, status: "done" });

        return NextResponse.json({
            message: "Count returned successfully",
            TotalTasks: totalTasks,
            HighPriority: highPriorityCount,
            MediumPriority: mediumPriorityCount,
            LowPriority: lowPriorityCount,
            ToDo: todoCount,
            InProgress: inProgressCount,
            Done: doneCount
        }, { status: 200 })
    }
    catch (error) {
        console.error("Internal Server Error: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({
            message: errorMessage
        }, { status: 500 })
    }
}