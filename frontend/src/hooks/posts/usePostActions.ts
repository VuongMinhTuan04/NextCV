import { useEffect, useState } from "react"

export const usePostActions = (initialTitle: string) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(initialTitle)

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(initialTitle)
    }
  }, [initialTitle, isEditing])

  const startEdit = () => setIsEditing(true)

  const cancelEdit = () => {
    setDraftTitle(initialTitle)
    setIsEditing(false)
  }

  const hasChanges = draftTitle.trim() !== initialTitle.trim()

  return {
    isEditing,
    draftTitle,
    setDraftTitle,
    hasChanges,
    startEdit,
    cancelEdit,
    setIsEditing,
  }
}