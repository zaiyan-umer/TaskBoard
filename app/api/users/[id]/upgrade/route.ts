import { getUserIdByCookies } from "@/app/controllers/helpers";
import { connectToDB } from "@/app/lib/db";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  const body = await request.json();
  const role = body.role?.toLowerCase();
  if (!role || !['admin', 'user'].includes(role)) {
    return NextResponse.json({ message: "Invalid role value" }, { status: 400 });
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

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: "-password" }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User role updated successfully",
      user
    }, { status: 200 });

  } catch (error) {
    console.error("Error while updating user's role:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
