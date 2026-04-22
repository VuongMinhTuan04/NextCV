import {
  Download,
  ExternalLink,
  FileBadge,
  FileText,
} from "lucide-react"

import type { Attachment } from "../../utils/file"

type Props = {
  attachment?: Attachment
  onPreviewImage: (src: string) => void
}

const PostMedia = ({
  attachment,
  onPreviewImage,
}: Props) => {
  if (!attachment) return null

  if (attachment.kind === "image") {
    return (
      <button type="button" onClick={() => onPreviewImage(attachment.url)} className="mt-4 block w-full cursor-pointer
        overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50 transition hover:opacity-95"
      >
        <img src={attachment.url} alt={attachment.name} className="h-auto w-full object-cover" />
      </button>
    )
  }

  if (attachment.kind === "pdf") {
    return (
      <a href={attachment.url} target="_blank" rel="noreferrer" className="mt-4 flex cursor-pointer items-center
        justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 transition hover:bg-rose-100"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-rose-600">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-rose-700">
              {attachment.name}
            </p>
            <p className="text-xs text-slate-500">
              Nhấn để mở file PDF
            </p>
          </div>
        </div>

        <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
      </a>
    )
  }

  return (
    <a href={attachment.url} download={attachment.name} className="mt-4 flex cursor-pointer items-center justify-between
      gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 transition hover:bg-sky-100"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sky-600">
          <FileBadge className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sky-700">
            {attachment.name}
          </p>
          <p className="text-xs text-slate-500">
            Nhấn để tải file Word
          </p>
        </div>
      </div>

      <Download className="h-4 w-4 shrink-0 text-slate-400" />
    </a>
  )
}

export default PostMedia