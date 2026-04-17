import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

export const sendResetCodeMail = async (to: string, code: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        throw new Error("Email service is not configured");
    }

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Mã xác nhận đặt lại mật khẩu NextCV",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
                <h2>Đặt lại mật khẩu</h2>

                <p>Xin chào,</p>

                <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản NextCV.</p>

                <p>Mã xác nhận của bạn là:</p>

                <h1 style="letter-spacing: 6px; font-size: 32px;">
                    ${code}
                </h1>

                <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>

                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>

                <br />

                <p>Trân trọng,<br/>NextCV</p>
            </div>
        `
    });
};