import api from './api.js'

export const conversationService = {
  /**
   * Fetch all conversations for the logged-in user (paginated)
   */
  async getMyConversations(page = 0, size = 20) {
    const response = await api.get('/conversations', {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Send a message in a conversation thread
   * @param {number|string} conversationId
   * @param {string} content - text content of message
   * @param {string} type - MessageType: 'TEXT' | 'LOCATION'
   */
  async sendMessage(conversationId, content, type = 'TEXT') {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
      content,
      type
    })
    return response.data
  },

  /**
   * Get messages inside a conversation thread (paginated)
   */
  async getMessages(conversationId, page = 0, size = 50) {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Start a conversation regarding a specific product listing
   */
  async startConversation(productId) {
    const response = await api.post(`/conversations/product/${productId}`)
    return response.data
  },

  /**
   * Reserve a product from a conversation channel (buyer/seller trigger)
   */
  async reserveProduct(conversationId) {
    const response = await api.post(`/conversations/${conversationId}/reserve`)
    return response.data
  },

  /**
   * Cancel a product reservation
   */
  async cancelReservation(productId) {
    const response = await api.post(`/conversations/${productId}/cancel-reservation`)
    return response.data
  },

  /**
   * Fetch all conversations related to a product (useful for seller view)
   */
  async getProductConversations(productId) {
    const response = await api.get(`/conversations/${productId}/conversations`)
    return response.data
  }
}
