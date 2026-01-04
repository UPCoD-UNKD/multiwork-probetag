import { useState, useEffect } from 'react';
import { getCurrentUser, updateUser } from '../api/users.api';
import { getAllSkills } from '../api/skills.api';
import { AVAILABLE_SKILLS } from '../constants/skills';
import { prepareFormData, prepareUpdateData, normalizeSkills } from '../utils/profileDataUtils';

/**
 * Custom hook for profile management logic.
 * Follows Single Responsibility Principle - handles all profile data and operations.
 */
export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    avatar: '',
    skills: [],
    socialMediaSet: [],
    links: []
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Load user data
  const loadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentUser();
      setUser(data);
      
      const formDataFromUser = prepareFormData(data);
      setFormData(formDataFromUser);
      setAvatarPreview(data.avatar || null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Load skills
  const loadSkills = async () => {
    setLoadingSkills(true);
    try {
      const response = await getAllSkills();
      
      let skillsArray = [];
      
      if (Array.isArray(response)) {
        skillsArray = response;
      } else if (response && Array.isArray(response.content)) {
        skillsArray = response.content;
      } else if (response && typeof response === 'object') {
        const possibleArrays = Object.values(response).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          skillsArray = possibleArrays[0];
        }
      }
      
      if (skillsArray && skillsArray.length > 0) {
        setAllSkills(skillsArray);
      } else {
        setAllSkills(AVAILABLE_SKILLS);
      }
    } catch (err) {
      console.error('Failed to load skills from API, using static list:', err);
      setAllSkills(AVAILABLE_SKILLS);
    } finally {
      setLoadingSkills(false);
    }
  };

  // Initialize
  useEffect(() => {
    loadUser();
    loadSkills();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle skills save
  const handleSkillsSave = async (selectedSkills) => {
    setFormData(prev => ({
      ...prev,
      skills: selectedSkills
    }));
    
    try {
      setLoading(true);
      const updateData = {
        id: user.id,
        fullName: formData.fullName || null,
        username: user.username,
        email: user.email,
        bio: formData.bio || null,
        avatar: formData.avatar || null,
        skills: selectedSkills,
        socialMediaSet: formData.socialMediaSet || [],
        links: formData.links || []
      };

      const updatedUser = await updateUser(updateData);
      setUser(updatedUser);
      
      const skills = normalizeSkills(updatedUser.skills);
      
      setFormData(prev => ({
        ...prev,
        skills: skills
      }));
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении навыков');
      setLoading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const updateData = prepareUpdateData(user, formData);
      const updatedUser = await updateUser(updateData);
      setUser(updatedUser);
      
      const formDataFromUser = prepareFormData(updatedUser);
      setFormData(formDataFromUser);
      setAvatarPreview(updatedUser.avatar || null);
      
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении');
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    const formDataFromUser = prepareFormData(user);
    setFormData(formDataFromUser);
    setAvatarPreview(user?.avatar || null);
    setIsEditing(false);
  };

  // Social media handlers
  const addSocialMedia = () => {
    setFormData(prev => ({
      ...prev,
      socialMediaSet: [...(prev.socialMediaSet || []), { referenceSocialMedia: '' }]
    }));
  };

  const updateSocialMedia = (index, value) => {
    setFormData(prev => {
      const updated = [...(prev.socialMediaSet || [])];
      updated[index] = { ...updated[index], referenceSocialMedia: value };
      return { ...prev, socialMediaSet: updated };
    });
  };

  const removeSocialMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      socialMediaSet: prev.socialMediaSet.filter((_, i) => i !== index)
    }));
  };

  // Links handlers
  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...(prev.links || []), { title: '', reference: '' }]
    }));
  };

  const updateLink = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.links || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, links: updated };
    });
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  return {
    user,
    loading,
    error,
    isEditing,
    setIsEditing,
    allSkills,
    loadingSkills,
    formData,
    avatarPreview,
    handleInputChange,
    handleAvatarChange,
    handleSkillsSave,
    handleSave,
    handleCancel,
    addSocialMedia,
    updateSocialMedia,
    removeSocialMedia,
    addLink,
    updateLink,
    removeLink,
    loadSkills
  };
};
