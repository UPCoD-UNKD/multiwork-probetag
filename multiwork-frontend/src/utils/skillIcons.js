// Mapping skill names to icon files
import Coding from '../assets/svg/skills/Coding.svg';
import WebDevelopment from '../assets/svg/skills/WebDevelopment.svg';
import GraphicsDesign from '../assets/svg/skills/GraphicsDesign.svg';
import UXUIDesigner from '../assets/svg/skills/UXUIDesigner.svg';
import Marketing from '../assets/svg/skills/Marketing.svg';
import SMM from '../assets/svg/skills/SMM.svg';
import ContentCreation from '../assets/svg/skills/ContentCreation.svg';
import Copywriting from '../assets/svg/skills/Copywriting.svg';
import VideoMaking from '../assets/svg/skills/VideoMaking.svg';
import Photograph from '../assets/svg/skills/Photograph.svg';
import MotionDesign from '../assets/svg/skills/MotionDesign.svg';
import Art from '../assets/svg/skills/Art.svg';
import Management from '../assets/svg/skills/Management.svg';
import ProjectManagment from '../assets/svg/skills/ProjectManagment.svg';
import TeamLeading from '../assets/svg/skills/TeamLeading.svg';
import ProductManagement from '../assets/svg/skills/ProductManagement.svg';
import ProductMarketing from '../assets/svg/skills/ProductMarketing.svg';
import BrandManagment from '../assets/svg/skills/BrandManagment.svg';
import DataAnalytics from '../assets/svg/skills/DataAnalytics.svg';
import DataScientist from '../assets/svg/skills/DataScientist.svg';
import DataCleansing from '../assets/svg/skills/DataCleansing.svg';
import Statistics from '../assets/svg/skills/Statistics.svg';
import Mathematic from '../assets/svg/skills/Mathematic.svg';
import Finance from '../assets/svg/skills/Finance.svg';
import EmailMarketing from '../assets/svg/skills/EmailMarketing.svg';
import Targeting from '../assets/svg/skills/Targeting.svg';
import QAEngineering from '../assets/svg/skills/QAEngineering.svg';
import ComputerAnimation from '../assets/svg/skills/ComputerAnimation.svg';
import TextureDrawing from '../assets/svg/skills/TextureDrawing.svg';
import DubbingActor from '../assets/svg/skills/DubbingActor.svg';
import ThreeDDesign from '../assets/svg/skills/3DDesign.svg';

// Default icon (можно использовать Coding как дефолт)
const defaultIcon = Coding;

// Маппинг названий навыков к иконкам
const skillIconMap = {
  // Программирование и разработка
  'coding': Coding,
  'programming': Coding,
  'разработка': Coding,
  'web development': WebDevelopment,
  'webdevelopment': WebDevelopment,
  'веб-разработка': WebDevelopment,
  'веб разработка': WebDevelopment,
  
  // Дизайн
  'graphics design': GraphicsDesign,
  'graphicsdesign': GraphicsDesign,
  'графический дизайн': GraphicsDesign,
  'ux/ui designer': UXUIDesigner,
  'uxui designer': UXUIDesigner,
  'ux/ui': UXUIDesigner,
  'uxui': UXUIDesigner,
  'ux дизайн': UXUIDesigner,
  'ui дизайн': UXUIDesigner,
  
  // Маркетинг
  'marketing': Marketing,
  'маркетинг': Marketing,
  'smm': SMM,
  'social media marketing': SMM,
  'социальные сети': SMM,
  'контент-маркетинг': ContentCreation,
  'content creation': ContentCreation,
  'contentcreation': ContentCreation,
  'создание контента': ContentCreation,
  'copywriting': Copywriting,
  'копирайтинг': Copywriting,
  'email marketing': EmailMarketing,
  'emailmarketing': EmailMarketing,
  'email маркетинг': EmailMarketing,
  'targeting': Targeting,
  'таргетинг': Targeting,
  
  // Видео и медиа
  'video making': VideoMaking,
  'videomaking': VideoMaking,
  'видео': VideoMaking,
  'видеомонтаж': VideoMaking,
  'photograph': Photograph,
  'photography': Photograph,
  'фотография': Photograph,
  'motion design': MotionDesign,
  'motiondesign': MotionDesign,
  'моушн дизайн': MotionDesign,
  'motion graphics': MotionDesign,
  
  // Искусство
  'art': Art,
  'искусство': Art,
  '3d design': ThreeDDesign,
  '3ddesign': ThreeDDesign,
  '3d дизайн': ThreeDDesign,
  '3d': ThreeDDesign,
  'computer animation': ComputerAnimation,
  'computeranimation': ComputerAnimation,
  'компьютерная анимация': ComputerAnimation,
  'texture drawing': TextureDrawing,
  'texturedrawing': TextureDrawing,
  'текстуры': TextureDrawing,
  'dubbing actor': DubbingActor,
  'dubbingactor': DubbingActor,
  'озвучка': DubbingActor,
  
  // Управление
  'management': Management,
  'менеджмент': Management,
  'управление': Management,
  'project management': ProjectManagment,
  'projectmanagement': ProjectManagment,
  'управление проектами': ProjectManagment,
  'project managment': ProjectManagment, // опечатка в названии файла
  'team leading': TeamLeading,
  'teamleading': TeamLeading,
  'лидерство': TeamLeading,
  'руководство командой': TeamLeading,
  'product management': ProductManagement,
  'productmanagement': ProductManagement,
  'управление продуктом': ProductManagement,
  'product marketing': ProductMarketing,
  'productmarketing': ProductMarketing,
  'маркетинг продукта': ProductMarketing,
  'brand management': BrandManagment,
  'brandmanagement': BrandManagment,
  'brand managment': BrandManagment, // опечатка в названии файла
  'управление брендом': BrandManagment,
  
  // Аналитика и данные
  'data analytics': DataAnalytics,
  'dataanalytics': DataAnalytics,
  'аналитика данных': DataAnalytics,
  'data scientist': DataScientist,
  'datascientist': DataScientist,
  'наука о данных': DataScientist,
  'data science': DataScientist,
  'data cleansing': DataCleansing,
  'datacleansing': DataCleansing,
  'очистка данных': DataCleansing,
  'statistics': Statistics,
  'статистика': Statistics,
  'mathematic': Mathematic,
  'mathematics': Mathematic,
  'математика': Mathematic,
  
  // Финансы
  'finance': Finance,
  'финансы': Finance,
  
  // QA
  'qa engineering': QAEngineering,
  'qaengineering': QAEngineering,
  'qa': QAEngineering,
  'тестирование': QAEngineering,
  'qa инженер': QAEngineering,
};

/**
 * Получает иконку для навыка по его названию
 * @param {string} skillName - Название навыка
 * @returns {string} - Путь к иконке
 */
export const getSkillIcon = (skillName) => {
  if (!skillName) return defaultIcon;
  
  // Нормализуем название: приводим к нижнему регистру и убираем лишние пробелы
  const normalized = skillName.toLowerCase().trim();
  
  // Прямое совпадение
  if (skillIconMap[normalized]) {
    return skillIconMap[normalized];
  }
  
  // Поиск по частичному совпадению
  for (const [key, icon] of Object.entries(skillIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  
  // Если не найдено, возвращаем дефолтную иконку
  return defaultIcon;
};

export default getSkillIcon;
