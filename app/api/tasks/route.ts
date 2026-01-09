import { connectToDB } from "@/app/lib/db";
import Task from "@/app/models/task";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdByCookies } from "@/app/controllers/helpers";

export async function POST(request: NextRequest) {
    const { title, description, priority, dueDate, assignedTo = '' } = await request.json();

    const trimmedTitle = title?.trim();
    const trimmedDescription = description?.trim();

    if (!trimmedTitle || !trimmedDescription) {
        return NextResponse.json({
            message: "Incomplete information"
        }, { status: 400 })
    }

    if (priority && !['high', 'medium', 'low'].includes(priority)) {
        return NextResponse.json({
            message: "Invalid priority value"
        }, { status: 400 })
    }

    let parsedDueDate = undefined;
    // When creating/updating tasks
    if (dueDate) {
        parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            return NextResponse.json({
                message: "Invalid date format"
            }, { status: 400 })
        }
    }
    try {
        const userId = await getUserIdByCookies();
        if (!userId) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        await connectToDB();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        if (user.role === 'user' && assignedTo && assignedTo !== userId) {
            return NextResponse.json({
                message: "Unauthorized to assign task"
            }, { status: 403 })
        }

        let assignedUserId = user._id;
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser) {
                return NextResponse.json({
                    message: "Assigned user not found"
                }, { status: 400 })
            }
            assignedUserId = assignedUser._id;
        }

        const task = await Task.create({
            title: trimmedTitle, description: trimmedDescription, priority, dueDate: parsedDueDate, createdBy: user._id, assignedTo: assignedUserId
        })

        return NextResponse.json({
            message: "Task created successfully",
            task: task
        }, { status: 201 })

    } catch (error) {
        console.error("Error while creating task: ", error);
        return NextResponse.json({
            message: "Error while creating task"
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const status = searchParams.get("status")
        const priority = searchParams.get("priority")
        const assignedTo = searchParams.get("assignedTo")
        const search = searchParams.get("search")
        const due = searchParams.get("due");
        const sortBy = searchParams.get("sortBy") || "createdAt"
        const order = searchParams.get("order") === "asc" ? 1 : -1
        const page = Number(searchParams.get("page")) || 1
        const limit = Number(searchParams.get("limit")) || 20
        const skip = (page - 1) * limit

        const userId = await getUserIdByCookies()
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);

        const andConditions: any[] = []
        andConditions.push({
            $or: [{ createdBy: userId }, { assignedTo: userId }]
        })

        if (due === "today") {
            andConditions.push({
                dueDate: { $gte: today, $lte: endOfToday }
            });
        }

        if (due === "week") {
            andConditions.push({
                dueDate: { $gt: endOfToday, $lte: endOfWeek }
            });
        }

        if (due === "overdue") {
            andConditions.push({
                dueDate: { $lt: today }
            });
        }

        // search
        if (search) {
            andConditions.push({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            })
        }

        // exact filters
        if (status) andConditions.push({ status })
        if (priority) andConditions.push({ priority })
        if (assignedTo) andConditions.push({ assignedTo })

        const filter =
            andConditions.length > 0 ? { $and: andConditions } : {}

        // sorting
        const sort: any = {}
        sort[sortBy] = order

        await connectToDB()

        const tasks = await Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "username")
            .populate("assignedTo", "username")
            .lean()

        return NextResponse.json({ tasks }, { status: 200 })
    } catch (error) {
        console.error("Error while fetching tasks:", error)
        return NextResponse.json(
            { message: "Error while fetching tasks" },
            { status: 500 }
        )
    }
}
