import React from 'react';
import { COLORS } from '../constants/theme';

/**
 * NotificationBadge - Компонент для отображения красного кружка с числом уведомлений
 * Дизайн вдохновлен Telegram, Instagram и другими мобильными приложениями
 * 
 * @param {number} count - Количество уведомлений
 * @param {Object} style - Дополнительные стили
 */
const NotificationBadge = ({ count, style = {} }) => {
  if (!count || count === 0) {
    return null;
  }

  // Форматирование числа: если больше 99, показываем "99+"
  const displayCount = count > 99 ? '99+' : count.toString();

  const badgeStyle = {
    position: 'absolute',
    top: '-3px', // Чуть выше
    right: '-3px', // Чуть правее
    backgroundColor: COLORS.error, // Красный цвет
    color: '#ffffff',
    borderRadius: '7px',
    minWidth: '14px',
    height: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: '700',
    lineHeight: '1',
    padding: '0 3px',
    boxSizing: 'border-box',
    border: `1.5px solid ${COLORS.background}`, // Более тонкая обводка для гармонии
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    ...style,
  };

  // Для чисел больше 9, увеличиваем минимальную ширину
  if (count > 9 && count <= 99) {
    badgeStyle.minWidth = '16px';
    badgeStyle.fontSize = '8px';
  } else if (count > 99) {
    badgeStyle.minWidth = '18px';
    badgeStyle.fontSize = '7px';
    badgeStyle.padding = '0 2px';
  }

  return (
    <span style={badgeStyle} aria-label={`${count} unread notifications`}>
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
