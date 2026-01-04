import React, { useEffect, useState } from 'react'
import Appbar from '../components/bars/Appbar'
import Tabbar from '../components/bars/Tabbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllProjects } from '../api/projects.api'
import { Link } from 'react-router-dom'
import { useViewMode } from '../viewmode/ViewModeContext'
import { useLanguage } from '../i18n/LanguageContext'

function Teams() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isDesktop } = useViewMode()
  const { t } = useLanguage()

  useEffect(() => {
    setLoading(true)
    setError(null)

    getAllProjects()
      .then(data => {
        const projectsArray = Array.isArray(data) ? data : [];
        // Filter projects that have members (teams)
        const teamsWithMembers = projectsArray.filter(project => {
          const members = project.members;
          const membersCount = members 
            ? (Array.isArray(members) ? members.length : members.size || 0)
            : 0;
          return membersCount > 0;
        });
        setProjects(teamsWithMembers)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="mw">
        <div className={`screen ${isDesktop ? 'desktop-mode' : ''}`}>
          <Appbar show='flex' />
          <div className="content">
            <h1 className="title form">{t('teams.title')}</h1>
            <LoadingSpinner message={t('teams.loading') || 'Loading teams...'} />
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
          <h1 className="title form">{t('teams.title')}</h1>
          
          <div className={isDesktop ? 'teams-grid' : ''} style={!isDesktop ? { padding: '1rem' } : {}}>
          {projects.length === 0 ? (
            <p>{t('teams.teamsNotFound')}</p>
          ) : (
            projects.map((project) => {
              const members = project.members 
                ? (Array.isArray(project.members) ? project.members : Array.from(project.members))
                : [];
              
              // Validate that we have a valid project ID before creating the link
              const hasValidId = project.id && project.id !== 'undefined' && project.id !== 'null' && project.id !== undefined && project.id !== null;
              
              return (
                <div 
                  key={project.id}
                  style={{ 
                    padding: '1rem', 
                    marginBottom: '1rem', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                >
                  {hasValidId ? (
                    <Link 
                      to={`/project/${project.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#4ED9EC' }}>
                        {project.projectName || t('projects.untitled')}
                      </h3>
                    </Link>
                  ) : (
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#4ED9EC' }}>
                      {project.projectName || t('projects.untitled')}
                    </h3>
                  )}
                  
                  <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                    {project.description || t('projects.noDescription')}
                  </p>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
                      {t('teams.teamMembers')} ({members.length}):
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {members.map((member, idx) => (
                        <div 
                          key={member.id || idx}
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.5rem',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        >
                          {member.avatar ? (
                            <img 
                              src={member.avatar} 
                              alt={member.username}
                              style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%',
                                marginRight: '0.5rem',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div 
                              style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%',
                                backgroundColor: '#4ED9EC',
                                marginRight: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {(member.fullName || member.username || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span style={{ fontSize: '0.9rem' }}>
                            {member.fullName || member.username || t('teams.unknownUser')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {project.creator && (
                    <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                      {t('teams.createdBy')}: {project.creator.fullName || project.creator.username || t('common.unknown')}
                    </p>
                  )}
                </div>
              )
            })
          )}
          </div>
        </div>
        <Tabbar show='flex' />
      </div>
    </div>
  )
}

export {Teams}
