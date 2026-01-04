/**
 * Image cache utility for base64 images
 * Caches converted base64 images to avoid re-processing
 */

const imageCache = new Map()

/**
 * Get cached image or convert and cache it
 * @param {string|Array} projectPhoto - Project photo as base64 string or byte array
 * @param {string} placeholder - Placeholder image URL
 * @returns {string} - Cached or converted image data URL
 */
export const getCachedImage = (projectPhoto, placeholder) => {
  if (!projectPhoto) {
    return placeholder
  }

  // Create cache key from photo data
  let cacheKey
  if (typeof projectPhoto === 'string') {
    // Use first 100 chars as key for base64 strings
    cacheKey = projectPhoto.substring(0, 100)
  } else if (Array.isArray(projectPhoto)) {
    // Use array length and first few bytes as key
    cacheKey = `array_${projectPhoto.length}_${projectPhoto.slice(0, 10).join(',')}`
  } else {
    return placeholder
  }

  // Check cache
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)
  }

  // Convert and cache
  try {
    let dataUrl
    
    // Handle base64 string
    if (typeof projectPhoto === 'string') {
      if (projectPhoto.startsWith('data:')) {
        dataUrl = projectPhoto
      } else {
        dataUrl = `data:image/png;base64,${projectPhoto}`
      }
    }
    // Handle byte array
    else if (Array.isArray(projectPhoto) && projectPhoto.length > 0) {
      const bytes = new Uint8Array(projectPhoto)
      const chunkSize = 8192
      let binaryString = ''
      
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, Math.min(i + chunkSize, bytes.length))
        binaryString += String.fromCharCode.apply(null, Array.from(chunk))
      }
      
      const base64String = btoa(binaryString)
      dataUrl = `data:image/png;base64,${base64String}`
    } else {
      return placeholder
    }

    // Cache the result (limit cache size to prevent memory issues)
    if (imageCache.size > 100) {
      // Remove oldest entries (simple FIFO)
      const firstKey = imageCache.keys().next().value
      imageCache.delete(firstKey)
    }
    
    imageCache.set(cacheKey, dataUrl)
    return dataUrl
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error converting project photo:', e)
    }
    return placeholder
  }
}

/**
 * Clear image cache (useful for memory management)
 */
export const clearImageCache = () => {
  imageCache.clear()
}

/**
 * Get cache size
 */
export const getCacheSize = () => {
  return imageCache.size
}
