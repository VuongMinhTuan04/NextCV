export interface ISignIn {
    email: string;
    password: string;
}

export interface ISignUp {
    email: string;
    password: string;
    fullname: string;
    phone: string;
}

export interface IForgotPasswordSendCode {
    email: string;
}

export interface IResetPassword {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}