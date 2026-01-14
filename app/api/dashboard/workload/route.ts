import { getUserIdByCookies } from "@/controllers/helpers"
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
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        if (user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const users = await User.find({}, "username email role");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        const workload: any = {}

        for (const curr of users) {
            if (curr.role === "admin") continue;
            workload[curr.username] = {};

            const baseFilter = {
                $or: [
                    { assignedTo: new mongoose.Types.ObjectId(curr._id) }
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
            workload[curr.username].dueToday = dueToday;
            workload[curr.username].dueThisWeek = dueThisWeek;
            workload[curr.username].overdue = overdue;
        }


        return NextResponse.json({
            message: "Successfully returned workload",
            workload
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