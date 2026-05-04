import type { Attachment } from "../utils/file"

export type User = {
  id: string
  fullName: string
  avatar: string
  email?: string
}

export type CommentItem = {
  id: string
  user: User
  content: string
  createdAt: string
  attachment?: Attachment
}

export type PostItem = {
  id: string
  user: User
  title: string
  createdAt: string
  attachment?: Attachment
  liked: boolean
  likes: number
  comments: CommentItem[]
}