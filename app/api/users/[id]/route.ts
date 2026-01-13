import { getUserIdByCookies } from "@/app/controllers/helpers"
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({
            message: "No proper id"
        }, { status: 400 })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({
            message: "Invalid user ID"
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
        const currUser = await User.findOne({ _id: userId });
        if (!currUser) {
            return NextResponse.json({
                message: "No such user"
            }, { status: 404 })
        }

        if (currUser.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Successfully returned user",
            user
        }, { status: 200 })
    }
    catch (error) {
        console.error("Error while fetching specific user: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({
            message: errorMessage
        }, { status: 400 })
    }

}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: "No proper id" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    try {
        const userId = await getUserIdByCookies();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();
        const currUser = await User.findById(userId);
        if (!currUser) {
            return NextResponse.json({ message: "No such user" }, { status: 404 });
        }

        if (currUser.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user._id.toString() === currUser._id.toString()) {
            return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error while deleting user:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
