export type AttachmentKind = "image" | "pdf" | "word"

export type Attachment = {
  name: string
  url: string
  kind: AttachmentKind
}

export const getAttachmentKind = (
  file: File | null
): AttachmentKind | null => {
  if (!file) return null

  const { type, name } = file
  const lowerName = name.toLowerCase()

  if (type.startsWith("image/")) {
    return "image"
  }

  if (
    type === "application/pdf" ||
    lowerName.endsWith(".pdf")
  ) {
    return "pdf"
  }

  if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".doc") ||
    lowerName.endsWith(".docx")
  ) {
    return "word"
  }

  return null
}

export const isSupportedFile = (
  file: File | null
) => {
  return getAttachmentKind(file) !== null
}

export const buildAttachment = (
  file: File
): Attachment => {
  const kind = getAttachmentKind(file)

  if (!kind) {
    throw new Error("Unsupported file type")
  }

  return {
    name: file.name,
    url: URL.createObjectURL(file),
    kind,
  }
}