import type { Attachment } from "../utils/file"

export type User = {
  id: string
  fullName: string
  avatar: string
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

export const currentUser: User = {
  id: "user-1",
  fullName: "Bee Nguyen",
  avatar: "https://i.pravatar.cc/100?img=13",
}

const anNguyen: User = {
  id: "user-2",
  fullName: "An Nguyen",
  avatar: "https://i.pravatar.cc/100?img=1",
}

const baoLe: User = {
  id: "user-3",
  fullName: "Bao Le",
  avatar: "https://i.pravatar.cc/100?img=3",
}

const randomComments = (postId: string, users: User[]): CommentItem[] => {
  const count = Math.floor(Math.random() * 3) + 1
  return Array.from({ length: count }, (_, i) => ({
    id: `${postId}-cmt-${i}`,
    user: users[Math.floor(Math.random() * users.length)],
    content: [
      "Bài viết hay quá!",
      "Cảm ơn bạn đã chia sẻ",
      "Rất hữu ích, mình sẽ áp dụng thử",
      "Cho mình hỏi thêm về phần này được không?",
      "Tuyệt vời!",
    ][Math.floor(Math.random() * 5)],
    createdAt: `${Math.floor(Math.random() * 10) + 1} giờ trước`,
  }))
}

const users = [currentUser, anNguyen, baoLe]

const basePosts: PostItem[] = [
  {
    id: "post-1",
    user: currentUser,
    title: "Mình đang build giao diện NextCV, tập trung vào clean UI và trải nghiệm mượt hơn.",
    createdAt: "2 giờ trước",
    attachment: {
      name: "preview-design.png",
      url: "https://picsum.photos/seed/nextcv-home-1/1200/800",
      kind: "image",
    },
    liked: false,
    likes: 12,
    comments: [
      {
        id: "cmt-1",
        user: anNguyen,
        content: "Layout này nhìn ổn đấy, tiếp tục polish phần post card nhé.",
        createdAt: "1 giờ trước",
      },
      {
        id: "cmt-2",
        user: currentUser,
        content: "Đang thêm comment, like và modal ảnh.",
        createdAt: "35 phút trước",
      },
    ],
  },
  {
    id: "post-2",
    user: anNguyen,
    title: "Mình vừa up file tài liệu demo, click vào sẽ mở PDF bằng trình duyệt mặc định.",
    createdAt: "5 giờ trước",
    attachment: {
      name: "demo-document.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      kind: "pdf",
    },
    liked: true,
    likes: 34,
    comments: [
      {
        id: "cmt-3",
        user: baoLe,
        content: "OK, mở file PDF như vậy là đúng ý rồi.",
        createdAt: "4 giờ trước",
      },
    ],
  },
  {
    id: "post-3",
    user: currentUser,
    title: "Mình vừa deploy thử nghiệm, tốc độ load cải thiện rõ rệt.",
    createdAt: "1 ngày trước",
    attachment: {
      name: "screenshot-speed.png",
      url: "https://picsum.photos/seed/perf/800/600",
      kind: "image",
    },
    liked: false,
    likes: 7,
    comments: [
      {
        id: "cmt-4",
        user: baoLe,
        content: "Có thể share config cụ thể không?",
        createdAt: "20 giờ trước",
      },
    ],
  },
]

const additionalPosts: PostItem[] = Array.from({ length: 12 }, (_, i) => {
  const user = users[i % users.length]
  const postId = `post-${i + 4}`
  const attachmentKinds = ["image", "pdf"] as const
  const kind = attachmentKinds[i % attachmentKinds.length]
  const attachment: Attachment | undefined =
    kind === "image"
      ? { name: `image-${i}.jpg`, url: `https://picsum.photos/seed/post${i + 4}/800/600`, kind: "image" }
      : { name: `document-${i}.pdf`, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", kind: "pdf" }

  return {
    id: postId,
    user,
    title: [
      "Chia sẻ kinh nghiệm phỏng vấn React",
      "Một vài mẹo tối ưu Tailwind CSS",
      "Hành trình học TypeScript của mình",
      "Cách mình tổ chức component trong dự án lớn",
      "Làm sao để viết CSS sạch hơn",
      "Review khóa học Next.js trên Udemy",
      "Mình vừa hoàn thành portfolio cá nhân",
      "Những sai lầm khi mới học React",
      "So sánh Zustand và Redux Toolkit",
      "Kinh nghiệm deploy ứng dụng lên Vercel",
      "Cách sử dụng React Query hiệu quả",
      "Tản mạn về nghề lập trình viên",
    ][i % 12],
    createdAt: `${i + 2} ngày trước`,
    attachment,
    liked: Math.random() > 0.5,
    likes: Math.floor(Math.random() * 50) + 1,
    comments: randomComments(postId, users),
  }
})

export const initialPosts: PostItem[] = [...basePosts, ...additionalPosts]

export const mockPosts = initialPosts