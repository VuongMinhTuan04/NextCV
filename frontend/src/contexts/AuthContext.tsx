import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import type { User } from "../services/mockPosts"
import { mockInformation, type InformationData } from "../services/mockInformation"

interface AuthContextType {
  currentUser: (User & InformationData) | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<(User & InformationData) | null>(null)
  const navigate = useNavigate()

  const login = useCallback((email: string, password: string) => {
    const user = mockInformation.find(u => u.email === email && u.password === password)
    if (user) {
      const loggedInUser: User & InformationData = {
        ...user,
        id: user.postOwnerId,
      }
      setCurrentUser(loggedInUser)
      toast.success("Đăng nhập thành công", { duration: 1000 })
      return true
    } else {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    toast.success("Đăng xuất thành công", { duration: 1000 })
    navigate("/")
  }, [navigate])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}