import { getUserIdByCookies } from "@/app/controllers/helpers"
import { connectToDB } from "@/app/lib/db";
import User from "@/app/models/user";
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

        return NextResponse.json({
            message: "Successfully returned role",
            role: user.role
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error while fetching role: ", error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }

}