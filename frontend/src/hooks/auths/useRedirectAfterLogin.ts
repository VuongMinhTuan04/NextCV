import { useSearchParams, useNavigate } from "react-router-dom"

export const useRedirectAfterLogin = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const goToRedirect = () => {
    const redirect = searchParams.get("redirect")
    if (redirect) {
      navigate(redirect, { replace: true })
    } else {
      navigate("/", { replace: true })
    }
  }

  return { goToRedirect }
}