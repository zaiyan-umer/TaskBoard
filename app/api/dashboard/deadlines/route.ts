import { getUserIdByCookies } from "@/controllers/helpers";
import { connectToDB } from "@/lib/db";
import Task from "@/models/task";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        const baseFilter = {
            $or: [
                { createdBy: new mongoose.Types.ObjectId(userId) },
                { assignedTo: new mongoose.Types.ObjectId(userId) },
            ],
        };

        // Due today
        const dueToday = await Task.countDocuments({
            ...baseFilter,
            dueDate: {
                $gte: today,
                $lte: endOfToday,
            },
            status: { $ne: "done" },
        });

        // Due this week
        const dueThisWeek = await Task.countDocuments({
            ...baseFilter,
            dueDate: {
                $gt: endOfToday,
                $lte: endOfWeek,
            },
            status: { $ne: "done" },
        });

        // Overdue
        const overdue = await Task.countDocuments({
            ...baseFilter,
            dueDate: { $lt: today },
            status: { $ne: "done" },
        });

        return NextResponse.json({
            message: "Deadlines:",
            dueToday, dueThisWeek, overdue
        })

    }
    catch (error) {
        console.error("Internal Server Error: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({
            message: errorMessage
        }, { status: 500 })
    }
}