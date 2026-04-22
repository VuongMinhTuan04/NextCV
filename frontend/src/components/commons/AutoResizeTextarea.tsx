import type { TextareaHTMLAttributes } from "react"
import { useEffect } from "react"

import { useAutoResizeTextarea } from "../../hooks/commons/useAutoResizeTextarea"

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

const AutoResizeTextarea = ({
  value = "",
  className = "",
  ...props
}: Props) => {
  const { textareaRef, resizeTextarea } = useAutoResizeTextarea(String(value))

  useEffect(() => {
    resizeTextarea()
  }, [resizeTextarea, value])

  return (
    <textarea ref={textareaRef} rows={1} value={value} className={`resize-none overflow-hidden leading-6 ${className}`}
      {...props}
    />
  )
}

export default AutoResizeTextarea