import api from './api.js'

export const productService = {
  /**
   * Get all products (paginated)
   */
  async getAllProducts(page = 0, size = 12) {
    const response = await api.get('/products', {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Get product by ID
   */
  async getProductById(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  /**
   * Search products (paginated)
   */
  async searchProducts(keyword, page = 0, size = 12) {
    const response = await api.get('/products/search', {
      params: { keyword, page, size }
    })
    return response.data
  },

  /**
   * Get current user's products (paginated)
   */
  async getMyProducts(page = 0, size = 12) {
    const response = await api.get('/products/my-products', {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Create a new product listing (multipart form-data)
   * @param {Object} productRequest - title, description, price, quantity, category, condition, negotiable, usageDuration
   * @param {File[]} images - array of image files
   */
  async createProduct(productRequest, images) {
    const formData = new FormData()
    
    // Add product request as a JSON blob part matching @RequestPart("product")
    const productBlob = new Blob([JSON.stringify(productRequest)], {
      type: 'application/json'
    })
    formData.append('product', productBlob)
    
    // Add multiple image files matching @RequestPart("images")
    if (images && images.length > 0) {
      images.forEach((img) => {
        formData.append('images', img)
      })
    } else {
      // Send an empty mock file if no image is attached, to satisfy the controller
      const emptyBlob = new Blob([''], { type: 'image/jpeg' })
      formData.append('images', new File([emptyBlob], 'empty.jpg', { type: 'image/jpeg' }))
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * Update product listing
   */
  async updateProduct(id, productRequest) {
    const response = await api.put(`/products/${id}`, productRequest)
    return response.data
  },

  /**
   * Delete product listing
   */
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  /**
   * Filter products (paginated)
   */
  async filterProducts({ category, condition, minPrice, maxPrice }, page = 0, size = 12) {
    const params = { page, size }
    if (category) params.category = category
    if (condition) params.condition = condition
    if (minPrice !== undefined && minPrice !== null) params.minPrice = minPrice
    if (maxPrice !== undefined && maxPrice !== null) params.maxPrice = maxPrice

    const response = await api.get('/products/filter', { params })
    return response.data
  }
}
