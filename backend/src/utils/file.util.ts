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
        const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Upload failed"));
                }
                
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    resource_type: result.resource_type
                });
            }
        );

        Readable.from(file.buffer).pipe(stream);
    });

export const deleteFileFromCloudinary = async (
    publicId: string,
    resourceType: "image" | "raw"
) => {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
    });
};