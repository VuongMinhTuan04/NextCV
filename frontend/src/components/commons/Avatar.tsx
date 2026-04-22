import type { ImgHTMLAttributes } from "react"

type AvatarProps = {
  src?: string
  alt: string
  size?: "sm" | "md" | "lg"
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

const Avatar = ({ src, alt, size = "md", className = "", ...rest }: AvatarProps) => {
  const initials = alt
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (!src) {
    return (
      <div className={`${sizeMap[size]} ${className} grid place-items-center rounded-full bg-slate-200 text-xs
        font-semibold text-slate-600`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img src={src} alt={alt} className={`${sizeMap[size]} ${className} rounded-full object-cover`} {...rest} />
  )
}

export default Avatar