import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from 'bcrypt'

export interface IUser {
    username: string,
    email: string,
    password: string,
    role: "admin" | "user",
    createdAt?: Date,
    updatedAt?: Date,
    _id?: mongoose.Types.ObjectId
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,

        required: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    }
}, {timestamps: true})

UserSchema.pre('save', async function(){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

const User = models?.User || model("User", UserSchema);

export default User