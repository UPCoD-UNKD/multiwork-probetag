import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProject } from '../../api/projects.api'
import { toast } from 'react-toastify'
import { useLanguage } from '../../i18n/LanguageContext'
import { COLORS } from '../../constants/theme'

function NewProject() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [preferredTeamSize, setPreferredTeamSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!projectName.trim()) {
      setError(t('projects.projectNameRequired'))
      setLoading(false)
      return
    }

    try {
      const teamSize = preferredTeamSize.trim() ? parseInt(preferredTeamSize.trim(), 10) : null
      if (teamSize !== null && (isNaN(teamSize) || teamSize < 1)) {
        setError('Размер команды должен быть положительным числом')
        setLoading(false)
        return
      }
      const project = await createProject(projectName.trim(), description.trim(), teamSize)
      toast.success(t('projects.projectCreatedSuccess'))
      // Navigate to project onboarding
      navigate(`/project/${project.id}/onboarding`)
    } catch (err) {
      const errorMessage = err.message || t('projects.failedToCreate')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='form'>
        <h1 className="title form">{t('projects.createNew')}</h1>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            color: '#333',
            fontWeight: '500'
          }}>
            {t('projects.projectName') || 'Название проекта'}
            <span style={{ 
              color: COLORS.error || '#D1085B', 
              marginLeft: '4px',
              fontSize: '0.85rem'
            }}>*</span>
          </label>
          <textarea 
            placeholder={t('projects.projectNamePlaceholder') || 'Введите название вашего проекта...'} 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            disabled={loading}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '60px'
            }}
          />
        </div>
        
        <textarea 
          placeholder={t('projects.descriptionOptional')} 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        
        <input 
          type='number' 
          placeholder='Предпочтительный размер команды (необязательно)' 
          value={preferredTeamSize}
          onChange={(e) => setPreferredTeamSize(e.target.value)}
          min="1"
          disabled={loading}
          style={{ marginTop: '0.5rem' }}
        />
        
        {error && <p className="error">{error}</p>}
        
        <input 
          type="submit" 
          value={loading ? t('common.creating') : t('common.save')} 
          disabled={loading || !projectName.trim()}
        />
      </form>
    </>
  )
}

export {NewProject}
