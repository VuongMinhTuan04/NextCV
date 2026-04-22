export type InformationData = {
  id: string
  postOwnerId: string
  fullName: string
  email: string
  phone: string
  description: string
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
    description: "Frontend Developer yêu thích UI sạch, tối giản và trải nghiệm mượt.",
    about:
      "Mình tập trung xây dựng giao diện tinh gọn, dễ dùng và có chiều sâu. Mục tiêu của mình là tạo ra sản phẩm vừa đẹp vừa thực tế, có thể mở rộng tốt về sau.",
    avatar: "https://i.pravatar.cc/200?img=13",
    password: "123456",
  },
  {
    id: "2",
    postOwnerId: "user-2",
    fullName: "An Nguyen",
    email: "an.nguyen@example.com",
    phone: "0901234567",
    description: "UI/UX Designer thích hệ thống thiết kế rõ ràng và tinh gọn.",
    about:
      "Mình yêu thích cách một sản phẩm truyền tải cảm xúc qua bố cục, màu sắc và chi tiết nhỏ. Mục tiêu là giữ mọi thứ đơn giản nhưng vẫn đủ cảm giác cao cấp.",
    avatar: "https://i.pravatar.cc/200?img=1",
    password: "123456",
  },
  {
    id: "3",
    postOwnerId: "user-3",
    fullName: "Bao Le",
    email: "bao.le@example.com",
    phone: "0912345678",
    description: "Product thinker mê logic sản phẩm và khả năng mở rộng.",
    about:
      "Mình thích nhìn sản phẩm từ góc độ người dùng, business và khả năng scale lâu dài. Mình ưu tiên sự rõ ràng, hiệu quả và tính bền vững trong từng quyết định.",
    avatar: "https://i.pravatar.cc/200?img=3",
    password: "123456",
  },
]

export const getInformationById = (id?: string) => {
  return mockInformation.find((profile) => profile.id === id) ?? mockInformation[0]
}