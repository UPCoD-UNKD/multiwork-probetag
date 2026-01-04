// Статический список всех доступных навыков
// Соответствует иконкам в assets/svg/skills/

export const AVAILABLE_SKILLS = [
  {
    id: 1,
    name: 'Coding',
    description: 'Программирование и разработка',
    iconName: 'Coding'
  },
  {
    id: 2,
    name: 'Web Development',
    description: 'Веб-разработка',
    iconName: 'WebDevelopment'
  },
  {
    id: 3,
    name: 'Graphics Design',
    description: 'Графический дизайн',
    iconName: 'GraphicsDesign'
  },
  {
    id: 4,
    name: 'UX/UI Designer',
    description: 'UX/UI дизайн',
    iconName: 'UXUIDesigner'
  },
  {
    id: 5,
    name: 'Marketing',
    description: 'Маркетинг',
    iconName: 'Marketing'
  },
  {
    id: 6,
    name: 'SMM',
    description: 'Социальные сети и маркетинг',
    iconName: 'SMM'
  },
  {
    id: 7,
    name: 'Content Creation',
    description: 'Создание контента',
    iconName: 'ContentCreation'
  },
  {
    id: 8,
    name: 'Copywriting',
    description: 'Копирайтинг',
    iconName: 'Copywriting'
  },
  {
    id: 9,
    name: 'Video Making',
    description: 'Видеомонтаж',
    iconName: 'VideoMaking'
  },
  {
    id: 10,
    name: 'Photography',
    description: 'Фотография',
    iconName: 'Photograph'
  },
  {
    id: 11,
    name: 'Motion Design',
    description: 'Моушн дизайн',
    iconName: 'MotionDesign'
  },
  {
    id: 12,
    name: 'Art',
    description: 'Искусство',
    iconName: 'Art'
  },
  {
    id: 13,
    name: 'Management',
    description: 'Менеджмент',
    iconName: 'Management'
  },
  {
    id: 14,
    name: 'Project Management',
    description: 'Управление проектами',
    iconName: 'ProjectManagment'
  },
  {
    id: 15,
    name: 'Team Leading',
    description: 'Руководство командой',
    iconName: 'TeamLeading'
  },
  {
    id: 16,
    name: 'Product Management',
    description: 'Управление продуктом',
    iconName: 'ProductManagement'
  },
  {
    id: 17,
    name: 'Product Marketing',
    description: 'Маркетинг продукта',
    iconName: 'ProductMarketing'
  },
  {
    id: 18,
    name: 'Brand Management',
    description: 'Управление брендом',
    iconName: 'BrandManagment'
  },
  {
    id: 19,
    name: 'Data Analytics',
    description: 'Аналитика данных',
    iconName: 'DataAnalytics'
  },
  {
    id: 20,
    name: 'Data Science',
    description: 'Наука о данных',
    iconName: 'DataScientist'
  },
  {
    id: 21,
    name: 'Data Cleansing',
    description: 'Очистка данных',
    iconName: 'DataCleansing'
  },
  {
    id: 22,
    name: 'Statistics',
    description: 'Статистика',
    iconName: 'Statistics'
  },
  {
    id: 23,
    name: 'Mathematics',
    description: 'Математика',
    iconName: 'Mathematic'
  },
  {
    id: 24,
    name: 'Finance',
    description: 'Финансы',
    iconName: 'Finance'
  },
  {
    id: 25,
    name: 'Email Marketing',
    description: 'Email маркетинг',
    iconName: 'EmailMarketing'
  },
  {
    id: 26,
    name: 'Targeting',
    description: 'Таргетинг',
    iconName: 'Targeting'
  },
  {
    id: 27,
    name: 'QA Engineering',
    description: 'Тестирование ПО',
    iconName: 'QAEngineering'
  },
  {
    id: 28,
    name: 'Computer Animation',
    description: 'Компьютерная анимация',
    iconName: 'ComputerAnimation'
  },
  {
    id: 29,
    name: 'Texture Drawing',
    description: 'Создание текстур',
    iconName: 'TextureDrawing'
  },
  {
    id: 30,
    name: 'Dubbing',
    description: 'Озвучка',
    iconName: 'DubbingActor'
  },
  {
    id: 31,
    name: '3D Design',
    description: '3D дизайн',
    iconName: '3DDesign'
  }
];

// Функция для получения навыка по ID
export const getSkillById = (id) => {
  return AVAILABLE_SKILLS.find(skill => skill.id === id);
};

// Функция для получения навыка по имени
export const getSkillByName = (name) => {
  return AVAILABLE_SKILLS.find(skill => 
    skill.name.toLowerCase() === name.toLowerCase()
  );
};

// Функция для поиска навыков
export const searchSkills = (query) => {
  const lowerQuery = query.toLowerCase();
  return AVAILABLE_SKILLS.filter(skill =>
    skill.name.toLowerCase().includes(lowerQuery) ||
    skill.description.toLowerCase().includes(lowerQuery)
  );
};

export default AVAILABLE_SKILLS;
