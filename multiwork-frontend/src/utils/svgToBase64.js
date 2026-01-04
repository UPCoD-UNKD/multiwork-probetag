/**
 * Utility function to convert SVG file to PNG base64 data URL
 * @param {string} svgPath - Path to SVG file (URL string from import)
 * @returns {Promise<string>} Base64 data URL (data:image/png;base64,...)
 */
export const svgToPngBase64 = async (svgPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Ensure we have a valid URL string
      const url = typeof svgPath === 'string' ? svgPath : (svgPath?.default || svgPath)
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid SVG path provided')
      }
      
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.width || 256
          canvas.height = img.height || 256
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          
          const pngDataUrl = canvas.toDataURL('image/png')
          resolve(pngDataUrl)
        } catch (error) {
          console.error('Error converting to PNG:', error)
          reject(error)
        }
      }
      
      img.onerror = (error) => {
        console.error('Error loading SVG image:', error)
        reject(new Error('Failed to load SVG image'))
      }
      
      img.src = url
    } catch (error) {
      console.error('Error in svgToPngBase64:', error)
      reject(error)
    }
  })
}

/**
 * Utility function to convert SVG file to base64 data URL (legacy, returns SVG)
 * @param {string} svgPath - Path to SVG file (URL string from import)
 * @returns {Promise<string>} Base64 data URL (data:image/svg+xml;base64,...)
 */
export const svgToBase64 = async (svgPath) => {
  try {
    // Ensure we have a valid URL string
    const url = typeof svgPath === 'string' ? svgPath : (svgPath?.default || svgPath)
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid SVG path provided')
    }
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`)
    }
    const svgText = await response.text()
    const base64 = btoa(unescape(encodeURIComponent(svgText)))
    return `data:image/svg+xml;base64,${base64}`
  } catch (error) {
    console.error('Error converting SVG to base64:', error)
    throw error
  }
}

/**
 * Convert base64 data URL to byte array for server
 * @param {string} dataUrl - Base64 data URL (data:image/svg+xml;base64,...)
 * @returns {Array<number>} Byte array
 */
export const base64ToByteArray = (dataUrl) => {
  try {
    const base64Data = dataUrl.split(',')[1] // Remove data:image/svg+xml;base64, prefix
    const binaryString = atob(base64Data)
    
    // Convert to byte array efficiently using chunking to avoid stack overflow
    const bytes = new Uint8Array(binaryString.length)
    const chunkSize = 10000
    for (let i = 0; i < binaryString.length; i += chunkSize) {
      const end = Math.min(i + chunkSize, binaryString.length)
      for (let j = i; j < end; j++) {
        bytes[j] = binaryString.charCodeAt(j)
      }
    }
    
    // Convert to regular array efficiently
    const resultArray = new Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      resultArray[i] = bytes[i]
    }
    
    return resultArray
  } catch (error) {
    console.error('Error converting base64 to byte array:', error)
    throw error
  }
}
