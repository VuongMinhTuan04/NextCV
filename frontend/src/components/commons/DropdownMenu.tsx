import type { LucideIcon } from "lucide-react"
import { type ReactNode } from "react"

import { useDropdown } from "../../hooks/commons/useDropdown"

type Item = {
  label: string
  icon: LucideIcon
  onClick: () => void
  destructive?: boolean
}

type Props = {
  trigger: ReactNode
  items: Item[]
}

const DropdownMenu = ({
  trigger,
  items,
}: Props) => {
  const {
    open,
    toggle,
    close,
    dropdownRef,
  } = useDropdown()

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <div onClick={toggle} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100">
          {items.map((item) => {
            const Icon = item.icon

            const itemClass = item.destructive
              ? "text-red-500 hover:bg-red-50 hover:text-red-600"
              : "text-amber-500 hover:bg-amber-50 hover:text-amber-600"

            return (
              <button key={item.label} type="button"
                onClick={() => {
                  item.onClick()
                  close()
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${itemClass}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DropdownMenu