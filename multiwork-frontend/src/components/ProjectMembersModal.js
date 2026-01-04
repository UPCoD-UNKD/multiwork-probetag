import React, { useState, useCallback, useRef, useEffect } from 'react'
import { MdClose, MdDelete, MdPerson } from 'react-icons/md'
import { removeMemberFromProject } from '../api/projects.api'
import { toast } from 'react-toastify'
import { useLanguage } from '../i18n/LanguageContext'
import { useViewMode } from '../viewmode/ViewModeContext'
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS, SHADOWS, Z_INDEX } from '../constants/theme'
import { getResponsiveSpacing, getResponsiveFontSizes } from '../utils/responsive'
import { useKeyboardNavigation, useFocusTrap } from '../hooks/useKeyboardNavigation'
import MemberProfileModal from './MemberProfileModal'
import LoadingSpinner from './LoadingSpinner'
import { logError } from '../utils/logger'

/**
 * Modal component for managing project members
 * Follows single responsibility principle - only handles member management UI
 */
const ProjectMembersModal = ({ 
  isOpen, 
  onClose, 
  project, 
  currentUser,
  onMemberRemoved 
}) => {
  const [removingMemberId, setRemovingMemberId] = useState(null)
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [selectedMemberName, setSelectedMemberName] = useState(null)
  const [isMemberProfileModalOpen, setIsMemberProfileModalOpen] = useState(false)
  const { t } = useLanguage()
  const { isDesktop } = useViewMode()
  const modalRef = useRef(null)

  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: onClose,
    enabled: isOpen
  })

  // Focus trap for accessibility
  useFocusTrap(isOpen, modalRef)

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRemovingMemberId(null)
      setSelectedMemberId(null)
      setSelectedMemberName(null)
    }
  }, [isOpen])

  // Check if current user is creator
  const isCreator = useCallback(() => {
    if (!currentUser || !project?.creator) return false
    const creatorId = project.creator?.id || project.creator
    const userId = currentUser.id
    return String(creatorId) === String(userId)
  }, [currentUser, project?.creator])

  // Handle member removal
  const handleRemoveMember = useCallback(async (memberId, memberName) => {
    if (!isCreator()) {
      toast.error(t('projects.noPermission') || 'У вас нет прав для удаления участников')
      return
    }

    if (!window.confirm(
      t('projects.confirmRemoveMember') || 
      `Вы уверены, что хотите исключить ${memberName} из проекта?`
    )) {
      return
    }

    setRemovingMemberId(memberId)
    try {
      await removeMemberFromProject(project.id, memberId)
      toast.success(t('projects.memberRemoved') || 'Участник успешно исключен из проекта')
      onMemberRemoved?.()
    } catch (err) {
      logError('Failed to remove member:', err)
      toast.error(err.message || t('projects.failedToRemoveMember') || 'Не удалось исключить участника')
    } finally {
      setRemovingMemberId(null)
    }
  }, [project?.id, isCreator, t, onMemberRemoved])

  // Handle member profile click
  const handleMemberClick = useCallback((memberId, memberName) => {
    setSelectedMemberId(memberId)
    setSelectedMemberName(memberName)
    setIsMemberProfileModalOpen(true)
  }, [])

  if (!isOpen) return null

  // Get members array
  const membersArray = project?.members
    ? (Array.isArray(project.members) 
        ? project.members 
        : Array.from(project.members))
    : []

  const creatorId = project?.creator?.id || project?.creator

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.overlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: Z_INDEX.modal,
          padding: SPACING.lg,
          backdropFilter: 'blur(5px)'
        }}
        onClick={onClose}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-members-modal-title"
          style={{
            backgroundColor: COLORS.background,
            borderRadius: BORDER_RADIUS.xl,
            padding: isDesktop ? SPACING.xxl : SPACING.lg,
            maxWidth: isDesktop ? '700px' : '100%',
            width: '100%',
            maxHeight: isDesktop ? '90vh' : '95vh',
            overflowY: 'auto',
            position: 'relative',
            border: `2px solid ${COLORS.borderPrimaryMedium}`,
            boxShadow: SHADOWS.lg,
            margin: isDesktop ? 0 : SPACING.md
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.xxl,
            paddingBottom: spacing.xl,
            borderBottom: `2px solid ${COLORS.borderPrimaryMedium}`
          }}>
            <h2
              id="project-members-modal-title"
              style={{
                color: COLORS.textPrimary,
                margin: 0,
                fontSize: fontSizes.xxl,
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👥</span>
              {t('projects.projectMembers') || 'Project Members'}
              <span style={{
                marginLeft: spacing.sm,
                fontSize: fontSizes.md,
                fontWeight: '600',
                color: COLORS.primary,
                backgroundColor: COLORS.backgroundMedium,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: BORDER_RADIUS.md
              }}>
                {membersArray.length}
              </span>
            </h2>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: spacing.md,
                right: spacing.md,
                background: 'none',
                border: 'none',
                color: COLORS.textPrimary,
                fontSize: fontSizes.xl,
                cursor: 'pointer',
                padding: isDesktop ? SPACING.sm : SPACING.md,
                minWidth: isDesktop ? 'auto' : '44px',
                minHeight: isDesktop ? 'auto' : '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: BORDER_RADIUS.full,
                transition: `all ${TRANSITIONS.normal}`
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = COLORS.backgroundLight
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
              aria-label={t('common.close') || 'Close'}
            >
              <MdClose />
            </button>
          </div>

          {/* Members List */}
          {membersArray.length === 0 ? (
            <div style={{
              padding: spacing.xxl,
              textAlign: 'center',
              color: COLORS.textTertiary,
              fontStyle: 'italic'
            }}>
              {t('projects.noMembers') || 'Участники отсутствуют'}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.lg
            }}>
              {membersArray.map((member, index) => {
                const memberId = member.id || member
                const memberName = member.username || member.name || member.email || `Участник ${index + 1}`
                const memberEmail = member.email
                const isMemberCreator = String(memberId) === String(creatorId)
                const canRemove = isCreator() && !isMemberCreator

                return (
                  <div
                    key={memberId || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: spacing.xl,
                      backgroundColor: COLORS.backgroundMedium,
                      borderRadius: BORDER_RADIUS.lg,
                      border: `2px solid ${COLORS.borderPrimary}`,
                      transition: `all ${TRANSITIONS.normal}`,
                      boxShadow: SHADOWS.sm,
                      overflow: 'hidden',
                      gap: spacing.md
                    }}
                    onMouseEnter={(e) => {
                      if (isDesktop) {
                        e.currentTarget.style.borderColor = COLORS.borderPrimaryStrong
                        e.currentTarget.style.boxShadow = SHADOWS.md
                        e.currentTarget.style.transform = 'translateX(4px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isDesktop) {
                        e.currentTarget.style.borderColor = COLORS.borderPrimary
                        e.currentTarget.style.boxShadow = SHADOWS.sm
                        e.currentTarget.style.transform = 'translateX(0)'
                      }
                    }}
                  >
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: spacing.md,
                        flex: 1,
                        cursor: 'pointer',
                        minWidth: 0,
                        overflow: 'hidden'
                      }}
                      onClick={() => handleMemberClick(memberId, memberName)}
                    >
                      <div style={{
                        width: isDesktop ? '48px' : '44px',
                        height: isDesktop ? '48px' : '44px',
                        borderRadius: '50%',
                        backgroundColor: COLORS.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: COLORS.textPrimary,
                        fontWeight: '700',
                        fontSize: fontSizes.lg,
                        boxShadow: SHADOWS.sm,
                        flexShrink: 0
                      }}>
                        {memberName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          marginBottom: spacing.xs
                        }}>
                          <div style={{
                            color: COLORS.textPrimary,
                            fontWeight: '600',
                            fontSize: fontSizes.md,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {memberName}
                          </div>
                          {isMemberCreator && (
                            <span style={{
                              padding: `${spacing.xs} ${spacing.sm}`,
                              backgroundColor: COLORS.primary,
                              color: COLORS.textPrimary,
                              borderRadius: BORDER_RADIUS.sm,
                              fontSize: fontSizes.xs,
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              whiteSpace: 'nowrap'
                            }}>
                              {t('projects.creator') || 'Creator'}
                            </span>
                          )}
                        </div>
                        {memberEmail && (
                          <div style={{
                            color: COLORS.textTertiary,
                            fontSize: fontSizes.sm,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {memberEmail}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      flexShrink: 0,
                      marginLeft: spacing.md
                    }}>
                      {canRemove && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveMember(memberId, memberName)
                          }}
                          disabled={removingMemberId === memberId}
                          style={{
                            padding: spacing.sm,
                            backgroundColor: removingMemberId === memberId
                              ? COLORS.backgroundDark
                              : COLORS.backgroundLight,
                            color: COLORS.error,
                            border: `2px solid ${removingMemberId === memberId ? COLORS.border : COLORS.error}`,
                            borderRadius: BORDER_RADIUS.md,
                            cursor: removingMemberId === memberId ? 'not-allowed' : 'pointer',
                            fontSize: fontSizes.lg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: isDesktop ? '40px' : '44px',
                            height: isDesktop ? '40px' : '44px',
                            transition: `all ${TRANSITIONS.normal}`,
                            opacity: removingMemberId === memberId ? 0.5 : 1,
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            if (removingMemberId !== memberId && isDesktop) {
                              e.target.style.backgroundColor = COLORS.backgroundMedium
                              e.target.style.borderColor = COLORS.errorHover
                              e.target.style.transform = 'scale(1.1)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isDesktop) {
                              e.target.style.backgroundColor = removingMemberId === memberId
                                ? COLORS.backgroundDark
                                : COLORS.backgroundLight
                              e.target.style.borderColor = removingMemberId === memberId
                                ? COLORS.border
                                : COLORS.error
                              e.target.style.transform = 'scale(1)'
                            }
                          }}
                          title={t('projects.removeMember') || 'Исключить из проекта'}
                        >
                          {removingMemberId === memberId ? (
                            <LoadingSpinner />
                          ) : (
                            <MdDelete />
                          )}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMemberClick(memberId, memberName)
                        }}
                        style={{
                          padding: `${spacing.sm} ${spacing.md}`,
                          backgroundColor: COLORS.backgroundLight,
                          color: COLORS.primary,
                          border: `2px solid ${COLORS.borderPrimary}`,
                          borderRadius: BORDER_RADIUS.md,
                          cursor: 'pointer',
                          fontSize: fontSizes.sm,
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                          transition: `all ${TRANSITIONS.normal}`,
                          minHeight: isDesktop ? '40px' : '44px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          if (isDesktop) {
                            e.target.style.backgroundColor = COLORS.backgroundMedium
                            e.target.style.borderColor = COLORS.borderPrimaryStrong
                            e.target.style.transform = 'translateY(-2px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isDesktop) {
                            e.target.style.backgroundColor = COLORS.backgroundLight
                            e.target.style.borderColor = COLORS.borderPrimary
                            e.target.style.transform = 'translateY(0)'
                          }
                        }}
                      >
                        <MdPerson />
                        <span style={{ display: isDesktop ? 'inline' : 'none' }}>
                          {t('common.profile') || 'Profile'}
                        </span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Member Profile Modal */}
      <MemberProfileModal
        isOpen={isMemberProfileModalOpen}
        onClose={() => {
          setIsMemberProfileModalOpen(false)
          setSelectedMemberId(null)
          setSelectedMemberName(null)
        }}
        memberId={selectedMemberId}
        memberName={selectedMemberName}
      />
    </>
  )
}

export default ProjectMembersModal
