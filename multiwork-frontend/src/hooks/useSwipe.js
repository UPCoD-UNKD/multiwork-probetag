import { useRef, useEffect, useCallback } from 'react'

/**
 * Хук для поддержки свайпов (слайдов) в мобильной версии
 * @param {Function} onSwipeLeft - Callback при свайпе влево
 * @param {Function} onSwipeRight - Callback при свайпе вправо
 * @param {Function} onSwipeUp - Callback при свайпе вверх
 * @param {Function} onSwipeDown - Callback при свайпе вниз
 * @param {Number} threshold - Минимальное расстояние для определения свайпа (по умолчанию 50px)
 * @returns {Object} ref для элемента, к которому нужно применить свайпы
 */
export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
} = {}) => {
  const elementRef = useRef(null)
  const touchStartRef = useRef(null)
  const touchEndRef = useRef(null)
  const touchStartYRef = useRef(null)
  const touchEndYRef = useRef(null)

  const minSwipeDistance = threshold

  const onTouchStart = (e) => {
    touchEndRef.current = null
    touchEndYRef.current = null
    touchStartRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }

  const onTouchMove = (e) => {
    touchEndRef.current = e.touches[0].clientX
    touchEndYRef.current = e.touches[0].clientY
  }

  const onTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) return
    if (!touchStartYRef.current || !touchEndYRef.current) return

    const distanceX = touchStartRef.current - touchEndRef.current
    const distanceY = touchStartYRef.current - touchEndYRef.current
    const absDistanceX = Math.abs(distanceX)
    const absDistanceY = Math.abs(distanceY)

    // Определяем направление свайпа
    if (absDistanceY > absDistanceX && absDistanceY > minSwipeDistance) {
      // Вертикальный свайп
      if (distanceY > 0 && onSwipeUp) {
        onSwipeUp()
      } else if (distanceY < 0 && onSwipeDown) {
        onSwipeDown()
      }
    } else if (absDistanceX > minSwipeDistance) {
      // Горизонтальный свайп
      if (distanceX > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (distanceX < 0 && onSwipeRight) {
        onSwipeRight()
      }
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: true })
    element.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
    }
  }, [onTouchEnd])

  return elementRef
}

