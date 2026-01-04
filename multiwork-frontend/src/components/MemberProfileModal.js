import React, { useState, useEffect, useCallback, useRef } from 'react'
import { MdClose, MdLink, MdEmail } from 'react-icons/md'
import { getUserById } from '../api/users.api'
import { logError } from '../utils/logger'
import { useLanguage } from '../i18n/LanguageContext'
import { useViewMode } from '../viewmode/ViewModeContext'
import LoadingSpinner from './LoadingSpinner'
import { COLORS, SPACING, BORDER_RADIUS, TRANSITIONS, Z_INDEX } from '../constants/theme'
import '../components/profile/ProfileLinks.css'
import { getResponsiveSpacing, getResponsiveFontSizes } from '../utils/responsive'
import { useKeyboardNavigation, useFocusTrap } from '../hooks/useKeyboardNavigation'

/**
 * Modal component for viewing a project member's profile.
 * Displays user information, skills, and links.
 */
const MemberProfileModal = ({ isOpen, onClose, memberId, memberName }) => {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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

  const loadMemberProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const userData = await getUserById(memberId)
      setMember(userData)
    } catch (err) {
      logError('Failed to load member profile:', err)
      setError(err.message || t('memberProfile.loadError') || 'Не удалось загрузить профиль участника')
    } finally {
      setLoading(false)
    }
  }, [memberId, t])

  useEffect(() => {
    if (isOpen && memberId) {
      loadMemberProfile()
    } else {
      // Reset state when modal closes
      setMember(null)
      setError(null)
    }
  }, [isOpen, memberId, loadMemberProfile])

  if (!isOpen) return null

  return (
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
        padding: SPACING.lg
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: COLORS.background,
          borderRadius: BORDER_RADIUS.xl,
          padding: isDesktop ? SPACING.xxl : SPACING.lg,
          maxWidth: isDesktop ? '600px' : '100%',
          width: '100%',
          maxHeight: isDesktop ? '90vh' : '95vh',
          overflowY: 'auto',
          position: 'relative',
          border: `2px solid ${COLORS.borderPrimaryMedium}`,
          margin: isDesktop ? 0 : SPACING.md
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
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
        >
          <MdClose />
        </button>

        {/* Header */}
        <h2 
          id="member-profile-modal-title"
          style={{ 
            color: COLORS.textPrimary, 
            marginBottom: spacing.xl,
            fontSize: fontSizes.xxl,
            fontWeight: '600',
            paddingRight: isDesktop ? 0 : SPACING.xxl
          }}
        >
          {t('memberProfile.title') || 'Профиль участника'}
        </h2>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: spacing.xxl }}>
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div style={{ 
            color: COLORS.error, 
            padding: spacing.lg,
            backgroundColor: COLORS.backgroundLight,
            borderRadius: BORDER_RADIUS.md,
            marginBottom: spacing.lg,
            fontSize: fontSizes.md
          }}>
            {error}
          </div>
        )}

        {member && !loading && (
          <div>
            {/* User Name */}
            <div style={{ marginBottom: spacing.xl }}>
              <h3 style={{ 
                color: COLORS.primary, 
                fontSize: fontSizes.xl,
                marginBottom: spacing.sm
              }}>
                {member.username || memberName || t('common.unknown')}
              </h3>
              {member.email && (
                <p style={{ 
                  color: COLORS.textSecondary, 
                  fontSize: fontSizes.md,
                  wordBreak: 'break-word'
                }}>
                  <MdEmail style={{ display: 'inline', marginRight: spacing.sm }} />
                  {member.email}
                </p>
              )}
            </div>

            {/* Bio/Description */}
            {member.bio && (
              <div style={{ marginBottom: spacing.xl }}>
                <h4 style={{ 
                  color: COLORS.textPrimary, 
                  marginBottom: spacing.sm,
                  fontSize: fontSizes.lg,
                  fontWeight: '600'
                }}>
                  {t('memberProfile.about') || 'О себе'}
                </h4>
                <p style={{ 
                  color: COLORS.textSecondary, 
                  lineHeight: isDesktop ? '1.6' : '1.5',
                  padding: spacing.lg,
                  backgroundColor: COLORS.backgroundLight,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: fontSizes.md,
                  wordBreak: 'break-word'
                }}>
                  {member.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {(() => {
              const skills = member.skills
              if (!skills) return null
              const skillsArray = Array.isArray(skills) ? skills : (skills.size > 0 ? Array.from(skills) : [])
              if (skillsArray.length === 0) return null
              
              return (
                <div style={{ marginBottom: spacing.xl }}>
                  <h4 style={{ 
                    color: COLORS.textPrimary, 
                    marginBottom: spacing.md,
                    fontSize: fontSizes.lg,
                    fontWeight: '600'
                  }}>
                    {t('memberProfile.skills') || 'Навыки'}
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: spacing.sm
                  }}>
                    {skillsArray.map((skill, index) => (
                      <span
                        key={skill.id || index}
                        style={{
                          padding: isDesktop ? `${SPACING.sm} ${SPACING.lg}` : `${SPACING.md} ${SPACING.lg}`,
                          backgroundColor: COLORS.backgroundLight,
                          color: COLORS.primary,
                          borderRadius: BORDER_RADIUS.md,
                          fontSize: fontSizes.md,
                          border: `1px solid ${COLORS.borderPrimaryStrong}`,
                          minHeight: isDesktop ? 'auto' : '36px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Links */}
            {(() => {
              const links = member.links
              if (!links) return null
              const linksArray = Array.isArray(links) ? links : (links.size > 0 ? Array.from(links) : [])
              if (linksArray.length === 0) return null
              
              return (
                <div style={{ marginBottom: spacing.xl }}>
                  <h4 style={{ 
                    color: COLORS.textPrimary, 
                    marginBottom: spacing.md,
                    fontSize: fontSizes.lg,
                    fontWeight: '600'
                  }}>
                    {t('memberProfile.links') || 'Ссылки'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {linksArray.map((link, index) => {
                      const linkUrl = link.reference || link.url || (typeof link === 'string' ? link : null)
                      const linkName = link.title || link.name || linkUrl || `${t('memberProfile.link') || 'Ссылка'} ${index + 1}`
                      
                      if (!linkUrl) return null
                      
                      return (
                        <a
                          key={index}
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="profile-link"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                            padding: isDesktop ? SPACING.md : SPACING.lg,
                            minHeight: isDesktop ? 'auto' : '44px',
                            backgroundColor: COLORS.backgroundLight,
                            borderRadius: BORDER_RADIUS.md,
                            color: '#6EE5F0',
                            textDecoration: 'underline',
                            fontWeight: '500',
                            transition: `all ${TRANSITIONS.normal}`,
                            border: `1px solid ${COLORS.borderPrimary}`,
                            fontSize: fontSizes.md,
                            wordBreak: 'break-word'
                          }}
                          onMouseEnter={(e) => {
                            if (isDesktop) {
                              e.target.style.backgroundColor = COLORS.backgroundMedium
                              e.target.style.borderColor = COLORS.borderPrimaryStrong
                              e.target.style.color = '#ffffff'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isDesktop) {
                              e.target.style.backgroundColor = COLORS.backgroundLight
                              e.target.style.borderColor = COLORS.borderPrimary
                              e.target.style.color = '#6EE5F0'
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
                          <MdLink style={{ flexShrink: 0 }} />
                          <span>{linkName}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Social Media */}
            {(() => {
              const socialMedia = member.socialMediaSet || member.socialMedia
              if (!socialMedia) return null
              const socialMediaArray = Array.isArray(socialMedia) ? socialMedia : (socialMedia.size > 0 ? Array.from(socialMedia) : [])
              if (socialMediaArray.length === 0) return null
              
              return (
                <div style={{ marginBottom: spacing.xl }}>
                  <h4 style={{ 
                    color: COLORS.textPrimary, 
                    marginBottom: spacing.md,
                    fontSize: fontSizes.lg,
                    fontWeight: '600'
                  }}>
                    {t('memberProfile.socialMedia') || 'Социальные сети'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    {socialMediaArray.map((social, index) => {
                      const socialUrl = social.referenceSocialMedia || social.url || (typeof social === 'string' ? social : null)
                      const socialName = social.name || social.platform || socialUrl || `${t('memberProfile.social') || 'Соцсеть'} ${index + 1}`
                      
                      if (!socialUrl) return null
                      
                      return (
                        <a
                          key={index}
                          href={socialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="profile-link"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.sm,
                            padding: isDesktop ? SPACING.md : SPACING.lg,
                            minHeight: isDesktop ? 'auto' : '44px',
                            backgroundColor: COLORS.backgroundLight,
                            borderRadius: BORDER_RADIUS.md,
                            color: '#6EE5F0',
                            textDecoration: 'underline',
                            fontWeight: '500',
                            transition: `all ${TRANSITIONS.normal}`,
                            border: `1px solid ${COLORS.borderPrimary}`,
                            fontSize: fontSizes.md,
                            wordBreak: 'break-word'
                          }}
                          onMouseEnter={(e) => {
                            if (isDesktop) {
                              e.target.style.backgroundColor = COLORS.backgroundMedium
                              e.target.style.borderColor = COLORS.borderPrimaryStrong
                              e.target.style.color = '#ffffff'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isDesktop) {
                              e.target.style.backgroundColor = COLORS.backgroundLight
                              e.target.style.borderColor = COLORS.borderPrimary
                              e.target.style.color = '#6EE5F0'
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
                          <MdLink style={{ flexShrink: 0 }} />
                          <span>{socialName}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* No additional info message */}
            {!member.bio && 
             (!member.skills || (Array.isArray(member.skills) ? member.skills.length === 0 : member.skills.size === 0)) && 
             (!member.links || (Array.isArray(member.links) ? member.links.length === 0 : member.links.size === 0)) &&
             (!member.socialMediaSet || (Array.isArray(member.socialMediaSet) ? member.socialMediaSet.length === 0 : member.socialMediaSet.size === 0)) &&
             (!member.socialMedia || (Array.isArray(member.socialMedia) ? member.socialMedia.length === 0 : member.socialMedia.size === 0)) && (
              <div style={{ 
                color: COLORS.textMuted, 
                textAlign: 'center',
                padding: spacing.xxl,
                fontStyle: 'italic',
                fontSize: fontSizes.md
              }}>
                {t('memberProfile.noInfo') || 'Дополнительная информация отсутствует'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemberProfileModal
