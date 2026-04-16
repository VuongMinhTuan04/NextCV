export enum FILE_TYPE {
    IMAGE = "image",
    PDF = "pdf",
    DOC = "doc"
}

export type FileType = (typeof FILE_TYPE)[keyof typeof FILE_TYPE];