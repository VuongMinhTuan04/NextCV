import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {
    IForgotPasswordSendCode,
    IResetPassword,
    ISignIn,
    ISignUp
} from "../interfaces/auth.interface";
import PasswordReset from "../models/PasswordReset";
import { sendResetCodeMail } from "../utils/mail.util";
import {
    MINUTE_TO_MS,
    RESET_CODE_MAX,
    RESET_CODE_MIN,
    SECOND_TO_MS
} from "../constants/forgotPassword";

const SALT_ROUNDS = 10;

export const signInService = async (data: ISignIn) => {
    const { email, password, rememberMe = false } = data;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Sai tài khoản hoặc mật khẩu");
    }

    const expiresIn = rememberMe ? "7d" : "1d";

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn }
    );

    return { user, token, rememberMe }
}

export const signUpService = async (data: ISignUp) => {
    const { email, password, fullname, phone, bio } = data;
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
        phone,
        bio: bio ?? ""
    });

    return user;
}

export const signOutService = async () => {
    return true;
}

const generateResetCode = () => {
    // Generate random 6-digit code from 100000 -> 999999
    return Math.floor(RESET_CODE_MIN + Math.random() * RESET_CODE_MAX).toString();
}

const getResetExpireMinutes = () => {
    return Number(process.env.RESET_CODE_EXPIRES_MINUTES || 5);
}

const getResendSeconds = () => {
    return Number(process.env.RESEND_CODE_SECONDS || 60);
}

export const sendForgotPasswordCodeService = async (data: IForgotPasswordSendCode) => {
    const normalizedEmail = data.email.trim().toLowerCase();

    const latestReset = await PasswordReset.findOne({ email: normalizedEmail })
        .sort({ createdAt: -1 });

    if (latestReset) {
        const diffMs = Date.now() - latestReset.sentAt.getTime();
        // Convert resend seconds config to milliseconds
        const resendLimitMs = getResendSeconds() * SECOND_TO_MS;

        if (diffMs < resendLimitMs) {
            // Convert remaining milliseconds to seconds and round up
            const waitSeconds = Math.ceil((resendLimitMs - diffMs) / SECOND_TO_MS);
            throw new Error(`Please wait ${waitSeconds} seconds before requesting a new code`);
        }
    }

    await PasswordReset.deleteMany({ email: normalizedEmail });

    const code = generateResetCode();
    const now = new Date();
    // Expire time = current time + N minutes
    const expiresAt = new Date(Date.now() + getResetExpireMinutes() * MINUTE_TO_MS);

    await PasswordReset.create({
        email: normalizedEmail,
        code,
        sentAt: now,
        expiresAt,
        isVerified: false,
        verifiedAt: null
    });

    await sendResetCodeMail(normalizedEmail, code);

    return true;
}

export const verifyForgotPasswordCodeService = async (data: { email: string; code: string }) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const trimmedCode = data.code.trim();

    const resetRecord = await PasswordReset.findOne({ email: normalizedEmail })
        .sort({createdAt: -1});

    if (!resetRecord) {
        throw new Error("Mã xác nhận không đúng");
    }

    if (resetRecord.expiresAt.getTime() < Date.now()) {
        await PasswordReset.deleteMany({ email: normalizedEmail });
        throw new Error("Mã xác nhận đã hết hạn");
    }

    if (resetRecord.code !== trimmedCode) {
        throw new Error("Mã xác nhận không đúng");
    }

    resetRecord.isVerified = true;
    resetRecord.verifiedAt = new Date();
    await resetRecord.save();

    return true;
}

export const resetForgotPasswordService = async (data: IResetPassword) => {
    const { email, newPassword, confirmPassword } = data;
    const normalizedEmail = email.trim().toLowerCase();

    if (newPassword !== confirmPassword) {
        throw new Error("Xác nhận mật khẩu không đúng");
    }

    const resetRecord = await PasswordReset.findOne({email: normalizedEmail})
        .sort({ createdAt: -1 });

    if (!resetRecord || !resetRecord.isVerified) {
        throw new Error("Mã xác nhận không hợp lệ");
    }

    if (resetRecord.expiresAt.getTime() < Date.now()) {
        await PasswordReset.deleteMany({ email: normalizedEmail });
        throw new Error("Mã xác nhận đã hết hạn");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        throw new Error("Mã xác nhận không hợp lệ");
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    await user.save();

    await PasswordReset.deleteMany({ email: normalizedEmail });

    return true;
}