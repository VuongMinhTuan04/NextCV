import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
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
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);