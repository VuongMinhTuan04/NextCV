export interface ISearchInformationQuery {
    fullname?: string;
}

export interface IUpdateInformation {
    fullName: string;
    phone: string;
    about?: string;
    avatar?: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IInformationSearchItem {
    id: string;
    fullName: string;
    avatar: string;
}

export interface IInformationProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    about: string;
    avatar: string;
}