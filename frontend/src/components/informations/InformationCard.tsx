import { Mail, Phone, PencilLine } from "lucide-react"

import type { InformationData } from "../../services/mockInformation"
import Avatar from "../commons/Avatar"

type Props = {
  information: InformationData
  canEditInformation: boolean
  onEditInformation: () => void
}

const InformationCard = ({
  information,
  canEditInformation,
  onEditInformation,
}: Props) => {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-white to-slate-50 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-5">
            <div className="rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-1 shadow-sm">
              <Avatar
                src={information.avatar}
                alt={information.fullName}
                size="lg"
                className="h-24 w-24 border-4 border-white text-2xl shadow-lg"
              />
            </div>

            <div className="min-w-0 space-y-3">
              <div>
                <h1 className="truncate text-3xl font-semibold tracking-tight text-slate-900">
                  {information.fullName}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {information.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="truncate">{information.email}</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <PencilLine className="h-4 w-4" />
              <span>Chỉnh sửa thông tin</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-5 sm:px-8">
        <p className="text-sm leading-7 text-slate-600">{information.about}</p>
      </div>
    </section>
  )
}

export default InformationCard