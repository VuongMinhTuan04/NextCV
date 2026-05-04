import { useEffect } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { Toaster } from "sonner"

import InformationCard from "../components/informations/InformationCard"
import InformationPosts from "../components/informations/InformationPosts"
import EditInformation from "../components/informations/EditInformation"
import ChangePasswordModal from "../components/informations/ChangePasswordModal"
import ImagePreviewModal from "../components/modals/ImagePreviewModal"
import { useInformationPage } from "../hooks/informations/useInformationPage"
import { useAuth } from "../contexts/AuthContext"

const Information = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { logout, isAuthenticated, user } = useAuth()

  const profileId = id || user?.id

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
  } = useInformationPage(profileId)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`, {
        replace: true,
      })
      return
    }

    if (!id && user?.id) {
      navigate(`/information/${user.id}`, { replace: true })
    }
  }, [isAuthenticated, navigate, id, user?.id])

  const highlightPostId = searchParams.get("postId") || undefined
  const highlightCommentId = searchParams.get("commentId") || undefined

  if (!isAuthenticated) return null

  return (
    <>
      <Toaster position="top-right" richColors />

      <div className="mx-auto max-w-5xl space-y-5 p-6">
        <InformationCard
          information={information}
          canEditInformation={canEditInformation}
          onEditInformation={openEditModal}
          onPreviewImage={openPreview}
          onLogout={logout}
        />

        <InformationPosts
          posts={informationPosts}
          currentUser={viewerUser}
          ownerId={information.postOwnerId}
          ownerEmail={information.email}
          onToggleLike={handleToggleLike}
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          onPreviewImage={openPreview}
          highlightPostId={highlightPostId}
          highlightCommentId={highlightCommentId}
          isAuthenticated={isAuthenticated}
        />

        {canEditInformation && (
          <>
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
              onFieldChange={setPasswordField}
              onChangePassword={handleChangePassword}
              onBack={backToEditModal}
            />
          </>
        )}

        <ImagePreviewModal src={previewSrc} onClose={closePreview} />
      </div>
    </>
  )
}

export default Information