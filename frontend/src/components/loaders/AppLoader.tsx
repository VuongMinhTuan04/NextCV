const AppLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#EFF1F3] px-4">
      <div className="animate-[fadeIn_.45s_ease] text-center">
        <h1 className="text-4xl font-semibold tracking-wide text-blue-900">
          NextCV
        </h1>

        <div className="mx-auto mt-5 h-1 w-44 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 rounded-full bg-blue-500 animate-[loaderBar_1.1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}

export default AppLoader