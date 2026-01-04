import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import ProjectHeader from '../components/project/ProjectHeader'
import ProjectInfo from '../components/project/ProjectInfo'
import ProjectComments from '../components/project/ProjectComments'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'
import { getProjectById } from '../api/projects.api'
import { addCommentToProject } from '../api/comments.api'
import { useProject, projectKeys } from '../hooks/useProjects'
import { useCurrentUser } from '../hooks/useUsers'
import { getMyApplicationsByStatus } from '../api/applications.api'
import ApplicationModal from '../components/ApplicationModal'
import MemberProfileModal from '../components/MemberProfileModal'
import { notificationKeys } from '../hooks/useNotifications'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS, SHADOWS } from '../constants/theme'
import { getButtonSize, getResponsiveSpacing, getResponsiveFontSizes } from '../utils/responsive'
import { updateLastVisitTime } from '../api/notifications.api'

function Project() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const rawProjectId = id || searchParams.get('id')
  // Filter out invalid IDs (undefined, null, or string "undefined"/"null")
  const projectId = rawProjectId && rawProjectId !== 'undefined' && rawProjectId !== 'null' ? rawProjectId : null
  const [project, setProject] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  
  // Member profile modal for comment authors
  const [selectedCommentAuthorId, setSelectedCommentAuthorId] = useState(null)
  const [selectedCommentAuthorName, setSelectedCommentAuthorName] = useState(null)
  const [isCommentAuthorModalOpen, setIsCommentAuthorModalOpen] = useState(false)
  const [isMembersExpanded, setIsMembersExpanded] = useState(false)
  const [userApplication, setUserApplication] = useState(null)
  const [checkingApplication, setCheckingApplication] = useState(true)
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()
  
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)
  const buttonSize = getButtonSize(isDesktop, 'lg')

  // Memoize comments array to prevent unnecessary recalculations
  // Must be called before any early returns to follow React Hooks rules
  const comments = useMemo(() => {
    if (!project?.comments) return []
    return Array.isArray(project.comments) 
      ? project.comments 
      : Array.from(project.comments)
  }, [project?.comments])

  // Memoize comment author click handler
  // Must be called before any early returns to follow React Hooks rules
  const handleCommentAuthorClick = useCallback((authorId, authorName) => {
    setSelectedCommentAuthorId(authorId)
    setSelectedCommentAuthorName(authorName)
    setIsCommentAuthorModalOpen(true)
  }, [])

  // Use React Query hooks with caching
  const queryClient = useQueryClient()
  const { data: projectData, isLoading: loadingProject, error: projectError, refetch: refetchProject } = useProject(projectId, {
    refetchInterval: 1000 * 10, // Poll every 10 seconds for new comments (like Telegram/LinkedIn)
    refetchIntervalInBackground: true, // Continue polling even when window is not focused
    staleTime: 1000 * 5, // Data becomes stale after 5 seconds for faster updates
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount
  })
  const { data: userData } = useCurrentUser()

  // Update local state when data changes and mark comments as viewed
  useEffect(() => {
    if (projectData) {
      setProject(projectData)
      // Update last visit time when viewing project (mark comments as viewed)
      // This prevents already viewed comments from being counted as new
      updateLastVisitTime()
      // Invalidate notifications cache to update badge immediately
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.count() 
      })
      // Also invalidate project-specific notification count
      if (projectId) {
        queryClient.invalidateQueries({ 
          queryKey: ['notifications', 'project', projectId, 'count'] 
        })
      }
    }
    if (userData) {
      setCurrentUser(userData)
    }
  }, [projectData, userData, projectId, queryClient])

  // Check if user has an application for this project
  useEffect(() => {
    if (!userData || !projectId) {
      setUserApplication(null)
      setCheckingApplication(false)
      return
    }

    setCheckingApplication(true)
    getMyApplicationsByStatus('PENDING', 0, 100)
      .then(applications => {
        const apps = applications.content || []
        const userApp = apps.find(app => 
          app.project && (app.project.id === projectId || String(app.project.id) === String(projectId))
        )
        setUserApplication(userApp || null)
        setCheckingApplication(false)
      })
      .catch(err => {
        setUserApplication(null)
        setCheckingApplication(false)
      })
  }, [userData, projectId])

  // Combine loading states (computed from React Query)
  const isLoading = loadingProject || checkingApplication
  const error = projectError?.message || (projectId ? null : 'Project ID is required')

  // Memoize comment submit handler
  const handleAddComment = useCallback(async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !projectId) return

    setSubmittingComment(true)
    try {
      await addCommentToProject(projectId, commentText.trim())
      toast.success(t('projects.commentAddedSuccess'))
      setCommentText('')
      
      // Invalidate React Query cache to refresh comments and notifications immediately
      queryClient.invalidateQueries({ 
        queryKey: projectKeys.detail(projectId) 
      })
      // Invalidate notifications so creator sees the new comment notification
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.count() 
      })
      
      // Also refetch immediately for better UX
      await refetchProject()
    } catch (err) {
      toast.error(err.message || t('projects.failedToAddComment'))
    } finally {
      setSubmittingComment(false)
    }
  }, [commentText, projectId, t, queryClient, refetchProject])

  // Check if user is creator (must be before early returns)
  const isCreator = useMemo(() => {
    if (!currentUser || !projectData?.creator) return false
    const creatorId = projectData.creator?.id || projectData.creator
    const userId = currentUser.id
    return String(creatorId) === String(userId)
  }, [currentUser, projectData?.creator])

  // Get members count (must be before early returns)
  const membersCount = useMemo(() => {
    if (!projectData?.members) return 0
    return Array.isArray(projectData.members) 
      ? projectData.members.length 
      : (projectData.members.size || 0)
  }, [projectData?.members])

  if (isLoading) {
    return (
      <div className="mw">
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content" style={{ padding: SPACING.xl }}>
            <LoadingSpinner message={t('projects.loadingProject') || 'Loading project...'} />
          </div>
          <Tabbar show='flex' />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="mw">
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content" style={{ padding: SPACING.xl }}>
            <ErrorState
              error={error}
              onRetry={() => {
                // Use React Query to refetch
                if (projectId) {
                  refetchProject()
                }
              }}
              retryLabel={t('common.retry') || 'Retry'}
              title={t('common.error') || 'Error'}
            />
          </div>
          <Tabbar show='flex' />
        </div>
      </div>
    )
  }
  
  if (!project) {
    return (
      <div className="mw">
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content" style={{ padding: SPACING.xl, textAlign: 'center' }}>
            <p style={{ 
              color: COLORS.textSecondary, 
              fontSize: fontSizes.lg,
              margin: 0
            }}>
              {t('projects.projectNotFound')}
            </p>
          </div>
          <Tabbar show='flex' />
        </div>
      </div>
    )
  }

  // Card style helper - улучшенные отступы и границы
  const cardStyle = {
    padding: isDesktop ? SPACING.xxl : SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.xl,
    border: `1px solid ${COLORS.borderPrimaryMedium}`,
    backdropFilter: 'blur(10px)',
    boxShadow: SHADOWS.md,
    marginBottom: spacing.xl,
    transition: `all ${TRANSITIONS.normal}`
  }

  return (
    <div className='mw'>
      <style>
        {`
          .project-textarea::placeholder {
            color: ${COLORS.textTertiary};
            opacity: 1;
          }
        `}
      </style>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content" style={{
          padding: isDesktop ? `0 ${SPACING.xxl} ${SPACING.xxl}` : `0 ${SPACING.lg} ${SPACING.lg}`,
          maxWidth: isDesktop ? '1200px' : '100%',
          margin: '0 auto'
        }}>
          {/* Header Card */}
          <div style={cardStyle}>
            <ProjectHeader
              project={project}
              projectId={projectId}
              currentUser={currentUser}
            />
          </div>

          {/* Project Info Card */}
          <div style={cardStyle}>
            <ProjectInfo project={project} />
            
            {/* Members Section */}
            {membersCount > 0 && (
              <div style={{
                marginTop: spacing.xl,
                paddingTop: spacing.xl,
                borderTop: `2px solid ${COLORS.borderPrimaryMedium}`
              }}>
                <button
                  onClick={() => setIsMembersExpanded(!isMembersExpanded)}
                  style={{
                    width: '100%',
                    padding: spacing.lg,
                    backgroundColor: COLORS.backgroundMedium,
                    color: COLORS.primary,
                    border: `2px solid ${COLORS.borderPrimaryMedium}`,
                    borderRadius: BORDER_RADIUS.lg,
                    fontSize: fontSizes.md,
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: `all ${TRANSITIONS.normal}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: spacing.sm,
                    boxShadow: SHADOWS.sm
                  }}
                  onMouseEnter={(e) => {
                    if (isDesktop) {
                      e.target.style.backgroundColor = COLORS.backgroundLight
                      e.target.style.borderColor = COLORS.borderPrimaryStrong
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = SHADOWS.md
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isDesktop) {
                      e.target.style.backgroundColor = COLORS.backgroundMedium
                      e.target.style.borderColor = COLORS.borderPrimaryMedium
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = SHADOWS.sm
                    }
                  }}
                  onTouchStart={(e) => {
                    if (!isDesktop) {
                      e.target.style.opacity = '0.8'
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (!isDesktop) {
                      e.target.style.opacity = '1'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <span style={{ fontSize: '1.25rem' }}>👥</span>
                    <span>{t('projects.viewMembers') || 'Members'} ({membersCount})</span>
                  </div>
                  {isMembersExpanded ? (
                    <MdExpandLess size={24} style={{ flexShrink: 0 }} />
                  ) : (
                    <MdExpandMore size={24} style={{ flexShrink: 0 }} />
                  )}
                </button>

                {/* Expanded Members List */}
                {isMembersExpanded && (() => {
                  const membersArray = project.members
                    ? (Array.isArray(project.members) 
                        ? project.members 
                        : Array.from(project.members))
                    : []
                  
                  const creatorId = project.creator?.id || project.creator

                  return (
                    <div style={{
                      marginTop: spacing.lg,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: spacing.lg,
                      animation: 'fadeIn 0.3s ease-in'
                    }}>
                      {membersArray.map((member, index) => {
                        const memberId = member.id || member
                        const memberName = member.username || member.name || member.email || `Участник ${index + 1}`
                        const memberEmail = member.email
                        const isMemberCreator = String(memberId) === String(creatorId)

                        return (
                          <div
                            key={memberId || index}
                            onClick={() => {
                              setSelectedCommentAuthorId(memberId)
                              setSelectedCommentAuthorName(memberName)
                              setIsCommentAuthorModalOpen(true)
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: spacing.xl,
                              backgroundColor: COLORS.backgroundMedium,
                              borderRadius: BORDER_RADIUS.lg,
                              cursor: 'pointer',
                              transition: `all ${TRANSITIONS.normal}`,
                              border: `2px solid ${COLORS.borderPrimary}`,
                              boxShadow: SHADOWS.sm,
                              overflow: 'hidden',
                              gap: spacing.md
                            }}
                            onMouseEnter={(e) => {
                              if (isDesktop) {
                                e.currentTarget.style.backgroundColor = COLORS.backgroundLight
                                e.currentTarget.style.borderColor = COLORS.borderPrimaryStrong
                                e.currentTarget.style.transform = 'translateX(4px)'
                                e.currentTarget.style.boxShadow = SHADOWS.md
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (isDesktop) {
                                e.currentTarget.style.backgroundColor = COLORS.backgroundMedium
                                e.currentTarget.style.borderColor = COLORS.borderPrimary
                                e.currentTarget.style.transform = 'translateX(0)'
                                e.currentTarget.style.boxShadow = SHADOWS.sm
                              }
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: spacing.md, 
                              flex: 1,
                              minWidth: 0,
                              overflow: 'hidden'
                            }}>
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
                              <div style={{ 
                                flex: 1, 
                                minWidth: 0,
                                overflow: 'hidden'
                              }}>
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
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0
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
                              color: COLORS.primary,
                              fontSize: fontSizes.sm,
                              fontWeight: '600',
                              padding: `${spacing.sm} ${spacing.md}`,
                              backgroundColor: COLORS.backgroundLight,
                              borderRadius: BORDER_RADIUS.md,
                              border: `1px solid ${COLORS.borderPrimary}`,
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              marginLeft: spacing.md
                            }}>
                              {isDesktop ? 'Просмотр →' : '→'}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Application Card - Show only if user is not creator and not member */}
          {currentUser && project.creator && (() => {
            const userId = currentUser.id
            
            // Check if user is a member
            const isMember = project.members && (
              Array.isArray(project.members)
                ? project.members.some(m => String(m.id || m) === String(userId))
                : Array.from(project.members || []).some(m => String(m.id || m) === String(userId))
            )
            
            if (isCreator || isMember) return null
            
            // Check application status
            if (checkingApplication) {
              return (
                <div style={cardStyle}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: COLORS.textTertiary, fontSize: fontSizes.md, margin: 0 }}>
                      {t('projects.checkingStatus') || 'Проверка статуса...'}
                    </p>
                  </div>
                </div>
              )
            }
            
            if (userApplication) {
              return (
                <div style={cardStyle}>
                  <div style={{ 
                    padding: spacing.lg,
                    backgroundColor: COLORS.backgroundMedium,
                    borderRadius: BORDER_RADIUS.lg,
                    border: `2px solid ${COLORS.borderPrimaryMedium}`,
                    textAlign: 'center'
                  }}>
                    <p style={{ 
                      color: COLORS.primary, 
                      margin: 0, 
                      fontWeight: '600',
                      fontSize: fontSizes.md
                    }}>
                      {t('projects.applicationPending') || 'Ваша заявка на рассмотрении'}
                    </p>
                  </div>
                </div>
              )
            }
            
            return (
              <div style={cardStyle}>
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <button
                    onClick={() => setIsApplicationModalOpen(true)}
                    style={{
                      ...buttonSize,
                      width: isDesktop ? 'auto' : '100%',
                      backgroundColor: COLORS.primary,
                      color: COLORS.textPrimary,
                      border: 'none',
                      borderRadius: BORDER_RADIUS.lg,
                      fontSize: fontSizes.md,
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: `all ${TRANSITIONS.normal}`,
                      boxShadow: SHADOWS.md,
                      padding: isDesktop ? `${spacing.md} ${spacing.xxl}` : spacing.md
                    }}
                    onMouseEnter={(e) => {
                      if (isDesktop) {
                        e.target.style.backgroundColor = COLORS.primaryHover
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = SHADOWS.lg
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isDesktop) {
                        e.target.style.backgroundColor = COLORS.primary
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = SHADOWS.md
                      }
                    }}
                    onTouchStart={(e) => {
                      if (!isDesktop) {
                        e.target.style.opacity = '0.8'
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (!isDesktop) {
                        e.target.style.opacity = '1'
                      }
                    }}
                  >
                    {t('projects.submitApplication') || 'Подать заявку на участие'}
                  </button>
                </div>
              </div>
            )
          })()}

          {/* Comments Card */}
          <div style={cardStyle}>
            <ProjectComments
              comments={comments}
              commentText={commentText}
              setCommentText={setCommentText}
              submittingComment={submittingComment}
              onSubmit={handleAddComment}
              onAuthorClick={handleCommentAuthorClick}
            />
          </div>
        </div>
        <Tabbar show='flex' />
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        projectId={projectId}
        onSuccess={() => {
          // Reload project and check applications
          getProjectById(projectId)
            .then(async (projectData) => {
              setProject(projectData)
              if (currentUser) {
                try {
                  const applications = await getMyApplicationsByStatus('PENDING', 0, 100)
                  const apps = applications.content || []
                  const userApp = apps.find(app => 
                    app.project && (app.project.id === projectId || String(app.project.id) === String(projectId))
                  )
                  setUserApplication(userApp || null)
                } catch (err) {
                }
              }
            })
            .catch(err => {
              toast.error(t('projects.reloadError') || 'Failed to reload project');
            })
        }}
      />

      {/* Comment Author Profile Modal */}
      <MemberProfileModal
        isOpen={isCommentAuthorModalOpen}
        onClose={() => {
          setIsCommentAuthorModalOpen(false)
          setSelectedCommentAuthorId(null)
          setSelectedCommentAuthorName(null)
        }}
        memberId={selectedCommentAuthorId}
        memberName={selectedCommentAuthorName}
      />

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

export {Project}
