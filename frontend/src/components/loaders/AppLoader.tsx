const AppLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EFF1F3]">
      <div className="mb-5 text-3xl font-bold text-blue-900">
        NextCV
      </div>

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-blue-500" />
      </div>
    </div>
  )
}

export default AppLoader