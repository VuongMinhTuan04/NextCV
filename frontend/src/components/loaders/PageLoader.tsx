type SkeletonLineProps = {
  width: string
}

const SkeletonLine = ({
  width,
}: SkeletonLineProps) => {
  return (
    <div
      className={`h-3 rounded-full bg-slate-200 ${width}`}
    />
  )
}

const SkeletonAction = () => {
  return (
    <div className="h-10 rounded-xl bg-slate-200" />
  )
}

const SkeletonPost = ({
  imageHeight,
}: {
  imageHeight: string
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
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

        <div className={`rounded-2xl bg-slate-200 ${imageHeight}`} />

        <div className="grid grid-cols-3 gap-3">
          <SkeletonAction />
          <SkeletonAction />
          <SkeletonAction />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70
        to-transparent animate-[shimmer_1.4s_linear_infinite]" />
    </div>
  )
}

const PageLoader = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <div className="space-y-5">
        <SkeletonPost imageHeight="h-72" />
        <SkeletonPost imageHeight="h-60" />
      </div>
    </div>
  )
}

export default PageLoader