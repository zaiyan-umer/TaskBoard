import { connectToDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const {email, username, password, role, secret=''} = await request.json();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedUsername = username?.trim();
    
    if(!trimmedEmail || !trimmedUsername || !password || !role){
        return NextResponse.json({
            message: "Insufficient information provided"
        }, { status: 400 })
    }
    if(password.length < 6){
        return NextResponse.json({
            message: "Password must be at least 6 characters long"
        }, { status: 400 })
    }
    if(role !== 'user' && role !== 'admin'){
        return NextResponse.json({
            message: "Invalid role specified"
        }, { status: 400 })
    }
    try{
        if(role == 'admin'){
            if(secret != process.env.adminSecret){
                return NextResponse.json({
                    message: "Not authorized"
                }, {status: 403})
            }
        }
        await connectToDB();
        const existingUser = await User.findOne({email: trimmedEmail});
        if(existingUser){
            return NextResponse.json({
                message: "Email already in use"
            }, { status: 400 })
        }

        const user = await User.create({
            username: trimmedUsername, email: trimmedEmail, password, role
        })

        return NextResponse.json({
            message: "successfully registered"
        }, { status: 201 })
    }
    catch(err){
        console.log("Error while registration: ", err);
        
        return NextResponse.json({
            message: "Error during registration"
        }, { status: 500 })
    }
}