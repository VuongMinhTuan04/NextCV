import type { ButtonHTMLAttributes } from "react"

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

const IconButton = ({
  active = false,
  className = "",
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? "" : ""
      } ${className}`}
      {...props}
    />
  )
}

export default IconButton