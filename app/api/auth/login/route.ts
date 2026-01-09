import { connectToDB } from "@/app/lib/db";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest){
    const {email, password } = await request.json();
    const trimmedEmail = email?.trim().toLowerCase();
    
    if(!trimmedEmail || !password ){
        return NextResponse.json({
            message: "Insufficient information provided"
        }, { status: 400 })
    }

    try{
        await connectToDB();
        const existingUser = await User.findOne({email: trimmedEmail});
        if(!existingUser){
            return NextResponse.json({
                message: "User not found. Please sign up to continue."
            }, { status: 404 })
        }

        const isVerified = await bcrypt.compare(password, existingUser.password);

        if(!isVerified){
            return NextResponse.json({
                message: "Incorrect email or password"
            }, { status: 403 })
        }

        const token = jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET!, {expiresIn: '1d'});

        const response = NextResponse.json({ message: "Login successful", id: existingUser._id, role: existingUser.role }, { status: 200 })

        response.cookies.set("token", token, {
            httpOnly: true
        });

        return response;
    }
    catch(err){
        console.log("Error while login: ", err);
        
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}