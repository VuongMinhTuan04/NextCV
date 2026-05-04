import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            minLength: 6,
            required: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true
        },
        avatar: {
            type: String,
            default: "user.png"
        },
        phone: {
            type: String,
            maxLength: 11,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        bio: {
            type: String,
            trim: true,
            maxLength: 255,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema, "Users");