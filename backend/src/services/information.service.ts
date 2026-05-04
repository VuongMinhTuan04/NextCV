import bcrypt from "bcrypt";
import User from "../models/User";
import type {
    IChangePassword,
    IInformationProfile,
    IInformationSearchItem,
    IUpdateInformation,
} from "../interfaces/information.interface";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../utils/file.util";

const normalizeSpaces = (value: string) => value.replace(/\s+/g, " ").trim();
const normalizeAbout = (value: string) => value.replace(/\r\n/g, "\n").trim();
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const updateInformationCooldownMap = new Map<string, number>();

const buildVietnameseRegex = (keyword: string) => {
    const map: Record<string, string> = {
        a: "aàáạảãâầấậẩẫăằắặẳẵ",
        e: "eèéẹẻẽêềếệểễ",
        i: "iìíịỉĩ",
        o: "oòóọỏõôồốộổỗơờớợởỡ",
        u: "uùúụủũưừứựửữ",
        y: "yỳýỵỷỹ",
        d: "dđ",
    }

    return keyword
        .toLowerCase()
        .split("")
        .map((char) => {
            const group = map[char]
            return group ? `[${group}]` : escapeRegex(char)
        })
        .join("");
}

const buildSearchRegex = (fullname?: string) => {
    const keyword = normalizeSpaces(fullname ?? "");

    if (!keyword) {
        return null;
    }

    const pattern = keyword
        .split(" ")
        .filter(Boolean)
        .map(buildVietnameseRegex)
        .join("\\s+");

    return new RegExp(`(^|\\s)${pattern}`, "i");
}

const mapToProfile = (user: any): IInformationProfile => {
    return {
        id: String(user._id),
        fullName: user.fullname ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        about: user.bio ?? "",
        avatar: user.avatar ?? "user.png",
    }
}

export const searchFullnameUserService = async (
    fullname?: string
): Promise<IInformationSearchItem[]> => {
    const regex = buildSearchRegex(fullname);

    if (!regex) {
        return [];
    }

    const users = await User.find({ fullname: { $regex: regex } })
        .select("_id fullname avatar")
        .sort({ fullname: 1 })
        .limit(10)
        .lean();

    return users.map((user: any) => ({
        id: String(user._id),
        fullName: user.fullname ?? "",
        avatar: user.avatar ?? "user.png",
    }));
}

export const getInformationByIdService = async (
    id: string
): Promise<IInformationProfile> => {
    const user = await User.findById(id)
        .select("_id fullname email phone avatar bio")
        .lean();

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    return mapToProfile(user);
}

export const updateMyInformationService = async (
    userId: string,
    data: IUpdateInformation,
    file?: Express.Multer.File
): Promise<IInformationProfile> => {
    const now = Date.now();
    const lastUpdateAt = updateInformationCooldownMap.get(userId) ?? 0;

    if (now - lastUpdateAt < 3000) {
        throw new Error("Vui lòng chờ vài giây trước khi cập nhật lại");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    const fullName = normalizeSpaces(data.fullName ?? "");
    const phone = String(data.phone ?? "").replace(/\D/g, "");
    const about = normalizeAbout(data.about ?? "");

    if (!fullName) {
        throw new Error("Họ và tên là bắt buộc");
    }

    if (fullName.length < 2 || fullName.length > 50) {
        throw new Error("Họ và tên phải từ 2 đến 50 ký tự");
    }

    if (!/^[\p{L}\s]+$/u.test(fullName)) {
        throw new Error("Họ và tên chỉ chứa chữ cái");
    }

    if (!phone) {
        throw new Error("Số điện thoại là bắt buộc");
    }

    if (!/^\d+$/.test(phone)) {
        throw new Error("Số điện thoại chỉ chứa chữ số");
    }

    if (phone.length < 10) {
        throw new Error("Số điện thoại phải có ít nhất 10 chữ số");
    }

    if (phone.length > 11) {
        throw new Error("Số điện thoại không được vượt quá 11 chữ số");
    }

    if (about.length > 100) {
        throw new Error("Mô tả tối đa 100 ký tự");
    }

    if (about.split("\n").length > 2) {
        throw new Error("Mô tả chỉ được tối đa 2 dòng");
    }

    user.fullname = fullName;
    user.phone = phone;
    user.bio = about;

    if (file) {
        const oldAvatar = user.avatar;

        const uploadedFile = await uploadFileToCloudinary(file, "NextCV/avatars");
        user.avatar = uploadedFile.secure_url;

        await user.save();

        if (oldAvatar && oldAvatar !== user.avatar) {
            const publicId = oldAvatar.split("/upload/")[1]?.replace(/^v\d+\//, "")?.split(".")[0];
            if (publicId) {
                try {
                    await deleteFileFromCloudinary(publicId, "image");
                } catch {}
            }
        }

        updateInformationCooldownMap.set(userId, now);
        return mapToProfile(user);
    }

    await user.save();
    updateInformationCooldownMap.set(userId, now);

    return mapToProfile(user);
}

export const changeMyPasswordService = async (
    userId: string,
    data: IChangePassword
): Promise<true> => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    const oldPassword = data.oldPassword?.trim();
    const newPassword = data.newPassword?.trim();
    const confirmPassword = data.confirmPassword?.trim();

    if (!oldPassword) {
        throw new Error("Vui lòng nhập mật khẩu cũ");
    }

    if (!newPassword) {
        throw new Error("Vui lòng nhập mật khẩu mới");
    }

    if (newPassword.length < 6) {
        throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    if (oldPassword === newPassword) {
        throw new Error("Mật khẩu mới phải khác mật khẩu cũ");
    }

    if (!confirmPassword) {
        throw new Error("Vui lòng xác nhận mật khẩu");
    }

    if (newPassword !== confirmPassword) {
        throw new Error("Mật khẩu xác nhận không khớp");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu cũ không đúng");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
}