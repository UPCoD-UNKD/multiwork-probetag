import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import NotificationBadge from '../NotificationBadge'

/**
 * ProjectCard component - displays project information in a card format
 * Memoized to prevent unnecessary re-renders
 */
const ProjectCard = memo(({ id, logo, title, desc, status, members, preferredTeamSize, color, notificationCount }) => {
  // Validate that we have a valid project ID before creating the link
  const hasValidId = id && id !== 'undefined' && id !== 'null' && id !== undefined && id !== null;
  
  // Memoize members display text
  const membersText = preferredTeamSize 
    ? `${members} / ${preferredTeamSize}`
    : members;
  
  return (
    <div className="card" role="article" aria-label={`Project: ${title}`}>
      <div className="block">
          <div className="flex jcfs">
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={logo} 
                width={24} 
                height={24} 
                alt={title || 'Project logo'} 
                className="plogo"
                loading="lazy"
              />
              {notificationCount > 0 && (
                <NotificationBadge count={notificationCount} />
              )}
            </div>
            <div className="block">
              <h3 className="name">{title}</h3>
              <span className="desc">{desc}</span>
            </div>
          </div>
          <div className="flex">
            <small className="status" style={{color: color}} aria-label={`Status: ${status}`}>
              {status}
            </small>
            <small className="team" aria-label={`Members: ${membersText}`}>
              Members: <span>{membersText}</span>
            </small>
          </div>
      </div>
      {hasValidId ? (
        <Link 
          to={`/project/${id}`} 
          className="join"
          aria-label={`View project ${title}`}
        >
          View
        </Link>
      ) : (
        <span 
          className="join" 
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          aria-label="View project (unavailable)"
        >
          View
        </span>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.id === nextProps.id &&
    prevProps.logo === nextProps.logo &&
    prevProps.title === nextProps.title &&
    prevProps.desc === nextProps.desc &&
    prevProps.status === nextProps.status &&
    prevProps.members === nextProps.members &&
    prevProps.preferredTeamSize === nextProps.preferredTeamSize &&
    prevProps.color === nextProps.color &&
    prevProps.notificationCount === nextProps.notificationCount
  )
})

ProjectCard.displayName = 'ProjectCard'

export default ProjectCard
