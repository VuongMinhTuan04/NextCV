export type InformationData = {
  id: string
  postOwnerId: string
  fullName: string
  email: string
  phone: string
  about: string
  avatar: string
  password: string
}

export const mockInformation: InformationData[] = [
  {
    id: "1",
    postOwnerId: "user-1",
    fullName: "Bee Nguyen",
    email: "bee.nguyen@example.com",
    phone: "0987654321",
    about:
      "Tập trung xây dựng giao diện gọn, dễ dùng và mượt. Mục tiêu tạo sản phẩm đẹp, thực tế và dễ mở rộng.",
    avatar: "https://i.pravatar.cc/500?img=13",
    password: "123456",
  },
  {
    id: "2",
    postOwnerId: "user-2",
    fullName: "An Nguyen",
    email: "an.nguyen@example.com",
    phone: "0901234567",
    about:
      "Yêu thích UI/UX rõ ràng, tinh gọn. Quan tâm cách sản phẩm truyền tải cảm xúc qua bố cục và màu sắc.",
    avatar: "https://i.pravatar.cc/500?img=1",
    password: "123456",
  },
  {
    id: "3",
    postOwnerId: "user-3",
    fullName: "Bao Le",
    email: "bao.le@example.com",
    phone: "0912345678",
    about:
      "Quan tâm logic sản phẩm và khả năng scale. Ưu tiên rõ ràng, hiệu quả và tính bền vững.",
    avatar: "https://i.pravatar.cc/500?img=3",
    password: "123456",
  },
]

export const getInformationById = (id?: string) => {
  return mockInformation.find((profile) => profile.postOwnerId === id) ?? mockInformation[0]
}