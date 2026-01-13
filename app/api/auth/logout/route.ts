import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logged out successfully"
        }, { status: 200 })

        response.cookies.delete('token');
        response.cookies.delete('role');

        return response;
    }
    catch (error) {
        console.log("Error while logging out: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";


        return NextResponse.json({
            message: errorMessage
        }, { status: 500 })
    }
}