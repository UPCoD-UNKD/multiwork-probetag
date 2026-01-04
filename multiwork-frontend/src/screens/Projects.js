import React, { useMemo } from 'react'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import ProjectCard from '../components/lists/ProjectCard'
import { useAllProjects } from '../hooks/useProjects'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'
import { mapProjectToCard } from '../utils/projectUtils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'
// Theme constants removed - not used in this component

function Projects() {
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()
  
  // Use React Query hook with caching - data will be cached and reused
  const { data, isLoading: loading, error, refetch } = useAllProjects(0, 100)

  // Map API response to ProjectCard props and memoize
  const displayedProjects = useMemo(() => {
    if (!data) return []
    
    // Handle paginated response
    let projectsArray = []
    if (Array.isArray(data)) {
      projectsArray = data
    } else if (data?.content && Array.isArray(data.content)) {
      projectsArray = data.content
    }
    
    return projectsArray.map(mapProjectToCard)
  }, [data])

  return (
    <div className='mw'>
      <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
        <Appbar show='flex' />
        <div className="content">
          <h1 className="title form">{t('projects.title')}</h1>
          {loading ? (
            <LoadingSpinner message={t('projects.loading') || 'Loading projects...'} />
          ) : error ? (
            <ErrorState
              error={error.message || error}
              onRetry={() => refetch()}
              retryLabel={t('common.retry') || 'Retry'}
            />
          ) : displayedProjects.length === 0 ? (
            <p>{t('projects.projectsNotFound')}</p>
          ) : (
            <div className="projects-grid" role="list" aria-label={t('projects.list') || 'Projects list'}>
              {displayedProjects.map((el) => (
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
              ))}
            </div>
          )}
        </div>
        <Tabbar show='flex' />
      </div>
    </div>
  )
}

export {Projects}
