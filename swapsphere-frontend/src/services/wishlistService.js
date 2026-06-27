import api from './api.js'

export const wishlistService = {
  /**
   * Fetch all wishlisted products for current user
   */
  async getWishlist(page = 0, size = 12) {
    const response = await api.get('/wishlist', {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Save a product to wishlist
   */
  async addToWishlist(productId) {
    const response = await api.post(`/wishlist/${productId}`)
    return response.data
  },

  /**
   * Remove a product from wishlist
   */
  async removeFromWishlist(productId) {
    const response = await api.delete(`/wishlist/${productId}`)
    return response.data
  }
}
