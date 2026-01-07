import { connectToDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest){
    const {email, password, role} = await request.json();
    const trimmedEmail = email?.trim().toLowerCase();
    
    if(!trimmedEmail || !password || !role){
        return NextResponse.json({
            message: "Insufficient information provided"
        }, { status: 400 })
    }

    if(role !== 'user' && role !== 'admin'){
        return NextResponse.json({
            message: "Invalid role specified"
        }, { status: 400 })
    }
    try{
        await connectToDB();
        const existingUser = await User.findOne({email: trimmedEmail});
        if(!existingUser){
            return NextResponse.json({
                message: "Please register first"
            }, { status: 400 })
        }

        if(existingUser.role !== role){
            return NextResponse.json({
                
                message: "Invalid role for this user"
            }, { status: 403 })
        }

        const isVerified = await bcrypt.compare(password, existingUser.password);

        if(!isVerified){
            return NextResponse.json({
                message: "Incorrect email or password"
            }, { status: 403 })
        }

        const token = jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET!, {expiresIn: '1d'});

        const response = NextResponse.json({ message: "Login successful" }, { status: 200 })

        response.cookies.set("token", token, {
            httpOnly: true
        });

        return response;
    }
    catch(err){
        console.log("Error while login: ", err);
        
        return NextResponse.json({
            message: "Error during login"
        }, { status: 500 })
    }
}