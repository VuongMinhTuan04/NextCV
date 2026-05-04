import axios from "axios"

import type { PostItem } from "../types/post"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  withCredentials: true,
})

const jsonConfig = {
  headers: {
    "Content-Type": "application/json",
  },
}

export type AuthUserResponse = {
  _id?: string
  id?: string
  email: string
  fullname?: string
  fullName?: string
  bio?: string
  avatar?: string
  phone?: string
  role?: string
}

export type ApiResponse<T> = {
  message: string
  data?: T
}

export type SignInPayload = {
  email: string
  password: string
  rememberMe?: boolean
}

export type SignUpPayload = {
  email: string
  password: string
  fullname: string
  phone: string
}

export type InformationSearchItem = {
  id: string
  fullName: string
  avatar: string
}

export type InformationProfile = {
  id: string
  fullName: string
  email: string
  phone: string
  about: string
  avatar: string
}

export type ChangePasswordPayload = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export const authApi = {
  signIn: async (payload: SignInPayload) => {
    const response = await api.post<ApiResponse<AuthUserResponse>>("/auth/sign-in", payload, jsonConfig)
    return response.data
  },

  signUp: async (payload: SignUpPayload) => {
    const response = await api.post<ApiResponse<AuthUserResponse>>("/auth/sign-up", payload, jsonConfig)
    return response.data
  },

  signOut: async () => {
    const response = await api.post<ApiResponse<null>>("/auth/sign-out")
    return response.data
  },

  sendForgotPasswordCode: async (email: string) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/forgot-password/send-code",
      { email },
      jsonConfig
    )
    return response.data
  },

  verifyForgotPasswordCode: async (email: string, code: string) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/forgot-password/verify-code",
      { email, code },
      jsonConfig
    )
    return response.data
  },

  resetForgotPassword: async (
    email: string,
    code: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await api.patch<ApiResponse<null>>(
      "/auth/forgot-password/reset",
      {
        email,
        code,
        newPassword,
        confirmPassword,
      },
      jsonConfig
    )
    return response.data
  },
}

export const informationApi = {
  searchUsers: async (fullname: string) => {
    const response = await api.get<ApiResponse<InformationSearchItem[]>>("/information/search", {
      params: { fullname },
    })
    return response.data
  },

  getInformationById: async (id: string) => {
    const response = await api.get<ApiResponse<InformationProfile>>(`/information/${id}`)
    return response.data
  },

  updateMyInformation: async (payload: FormData) => {
    const response = await api.patch<ApiResponse<InformationProfile>>(
      "/information/me",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await api.patch<ApiResponse<null>>(
      "/information/change-password",
      payload,
      jsonConfig
    )
    return response.data
  },
}

export const postApi = {
  getPosts: async (page = 1, limit = 5, userId?: string) => {
    const response = await api.get<ApiResponse<PostItem[]>>("/post", {
      params: { page, limit, ...(userId ? { userId } : {}) },
    })
    return response.data
  },

  createPost: async (payload: FormData) => {
    const response = await api.post<ApiResponse<PostItem>>("/post/create", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}

export default api