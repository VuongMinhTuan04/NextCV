import { Readable } from "node:stream";
import cloudinary from "../configs/cloudinary";
import { FILE_TYPE, FileType } from "../constants/fileType";

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export const isAllowedFile = (mimeType: string) => {
    return ALLOWED_MIME_TYPES.has(mimeType);
}

export const getFileType = (mimeType: string): FileType => {
    if(mimeType.startsWith("image/")) {
        return FILE_TYPE.IMAGE;
    }

    if(mimeType === "application/pdf") {
        return FILE_TYPE.PDF;
    }

    return FILE_TYPE.DOC;
}

export const uploadFileToCloudinary = (
    file: Express.Multer.File,
    folder = "posts"
) => new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                
                resolve(result);
            }
        );

        Readable.from(file.buffer).pipe(stream);
    });