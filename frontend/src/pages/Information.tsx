import { useParams } from "react-router-dom"
import { Toaster } from "sonner"

import InformationCard from "../components/informations/InformationCard"
import InformationPosts from "../components/informations/InformationPosts"
import EditInformation from "../components/informations/EditInformation"
import ChangePasswordModal from "../components/informations/ChangePasswordModal"
import ImagePreviewModal from "../components/modals/ImagePreviewModal"
import { useInformationPage } from "../hooks/informations/useInformationPage"

const Information = () => {
  const { id } = useParams()

  const {
    information,
    informationPosts,
    viewerUser,
    canEditInformation,
    editOpen,
    passwordOpen,
    editForm,
    editErrors,
    passwordForm,
    passwordErrors,
    passwordStrength,
    previewSrc,
    openPreview,
    closePreview,
    openEditModal,
    closeEditModal,
    openPasswordModal,
    backToEditModal,
    setField,
    setAvatar,
    handleUpdateInformation,
    setPasswordField,
    handleChangePassword,
    handleToggleLike,
    handleDeletePost,
    handleUpdatePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    isEditDirty,
  } = useInformationPage(id)

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="mx-auto max-w-5xl space-y-5 p-6">
        <InformationCard
          information={information}
          canEditInformation={canEditInformation}
          onEditInformation={openEditModal}
        />

        <InformationPosts
          posts={informationPosts}
          currentUser={viewerUser}
          ownerId={information.postOwnerId}
          onToggleLike={handleToggleLike}
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          onPreviewImage={openPreview}
        />

        <EditInformation
          open={editOpen}
          form={editForm}
          errors={editErrors}
          onFieldChange={setField}
          onAvatarChange={setAvatar}
          onUpdate={handleUpdateInformation}
          onOpenPassword={openPasswordModal}
          onClose={closeEditModal}
          isDirty={isEditDirty}
        />

        <ChangePasswordModal
          open={passwordOpen}
          form={passwordForm}
          errors={passwordErrors}
          strength={passwordStrength}
          onFieldChange={setPasswordField}
          onChangePassword={handleChangePassword}
          onBack={backToEditModal}
        />

        <ImagePreviewModal src={previewSrc} onClose={closePreview} />
      </div>
    </>
  )
}

export default Information