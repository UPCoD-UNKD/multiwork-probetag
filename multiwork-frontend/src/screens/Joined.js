import React, { useMemo } from 'react'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import ProjectCard from '../components/lists/ProjectCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useCurrentUser, useCurrentUserProjects } from '../hooks/useUsers'
import { getProjectById } from '../api/projects.api'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useQueries } from '@tanstack/react-query'
import { getProjectNotificationCount } from '../api/notifications.api'
import cameraPlaceholder from '../assets/svg/projects/camera-placeholder.svg'

// Helper function to get status color based on project status
const getStatusColor = (status) => {
  const statusStr = status?.toUpperCase() || '';
  switch (statusStr) {
    case 'IN_PROGRESS':
      return '#39AA8F'; // green
    case 'DONE':
      return '#FEB700'; // golden
    case 'CANCELLED':
      return '#D1085B'; // magenta
    default:
      return '#4ED9EC'; // blue
  }
};

// Helper function to format status text
const formatStatus = (statusSet) => {
  if (!statusSet || (Array.isArray(statusSet) && statusSet.length === 0)) return 'New';
  const status = Array.isArray(statusSet) ? statusSet[0] : Array.from(statusSet)[0];
  return status?.replace(/_/g, ' ') || 'New';
};

// Helper function to convert byte array or base64 string to base64 image
const getProjectLogo = (projectPhoto) => {
  if (!projectPhoto) {
    return cameraPlaceholder;
  }
  
  try {
    // Handle base64 string (from Jackson serialization)
    if (typeof projectPhoto === 'string') {
      if (projectPhoto.startsWith('data:')) {
        return projectPhoto;
      }
      return `data:image/png;base64,${projectPhoto}`;
    }
    
    // Handle byte array
    if (Array.isArray(projectPhoto) && projectPhoto.length > 0) {
      // Convert byte array to base64 safely without spread operator
      const bytes = new Uint8Array(projectPhoto)
      const chunkSize = 8192
      let binaryString = ''
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length))
        binaryString += String.fromCharCode.apply(null, Array.from(chunk))
      }
      const base64String = btoa(binaryString)
      return `data:image/png;base64,${base64String}`;
    }
  } catch (e) {
  }
  
  // Default placeholder logo
  return cameraPlaceholder;
};

// Helper function to map project to ProjectCard props
const mapProjectToCard = (project) => {
  // Handle members count - could be array (from JSON) or Set
  let membersCount = 0;
  if (project.members) {
    if (Array.isArray(project.members)) {
      membersCount = project.members.length;
    } else if (project.members.size !== undefined) {
      membersCount = project.members.size;
    }
  }
  
  const status = formatStatus(project.projectStatuses);
  
  return {
    id: project.id,
    logo: getProjectLogo(project.projectPhoto),
    title: project.projectName || 'Untitled Project',
    desc: project.description || '',
    status: status,
    members: membersCount,
    preferredTeamSize: project.preferredTeamSize,
    color: getStatusColor(status)
  };
};

function Joined() {
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()

  // Use React Query hooks with caching
  const { data: userData, isLoading: loadingUser, error: errorUser } = useCurrentUser()
  const { data: memberProjectsFull, isLoading: loadingProjects, error: errorProjects } = useCurrentUserProjects()

  // Get creator projects IDs from userData
  const creatorProjectIds = useMemo(() => {
    if (!userData?.creatorProjects) return []
    
    let creatorProjectsSummary = []
    if (Array.isArray(userData.creatorProjects)) {
      creatorProjectsSummary = userData.creatorProjects
    } else if (userData.creatorProjects.size !== undefined) {
      creatorProjectsSummary = Array.from(userData.creatorProjects)
    } else if (typeof userData.creatorProjects === 'object') {
      creatorProjectsSummary = Object.values(userData.creatorProjects)
    }
    
    return creatorProjectsSummary
      .filter(p => p && p.id)
      .map(p => String(p.id))
  }, [userData])

  // Load full project data for created projects using useQueries (parallel queries with caching)
  const createdProjectsQueries = useQueries({
    queries: creatorProjectIds.map(projectId => ({
      queryKey: ['projects', 'detail', projectId],
      queryFn: () => getProjectById(projectId),
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }))
  })

  // Load notification counts (applications + comments) for created projects
  const notificationCountQueries = useQueries({
    queries: creatorProjectIds.map(projectId => ({
      queryKey: ['notifications', 'project', projectId, 'count'],
      queryFn: () => getProjectNotificationCount(projectId),
      staleTime: 1000 * 10, // 10 seconds - faster updates
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 15, // Poll every 15 seconds (like Telegram)
      refetchIntervalInBackground: true, // Continue polling in background
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    }))
  })

  // Process data
  const { joinedProjects, createdProjects, loading, error } = useMemo(() => {
    const isLoading = loadingUser || loadingProjects || createdProjectsQueries.some(q => q.isLoading)
    const hasError = errorUser || errorProjects || createdProjectsQueries.some(q => q.error)
    
    // Create map of project ID to notification count (applications + comments)
    const notificationCountMap = new Map()
    notificationCountQueries.forEach((query, index) => {
      const projectId = creatorProjectIds[index]
      if (projectId && query.data !== undefined && query.data !== null) {
        const count = typeof query.data === 'number' ? query.data : 0
        notificationCountMap.set(String(projectId), count)
      }
    })
    
    if (isLoading) {
      return { joinedProjects: [], createdProjects: [], loading: true, error: null }
    }
    
    if (hasError) {
      const firstError = errorUser || errorProjects || createdProjectsQueries.find(q => q.error)?.error
      return { joinedProjects: [], createdProjects: [], loading: false, error: firstError }
    }

    if (!userData || !memberProjectsFull) {
      return { joinedProjects: [], createdProjects: [], loading: false, error: null }
    }

    const currentUserId = userData.id ? String(userData.id) : null
    
    // Get joined projects - use full ProjectDTO from getCurrentUserProjects
    let memberProjects = Array.isArray(memberProjectsFull) ? memberProjectsFull : []
    
    // Get created projects from queries
    const validCreatedProjects = createdProjectsQueries
      .map(q => q.data)
      .filter(p => p !== null && p !== undefined)
    
    // Map created projects with full data and add notification counts (applications + comments)
    const mappedCreated = validCreatedProjects.map(project => {
      const projectData = mapProjectToCard(project)
      const projectId = project?.id ? String(project.id) : null
      const notificationCount = projectId ? (notificationCountMap.get(projectId) || 0) : 0
      return {
        ...projectData,
        notificationCount
      }
    })
    
    // Get IDs of created projects to filter them out from joined projects
    const createdProjectIds = new Set(
      validCreatedProjects
        .map(p => p && p.id ? String(p.id) : null)
        .filter(id => id !== null)
    )
    
    // Filter out projects that user created from joined projects
    const filteredMemberProjects = memberProjects.filter(project => {
      if (!project || !project.id) return false
      
      const projectId = String(project.id)
      
      // Exclude if this project ID is in created projects
      if (createdProjectIds.has(projectId)) {
        return false
      }
      
      // Also check if user is the creator
      if (currentUserId && project.creator) {
        const creatorId = typeof project.creator === 'object' 
          ? (project.creator.id ? String(project.creator.id) : null)
          : String(project.creator)
        if (creatorId && creatorId === currentUserId) {
          return false
        }
      }
      
      return true // Keep this project in joined projects
    })
    
    // Map filtered joined projects to ProjectCard props
    const mappedJoined = filteredMemberProjects.map(mapProjectToCard)
    
    return {
      joinedProjects: mappedJoined,
      createdProjects: mappedCreated,
      loading: false,
      error: null
    }
  }, [userData, memberProjectsFull, createdProjectsQueries, notificationCountQueries, creatorProjectIds, loadingUser, loadingProjects, errorUser, errorProjects])

  if (loading) {
    return (
      <div className="mw">
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content">
            <h1 className="title form">{t('joined.title')}</h1>
            <LoadingSpinner message={t('joined.loading') || 'Loading your projects...'} />
          </div>
          <Tabbar show='flex' />
        </div>
      </div>
    )
  }
  if (error) return <div className="mw">{t('common.error')}: {error}</div>

  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          <h1 className="title form">{t('joined.title')}</h1>
          
          <div className={isDesktop ? 'two-column-grid' : ''}>
          {/* Joined Projects Column */}
          <div className="projects-section">
            <h2>
              {t('joined.joinedProjects')} ({joinedProjects.length})
            </h2>
            {joinedProjects.length === 0 ? (
              <p>
                {t('joined.noJoinedProjects')}
              </p>
            ) : (
              <div className="projects-list">
                {joinedProjects.map((el) =>
                  <ProjectCard
                    key={el.id}
                    id={el.id}
                    logo={el.logo}
                    title={el.title}
                    desc={el.desc ? el.desc.substring(0, 100) : ''}
                    status={el.status}
                    members={el.members}
                    preferredTeamSize={el.preferredTeamSize}
                    color={el.color}
                  />
                )}
              </div>
            )}
          </div>

          {/* Created Projects Column */}
          <div className="projects-section">
            <h2>
              {t('joined.createdProjects')} ({createdProjects.length})
            </h2>
            {createdProjects.length === 0 ? (
              <p>
                {t('joined.noCreatedProjects')}
              </p>
            ) : (
              <div className="projects-list">
                {createdProjects.map((el) =>
                  <ProjectCard
                    key={el.id}
                    id={el.id}
                    logo={el.logo}
                    title={el.title}
                    desc={el.desc ? el.desc.substring(0, 100) : ''}
                    status={el.status}
                    members={el.members}
                    preferredTeamSize={el.preferredTeamSize}
                    color={el.color}
                    notificationCount={el.notificationCount || 0}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        </div>
        <Tabbar show='flex' />
      </div>
    </div>
  )
}

export {Joined}
