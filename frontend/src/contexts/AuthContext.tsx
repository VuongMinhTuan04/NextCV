import axios from "axios"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { authApi, type AuthUserResponse } from "../services/api"

export type AuthUser = {
  id: string
  email: string
  fullName: string
  bio: string
  avatar: string
  phone: string
  role: string
}

type LoginResult = {
  ok: boolean
  message?: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<LoginResult>
  logout: () => Promise<void>
  setUser: Dispatch<SetStateAction<AuthUser | null>>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const LOCAL_STORAGE_KEY = "nextcv_auth_user"
const SESSION_STORAGE_KEY = "nextcv_auth_user_session"
const STORAGE_MODE_KEY = "nextcv_auth_storage_mode"

type StorageMode = "local" | "session" | null

const normalizeUser = (data: AuthUserResponse): AuthUser => {
  return {
    id: String(data._id ?? data.id ?? ""),
    email: data.email ?? "",
    fullName: data.fullName ?? data.fullname ?? "",
    bio: data.bio ?? "",
    avatar: data.avatar ?? "",
    phone: data.phone ?? "",
    role: data.role ?? "user",
  }
}

const readStoredAuth = (): { user: AuthUser | null; mode: StorageMode } => {
  const localRaw = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (localRaw) {
    try {
      const parsed = JSON.parse(localRaw) as AuthUser
      if (parsed && typeof parsed === "object") {
        return { user: parsed, mode: "local" }
      }
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }

  const sessionRaw = sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (sessionRaw) {
    try {
      const parsed = JSON.parse(sessionRaw) as AuthUser
      if (parsed && typeof parsed === "object") {
        return { user: parsed, mode: "session" }
      }
    } catch {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }

  return { user: null, mode: null }
}

const clearStoredAuth = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
  localStorage.removeItem(STORAGE_MODE_KEY)
}

const storeUser = (user: AuthUser, rememberMe: boolean) => {
  clearStoredAuth()

  if (rememberMe) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(STORAGE_MODE_KEY, "local")
    return
  }

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
  localStorage.setItem(STORAGE_MODE_KEY, "session")
}

const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === "string" && message.trim()) return message
  }

  return "Sai tài khoản hoặc mật khẩu"
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [storageMode, setStorageMode] = useState<StorageMode>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = readStoredAuth()
    setUser(stored.user)
    setStorageMode(stored.mode)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    if (!user) {
      clearStoredAuth()
      setStorageMode(null)
      return
    }

    if (storageMode === "local") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem(STORAGE_MODE_KEY, "local")
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      return
    }

    if (storageMode === "session") {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem(STORAGE_MODE_KEY, "session")
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }, [user, storageMode, hydrated])

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<LoginResult> => {
    try {
      const result = await authApi.signIn({ email, password, rememberMe })

      if (!result.data) {
        return { ok: false, message: "Đăng nhập thất bại" }
      }

      const nextUser = normalizeUser(result.data)
      setStorageMode(rememberMe ? "local" : "session")
      setUser(nextUser)
      storeUser(nextUser, rememberMe)

      return { ok: true }
    } catch (error) {
      return {
        ok: false,
        message: getApiErrorMessage(error),
      }
    }
  }

  const logout = async () => {
    try {
      await authApi.signOut()
    } finally {
      clearStoredAuth()
      setStorageMode(null)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return ctx
}