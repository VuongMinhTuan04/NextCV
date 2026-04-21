const SkeletonLine = ({
  width,
}: {
  width: string
}) => {
  return (
    <div
      className={`h-3 rounded-full bg-slate-200 ${width}`}
    />
  )
}

const SkeletonPost = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="animate-pulse">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-200" />

          <div className="flex-1 space-y-2">
            <SkeletonLine width="w-32" />
            <SkeletonLine width="w-20" />
          </div>
        </div>

        <div className="space-y-2">
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-11/12" />
          <SkeletonLine width="w-8/12" />
        </div>

        <div className="my-4 h-72 rounded-2xl bg-slate-200" />

        <div className="grid grid-cols-3 gap-3">
          <div className="h-10 rounded-xl bg-slate-200" />
          <div className="h-10 rounded-xl bg-slate-200" />
          <div className="h-10 rounded-xl bg-slate-200" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  )
}

const PageLoader = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="space-y-5">
        <SkeletonPost />
        <SkeletonPost />
      </div>
    </div>
  )
}

export default PageLoader