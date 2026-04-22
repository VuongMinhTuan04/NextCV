// pages/Information.tsx
import { useParams } from "react-router-dom"

import InformationCard from "../components/informations/InformationCard"
import InformationPosts from "../components/informations/InformationPosts"
import EditInformationModal from "../components/informations/EditInformation"
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
    closePasswordModal,
    setInformationField,
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
  } = useInformationPage(id)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {canEditInformation
            ? "Thông tin của bạn"
            : `Thông tin của ${information.fullName}`}
        </h1>
      </div>

      <InformationCard
        information={information}
        canEditInformation={canEditInformation}
        onEditInformation={openEditModal}
      />

      <InformationPosts
        posts={informationPosts}
        currentUser={viewerUser}
        onToggleLike={handleToggleLike}
        onDeletePost={handleDeletePost}
        onUpdatePost={handleUpdatePost}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onPreviewImage={openPreview}
      />

      {canEditInformation && (
        <>
          <EditInformationModal
            open={editOpen}
            form={editForm}
            errors={editErrors}
            onFieldChange={setInformationField}
            onAvatarChange={setAvatar}
            onUpdate={handleUpdateInformation}
            onOpenPassword={openPasswordModal}
            onClose={closeEditModal}
          />

          <ChangePasswordModal
            open={passwordOpen}
            form={passwordForm}
            errors={passwordErrors}
            strength={passwordStrength}
            onFieldChange={setPasswordField}
            onChangePassword={handleChangePassword}
            onBack={backToEditModal}
            onClose={closePasswordModal}
          />
        </>
      )}

      <ImagePreviewModal src={previewSrc} onClose={closePreview} />
    </div>
  )
}

export default Information