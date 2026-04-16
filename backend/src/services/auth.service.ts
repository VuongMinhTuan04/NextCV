import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const SALT_ROUNDS = 10;

export const signInService = async (data: any) => {
    const { email, password } = data;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if(!user) {
        throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );

    return { user, token };
}

export const signUpService = async (data: any) => {
    const { email, password, fullname, phone } = data;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if(existingUser) {
        throw new Error("Tài khoản đã tồn tại!");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        email: normalizedEmail,
        password: hashedPassword,
        fullname,
        phone
    });

    return user;
}

export const signOutService = async () => {
    return true;
}

export const forgotPasswordService = async () => {
    
}