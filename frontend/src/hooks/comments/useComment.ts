import { useMemo, useState } from "react"

import {
  getAttachmentKind,
  type AttachmentKind,
} from "../../utils/file"

export const useComment = () => {
  const [content, setContent] = useState("")
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
    setContent("")
    setFile(null)
    setFileKind(null)
  }

  const canSend = useMemo(() => {
    return content.trim() !== ""
  }, [content])

  return {
    content,
    setContent,
    file,
    fileName: file?.name ?? "",
    fileKind,
    canSend,
    selectFile,
    removeFile,
    reset,
  }
}