import { NextResponse } from "next/server";

export async function GET(){
    try{
        const response = NextResponse.json({
            message: "Logged out successfully"
        }, {status : 200})

        response.cookies.delete('token');

        return response;
    }
    catch(err){
        console.log("Error while logging out: ", err);
        
        return NextResponse.json({
            message: "Error during logout"
        }, { status: 500 })
    }
}