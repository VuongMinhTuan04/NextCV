import { useMemo, useState } from "react"

import {
  getAttachmentKind,
  type AttachmentKind,
} from "../../utils/file"

export const useCreatePost = () => {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileKind, setFileKind] =
    useState<AttachmentKind | null>(null)

  const selectFile = (nextFile: File | null) => {
    if (!nextFile) {
      setFile(null)
      setFileKind(null)
      return
    }

    setFile(nextFile)
    setFileKind(getAttachmentKind(nextFile))
  }

  const removeFile = () => {
    setFile(null)
    setFileKind(null)
  }

  const reset = () => {
    setTitle("")
    setFile(null)
    setFileKind(null)
  }

  const canSubmit = useMemo(() => {
    return title.trim() !== "" && file !== null
  }, [title, file])

  return {
    title,
    setTitle,
    file,
    fileName: file?.name ?? "",
    fileKind,
    canSubmit,
    selectFile,
    removeFile,
    reset,
  }
}