import { useState } from "react"

import { useProfile } from "../features/information/hooks/useProfile"
import ProfileCard from "../features/information/components/ProfileCard"
import InformationPosts from "../features/information/components/InformationPosts"
import EditProfileModal from "../features/information/components/EditProfileModal"
import ChangePasswordModal from "../features/information/components/ChangePasswordModal"

const Information = () => {
  const { profile, setProfile } = useProfile()

  const [openEdit, setOpenEdit] = useState(false)
  const [openPassword, setOpenPassword] = useState(false)

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <ProfileCard profile={profile} onEdit={() => setOpenEdit(true)} />

        <InformationPosts profile={profile} />
      </div>

      <EditProfileModal
        open={openEdit}
        profile={profile}
        onClose={() => setOpenEdit(false)}
        onSubmit={(data) =>
          setProfile((prev) => ({ ...prev, ...data }))
        }
        onChangePassword={() => {
          setOpenEdit(false)
          setOpenPassword(true)
        }}
      />

      <ChangePasswordModal
        open={openPassword}
        onBack={() => {
          setOpenPassword(false)
          setOpenEdit(true)
        }}
      />
    </>
  )
}

export default Information