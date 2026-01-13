import { getUserIdByCookies } from "@/app/controllers/helpers"
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
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

        const users = await User.find({}, "username email");

        return NextResponse.json({
            message: "Successfully returned users",
            users
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error while fetching all users: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({
            message: errorMessage
        }, { status: 500 })
    }

}