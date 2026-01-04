import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { 
  getApplicationsByProjectAndStatus, 
  approveApplication, 
  rejectApplication,
  getPendingCount
} from '../api/applications.api'
import MemberProfileModal from './MemberProfileModal'
import { useLanguage } from '../i18n/LanguageContext'
import { useViewMode } from '../viewmode/ViewModeContext'
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, TRANSITIONS, SHADOWS } from '../constants/theme'
import { getButtonSize, getResponsiveSpacing, getResponsiveFontSizes } from '../utils/responsive'
import { notificationKeys } from '../hooks/useNotifications'

/**
 * Component for managing project applications in admin panel.
 * Follows single responsibility principle - only handles application management UI.
 */
const ApplicationManagement = ({ projectId, onApplicationProcessed }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [activeTab, setActiveTab] = useState('PENDING') // PENDING, APPROVED, REJECTED
  const [processingId, setProcessingId] = useState(null)
  const { t } = useLanguage()
  const { isDesktop } = useViewMode()
  const queryClient = useQueryClient()
  
  const spacing = getResponsiveSpacing(isDesktop)
  const fontSizes = getResponsiveFontSizes(isDesktop)
  const buttonSize = getButtonSize(isDesktop, 'sm')
  
  // Member profile modal for applicant
  const [selectedApplicantId, setSelectedApplicantId] = useState(null)
  const [selectedApplicantName, setSelectedApplicantName] = useState(null)
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false)

  const loadApplications = useCallback(async (status) => {
    try {
      setLoading(true)
      const response = await getApplicationsByProjectAndStatus(projectId, status, 0, 100)
      const apps = response.content || []
      setApplications(apps)
    } catch (err) {
      toast.error(t('application.loadError') || 'Ошибка при загрузке заявок')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [projectId, t])

  const loadPendingCount = useCallback(async () => {
    try {
      const count = await getPendingCount(projectId)
      setPendingCount(count)
    } catch (err) {
    }
  }, [projectId])

  useEffect(() => {
    loadApplications(activeTab)
    if (activeTab === 'PENDING') {
      loadPendingCount()
    }
  }, [activeTab, loadApplications, loadPendingCount])

  const handleApprove = async (applicationId) => {
    if (processingId) return
    
    setProcessingId(applicationId)
    try {
      await approveApplication(applicationId)
      toast.success(t('application.approveSuccess') || 'Заявка одобрена! Пользователь добавлен в проект.')
      await loadApplications(activeTab)
      await loadPendingCount()
      
      // Invalidate React Query cache for notifications and project data
      queryClient.invalidateQueries({ 
        queryKey: ['notifications', 'project', projectId, 'count'] 
      })
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.count() 
      })
      // Invalidate project data to refresh members list
      queryClient.invalidateQueries({ 
        queryKey: ['projects', 'detail', projectId] 
      })
      // Invalidate user projects to update lists in Joined, Home, etc.
      queryClient.invalidateQueries({ 
        queryKey: ['users', 'current', 'projects'] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['users', 'current'] 
      })
      
      onApplicationProcessed?.()
    } catch (err) {
      toast.error(err.message || t('application.approveError') || 'Ошибка при одобрении заявки')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (applicationId) => {
    if (processingId) return
    
    if (!window.confirm(t('application.confirmReject') || 'Вы уверены, что хотите отклонить эту заявку?')) {
      return
    }
    
    setProcessingId(applicationId)
    try {
      await rejectApplication(applicationId)
      toast.success(t('application.rejectSuccess') || 'Заявка отклонена')
      await loadApplications(activeTab)
      await loadPendingCount()
      
      // Invalidate React Query cache for notifications and project data
      queryClient.invalidateQueries({ 
        queryKey: ['notifications', 'project', projectId, 'count'] 
      })
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.count() 
      })
      // Invalidate project data to refresh members list
      queryClient.invalidateQueries({ 
        queryKey: ['projects', 'detail', projectId] 
      })
      // Invalidate user projects to update lists in Joined, Home, etc.
      queryClient.invalidateQueries({ 
        queryKey: ['users', 'current', 'projects'] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['users', 'current'] 
      })
      
      onApplicationProcessed?.()
    } catch (err) {
      toast.error(err.message || t('application.rejectError') || 'Ошибка при отклонении заявки')
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div>
      <h2 style={{ 
        fontSize: fontSizes.xxl, 
        color: COLORS.textPrimary, 
        marginBottom: spacing.xl,
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: spacing.md,
        paddingBottom: spacing.md,
        borderBottom: `2px solid ${COLORS.borderPrimaryMedium}`
      }}>
        {t('application.management') || 'Управление заявками'}
        {activeTab === 'PENDING' && pendingCount > 0 && (
          <span style={{
            marginLeft: spacing.sm,
            padding: isDesktop ? `${SPACING.xs} ${SPACING.md}` : `${SPACING.sm} ${SPACING.lg}`,
            backgroundColor: COLORS.primary,
            borderRadius: BORDER_RADIUS.lg,
            fontSize: fontSizes.base,
            fontWeight: '600',
            minWidth: isDesktop ? 'auto' : '32px',
            minHeight: isDesktop ? 'auto' : '32px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {pendingCount}
          </span>
        )}
      </h2>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: isDesktop ? spacing.sm : spacing.xs, 
        marginBottom: spacing.xl,
        borderBottom: `2px solid ${COLORS.border}`,
        overflowX: isDesktop ? 'visible' : 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        position: 'relative'
      }}>
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            style={{
              padding: isDesktop ? `${SPACING.md} ${SPACING.xl}` : `${SPACING.lg} ${SPACING.md}`,
              minHeight: isDesktop ? 'auto' : '44px',
              backgroundColor: activeTab === status ? COLORS.primary : 'transparent',
              color: activeTab === status ? COLORS.textPrimary : COLORS.textTertiary,
              border: 'none',
              borderRadius: `${BORDER_RADIUS.md} ${BORDER_RADIUS.md} 0 0`,
              fontSize: fontSizes.md,
              fontWeight: '600',
              cursor: 'pointer',
              transition: `all ${TRANSITIONS.normal}`,
              borderBottom: activeTab === status ? `2px solid ${COLORS.primary}` : '2px solid transparent',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
              flex: isDesktop ? 'none' : '1 1 auto'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== status) {
                e.target.style.color = COLORS.textSecondary
                e.target.style.backgroundColor = COLORS.backgroundLight
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== status) {
                e.target.style.color = COLORS.textTertiary
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            {status === 'PENDING' && (t('application.pending') || 'На рассмотрении')}
            {status === 'APPROVED' && (t('application.approved') || 'Одобренные')}
            {status === 'REJECTED' && (t('application.rejected') || 'Отклоненные')}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: SPACING.xxl,
          color: COLORS.textTertiary
        }}>
          {t('application.loading') || 'Загрузка заявок...'}
        </div>
      ) : applications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: SPACING.xxl,
          color: COLORS.textDisabled,
          fontStyle: 'italic'
        }}>
          {t('application.noApplications') || 'Нет заявок со статусом'} "{activeTab === 'PENDING' ? (t('application.pending') || 'На рассмотрении') : activeTab === 'APPROVED' ? (t('application.approved') || 'Одобренные') : (t('application.rejected') || 'Отклоненные')}"
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
          {applications.map((application) => (
            <div
              key={application.id}
              style={{
                padding: SPACING.xl,
                backgroundColor: COLORS.backgroundMedium,
                borderRadius: BORDER_RADIUS.lg,
                border: `2px solid ${COLORS.borderPrimary}`,
                transition: `all ${TRANSITIONS.normal}`,
                boxShadow: SHADOWS.sm
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: SPACING.md
              }}>
                <div style={{ flex: 1 }}>
                  <div 
                    onClick={() => {
                      const applicantId = application.applicant?.id || application.applicant
                      const applicantName = application.applicant?.fullName || application.applicant?.username || t('common.unknown')
                      if (applicantId && applicantId !== 'null' && applicantId !== 'undefined') {
                        setSelectedApplicantId(applicantId)
                        setSelectedApplicantName(applicantName)
                        setIsApplicantModalOpen(true)
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: SPACING.md,
                      marginBottom: SPACING.sm,
                      cursor: application.applicant?.id ? 'pointer' : 'default',
                      transition: `all ${TRANSITIONS.normal}`
                    }}
                    onMouseEnter={(e) => {
                      if (application.applicant?.id) {
                        e.currentTarget.style.opacity = '0.8'
                        e.currentTarget.style.transform = 'translateX(4px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (application.applicant?.id) {
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.style.transform = 'translateX(0)'
                      }
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: BORDER_RADIUS.full,
                      backgroundColor: COLORS.backgroundLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.primary,
                      fontWeight: '600',
                      fontSize: FONT_SIZES.lg,
                      transition: `all ${TRANSITIONS.normal}`
                    }}>
                      {application.applicant?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ 
                        margin: 0, 
                        color: application.applicant?.id ? COLORS.primary : COLORS.textPrimary, 
                        fontWeight: '600',
                        fontSize: FONT_SIZES.md,
                        transition: `all ${TRANSITIONS.normal}`
                      }}>
                        {application.applicant?.fullName || application.applicant?.username || t('common.unknown')}
                        {application.applicant?.id && (
                          <span style={{ 
                            marginLeft: SPACING.sm,
                            fontSize: FONT_SIZES.sm,
                            color: COLORS.textTertiary
                          }}>
                            →
                          </span>
                        )}
                      </p>
                      <p style={{ 
                        margin: 0, 
                        color: COLORS.textTertiary, 
                        fontSize: FONT_SIZES.sm
                      }}>
                        @{application.applicant?.username || 'unknown'}
                      </p>
                    </div>
                  </div>
                  
                  {application.message && (
                    <p style={{ 
                      margin: `${SPACING.sm} 0 0 0`, 
                      color: COLORS.textSecondary,
                      fontSize: FONT_SIZES.base,
                      lineHeight: '1.5',
                      paddingLeft: '3.25rem'
                    }}>
                      "{application.message}"
                    </p>
                  )}
                </div>

                {activeTab === 'PENDING' && (
                  <div style={{ 
                    display: 'flex', 
                    gap: spacing.sm,
                    flexDirection: isDesktop ? 'row' : 'column',
                    width: isDesktop ? 'auto' : '100%'
                  }}>
                    <button
                      onClick={() => handleApprove(application.id)}
                      disabled={processingId === application.id}
                      style={{
                        ...buttonSize,
                        width: isDesktop ? 'auto' : '100%',
                        backgroundColor: processingId === application.id ? COLORS.disabled : COLORS.success,
                        color: COLORS.textPrimary,
                        border: 'none',
                        borderRadius: BORDER_RADIUS.md,
                        fontSize: fontSizes.sm,
                        fontWeight: '600',
                        cursor: processingId === application.id ? 'not-allowed' : 'pointer',
                        transition: `all ${TRANSITIONS.normal}`,
                        opacity: processingId === application.id ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (processingId !== application.id && isDesktop) {
                          e.target.style.backgroundColor = COLORS.successHover
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingId !== application.id && isDesktop) {
                          e.target.style.backgroundColor = COLORS.success
                        }
                      }}
                      onTouchStart={(e) => {
                        if (processingId !== application.id && !isDesktop) {
                          e.target.style.opacity = '0.8'
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (!isDesktop) {
                          e.target.style.opacity = processingId === application.id ? 0.6 : 1
                        }
                      }}
                    >
                      {t('application.approve') || 'Одобрить'}
                    </button>
                    <button
                      onClick={() => handleReject(application.id)}
                      disabled={processingId === application.id}
                      style={{
                        ...buttonSize,
                        width: isDesktop ? 'auto' : '100%',
                        backgroundColor: processingId === application.id ? COLORS.disabled : COLORS.error,
                        color: COLORS.textPrimary,
                        border: 'none',
                        borderRadius: BORDER_RADIUS.md,
                        fontSize: fontSizes.sm,
                        fontWeight: '600',
                        cursor: processingId === application.id ? 'not-allowed' : 'pointer',
                        transition: `all ${TRANSITIONS.normal}`,
                        opacity: processingId === application.id ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (processingId !== application.id && isDesktop) {
                          e.target.style.backgroundColor = COLORS.errorHover
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingId !== application.id && isDesktop) {
                          e.target.style.backgroundColor = COLORS.error
                        }
                      }}
                      onTouchStart={(e) => {
                        if (processingId !== application.id && !isDesktop) {
                          e.target.style.opacity = '0.8'
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (!isDesktop) {
                          e.target.style.opacity = processingId === application.id ? 0.6 : 1
                        }
                      }}
                    >
                      {t('application.reject') || 'Отклонить'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ 
                marginTop: SPACING.md, 
                paddingTop: SPACING.md,
                borderTop: `1px solid ${COLORS.border}`,
                fontSize: FONT_SIZES.xs,
                color: COLORS.textDisabled,
                paddingLeft: '3.25rem'
              }}>
                {t('application.submitted') || 'Подана'}: {formatDate(application.createdAt)}
                {application.reviewedAt && (
                  <span style={{ marginLeft: SPACING.lg }}>
                    {t('application.reviewed') || 'Рассмотрена'}: {formatDate(application.reviewedAt)}
                  </span>
                )}
                {application.reviewedBy && (
                  <span style={{ marginLeft: SPACING.lg }}>
                    {t('application.reviewedBy') || 'Рассмотрел'}: {application.reviewedBy.username || application.reviewedBy.fullName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Profile Modal */}
      <MemberProfileModal
        isOpen={isApplicantModalOpen}
        onClose={() => {
          setIsApplicantModalOpen(false)
          setSelectedApplicantId(null)
          setSelectedApplicantName(null)
        }}
        memberId={selectedApplicantId}
        memberName={selectedApplicantName}
      />
    </div>
  )
}

export default ApplicationManagement
