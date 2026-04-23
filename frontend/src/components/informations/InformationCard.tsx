import { Mail, Phone, PencilLine } from "lucide-react"

import type { InformationData } from "../../services/mockInformation"
import Avatar from "../commons/Avatar"

type Props = {
  information: InformationData
  canEditInformation: boolean
  onEditInformation: () => void
  onPreviewImage: (src: string) => void
}

const InformationCard = ({
  information,
  canEditInformation,
  onEditInformation,
  onPreviewImage,
}: Props) => {
  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm lg:max-w-3xl lg:mx-auto">
      <div className="bg-gradient-to-br from-white to-slate-50 px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4 sm:items-center sm:gap-5">
            <button
              type="button"
              onClick={() => onPreviewImage(information.avatar)}
              className="shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-1 shadow-sm cursor-pointer transition hover:opacity-80"
            >
              <Avatar
                src={information.avatar}
                alt={information.fullName}
                size="lg"
                className="h-20 w-20 border-4 border-white text-xl shadow-lg sm:h-24 sm:w-24"
              />
            </button>

            <div className="min-w-0 space-y-3 pt-1 sm:pt-0">
              <div className="space-y-1">
                <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {information.fullName}
                </h1>

                {information.about ? (
                  <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                    {information.about}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="truncate">{information.email}</span>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span>{information.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {canEditInformation && (
            <button
              type="button"
              onClick={onEditInformation}
              className="inline-flex cursor-pointer h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
            >
              <PencilLine className="h-4 w-4" />
              <span>Chỉnh sửa thông tin</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default InformationCard