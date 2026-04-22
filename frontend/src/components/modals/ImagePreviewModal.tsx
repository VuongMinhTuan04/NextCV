import { X } from "lucide-react"

type Props = {
  src: string | null
  onClose: () => void
}

const ImagePreviewModal = ({
  src,
  onClose,
}: Props) => {
  if (!src) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 px-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng ảnh"
        className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <img
        src={src}
        alt="Preview"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="max-h-[85vh] max-w-[95vw] cursor-default rounded-2xl object-contain shadow-2xl"
      />
    </div>
  )
}

export default ImagePreviewModal