export type EditInformationField = "fullName" | "phone" | "about"

export type EditInformationFormState = {
  email: string
  fullName: string
  phone: string
  about: string
  avatar: string
}

export type EditInformationErrors = Partial<Record<EditInformationField, string>>

export type ChangePasswordFormState = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangePasswordErrors = Partial<Record<keyof ChangePasswordFormState, string>>

export type PasswordStrengthState = {
  score: 0 | 1 | 2 | 3
  label: string
}

export const normalizeSpaces = (value: string) => value.replace(/\s+/g, " ").trim()

export const buildPasswordStrength = (value: string): PasswordStrengthState => {
  if (!value) return { score: 0, label: "Chưa nhập" }

  let score = 0
  if (value.length >= 6) score += 1
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1

  const final = Math.min(score, 3) as 0 | 1 | 2 | 3

  return {
    score: final,
    label: final <= 1 ? "Yếu" : final === 2 ? "Trung bình" : "Mạnh",
  }
}

export const validateEditForm = (form: EditInformationFormState) => {
  const errors: EditInformationErrors = {}

  const fullName = normalizeSpaces(form.fullName)
  const phone = form.phone.replace(/\D/g, "")
  const about = form.about.replace(/\r\n/g, "\n")
  const aboutLines = about.split("\n").length

  if (!fullName) {
    errors.fullName = "Vui lòng nhập họ và tên."
  } else if (fullName.length < 2) {
    errors.fullName = "Họ và tên phải có ít nhất 2 ký tự."
  } else if (!/^[\p{L}\s]+$/u.test(fullName)) {
    errors.fullName = "Họ và tên không được chứa số hoặc ký tự đặc biệt."
  }

  if (!phone) {
    errors.phone = "Vui lòng nhập số điện thoại."
  } else if (phone.length < 10) {
    errors.phone = "Số điện thoại phải có ít nhất 10 số."
  }

  if (about.length > 100) {
    errors.about = "Mô tả tối đa 100 ký tự."
  } else if (aboutLines > 2) {
    errors.about = "Mô tả chỉ được tối đa 2 dòng."
  }

  return errors
}

export const validatePasswordForm = (
  form: ChangePasswordFormState
) => {
  const errors: ChangePasswordErrors = {}

  if (!form.oldPassword.trim()) {
    errors.oldPassword = "Vui lòng nhập mật khẩu cũ."
  }

  if (!form.newPassword.trim()) {
    errors.newPassword = "Vui lòng nhập mật khẩu mới."
  } else if (form.newPassword.length < 6) {
    errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự."
  } else if (form.newPassword === form.oldPassword) {
    errors.newPassword = "Mật khẩu mới phải khác mật khẩu cũ."
  }

  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = "Vui lòng xác nhận mật khẩu."
  } else if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp."
  }

  return errors
}