import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { email, username, password } = await request.json();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedUsername = username?.trim();

    if (!trimmedEmail || !trimmedUsername || !password) {
        return NextResponse.json({
            message: "Insufficient information provided"
        }, { status: 400 })
    }
    if (password.length < 6) {
        return NextResponse.json({
            message: "Password must be at least 6 characters long"
        }, { status: 400 })
    }
    try {
        await connectToDB();
        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return NextResponse.json({
                message: "Email already in use"
            }, { status: 400 })
        }

        const user = await User.create({
            username: trimmedUsername, email: trimmedEmail, role: "user"
        })

        return NextResponse.json({
            message: "successfully registered"
        }, { status: 201 })
    }
    catch (error) {
        console.log("Error while registration: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";


        return NextResponse.json({
            message: errorMessage
        }, { status: 500 })
    }
}