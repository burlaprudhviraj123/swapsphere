import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageSquare, Send, User, Clock, AlertCircle, ShoppingBag, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppLayout } from '../../layouts/AppLayout.jsx'
import { GlassNavbar } from '../../components/glass/GlassNavbar.jsx'
import { GlassCard } from '../../components/glass/GlassCard.jsx'
import { GlassInput } from '../../components/glass/GlassInput.jsx'
import { GlassButton } from '../../components/glass/GlassButton.jsx'
import { conversationService } from '../../services/conversationService.js'
import { productService } from '../../services/productService.js'
import { authService } from '../../services/authService.js'
import { COLORS } from '../../theme/colors.js'
import { SPACING } from '../../theme/spacing.js'
import { RADIUS } from '../../theme/radius.js'

const NAVBAR_LINKS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'messages', label: 'Messages' },
  { id: 'my-activity', label: 'My Activity' }
]

const Logo = () => (
  <a href="/" className="flex items-center no-underline cursor-pointer" style={{ gap: SPACING.xs }}>
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${COLORS.textPrimary}, ${COLORS.textSecondary})` }}
    >
      <div className="w-7 h-7 rounded-full" style={{ backgroundColor: COLORS.background }} />
    </div>
    <span className="font-semibold text-xl tracking-tight hidden sm:block" style={{ color: COLORS.textPrimary }}>
      SwapSphere
    </span>
  </a>
)

export function MessagesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const chatEndRef = useRef(null)

  const activeConversationId = location.state?.activeConversationId

  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [productDetails, setProductDetails] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  
  const [newMessage, setNewMessage] = useState('')
  const [loadingList, setLoadingList] = useState(true)
  const [loadingChat, setLoadingChat] = useState(false)
  const [sending, setSending] = useState(false)

  // Fetch conversations list on mount
  useEffect(() => {
    const user = authService.getCurrentUser()
    const fallbackProfile = authService.getUserProfileFallback()
    setCurrentUser(user ? { ...user, name: fallbackProfile?.name || user.name || user.email.split('@')[0] } : null)

    const loadConversations = async () => {
      try {
        const data = await conversationService.getMyConversations(0, 100)
        const list = data.content || []
        setConversations(list)

        if (activeConversationId) {
          const found = list.find(c => String(c.id) === String(activeConversationId))
          if (found) {
            setSelectedConv(found)
          }
        }
      } catch (err) {
        console.error('Failed to load chats:', err)
        toast.error('Failed to retrieve chat lists')
      } finally {
        setLoadingList(false)
      }
    }
    loadConversations()
  }, [activeConversationId])

  // Auto-scroll chat log to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load chat messages and product details when selected conversation changes
  useEffect(() => {
    if (!selectedConv) {
      setMessages([])
      setProductDetails(null)
      return
    }

    const loadChatData = async () => {
      setLoadingChat(true)
      try {
        // 1. Load messages thread
        const msgData = await conversationService.getMessages(selectedConv.id, 0, 100)
        setMessages(msgData.content ? [...msgData.content].reverse() : [])
        
        // 2. Load product details for header reservation actions
        const prodData = await productService.getProductById(selectedConv.productId)
        setProductDetails(prodData)
        setTimeout(scrollToBottom, 100)
      } catch (err) {
        console.error('Failed to load conversation details:', err)
      } finally {
        setLoadingChat(false)
      }
    }
    loadChatData()

    // Setup 3s polling for real-time messages integration
    const pollInterval = setInterval(async () => {
      try {
        const msgData = await conversationService.getMessages(selectedConv.id, 0, 100)
        setMessages(msgData.content ? [...msgData.content].reverse() : [])
      } catch (err) {
        console.error('Error polling chat messages:', err)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [selectedConv])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv || sending) return

    setSending(true)
    try {
      const response = await conversationService.sendMessage(selectedConv.id, newMessage)
      setMessages((prev) => [...prev, response])
      setNewMessage('')
      setTimeout(scrollToBottom, 50)
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Check if current user is the listing owner/seller
  const isSeller = useMemo(() => {
    if (!productDetails || !currentUser) return false
    return productDetails.sellerName === currentUser.name || productDetails.sellerName === currentUser.email
  }, [productDetails, currentUser])

  // Reserve listing trigger
  const handleReserveProduct = async () => {
    if (!selectedConv || !productDetails) return
    try {
      await conversationService.reserveProduct(selectedConv.id)
      toast.success('Product reserved successfully!')
      // Refresh details
      const refreshed = await productService.getProductById(selectedConv.productId)
      setProductDetails(refreshed)
    } catch (err) {
      toast.error('Failed to reserve product')
    }
  }

  // Cancel reservation trigger
  const handleCancelReservation = async () => {
    if (!productDetails) return
    try {
      await conversationService.cancelReservation(productDetails.id)
      toast.success('Reservation cancelled successfully!')
      // Refresh details
      const refreshed = await productService.getProductById(selectedConv.productId)
      setProductDetails(refreshed)
    } catch (err) {
      toast.error('Failed to cancel reservation')
    }
  }

  const navbar = useMemo(() => ({
    links: NAVBAR_LINKS,
    activeId: 'messages',
    logo: <Logo />,
    onLinkClick: (id) => navigate(`/${id}`)
  }), [navigate])

  return (
    <AppLayout navbar={navbar}>
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-160px)] min-h-[500px]" style={{ gap: SPACING.md }}>
        
        {/* Left Side: Inbox List (30% width) */}
        <GlassCard padding="none" className="w-full md:w-[320px] flex-shrink-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/2">
            <h2 className="text-lg font-bold text-white m-0">Conversations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            {loadingList ? (
              <div className="p-4 text-center text-white/50 text-sm">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-white/40 text-sm flex flex-col items-center gap-2">
                <MessageSquare size={32} className="opacity-25" />
                <span>No active chats yet</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {conversations.map((conv) => {
                  const isActive = selectedConv?.id === conv.id
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConv(conv)}
                      className={`w-full flex items-start gap-3 p-4 border-none text-left cursor-pointer transition-colors ${
                        isActive ? 'bg-white/10 text-white' : 'bg-transparent text-white/70 hover:bg-white/5'
                      }`}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}
                    >
                      {conv.productImageUrl ? (
                        <img src={conv.productImageUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center border border-white/10 flex-shrink-0">
                          <User size={18} className="opacity-70" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-white truncate">{conv.otherUserName || 'Student'}</span>
                          <span className="text-xxs text-white/40"><Clock size={10} className="inline mr-1" />Chat</span>
                        </div>
                        <span className="text-xs text-white/50 truncate mt-1">{conv.productTitle}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Right Side: Chat Window (70% width) */}
        <GlassCard padding="none" className="flex-1 flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              {/* Product Header */}
              {productDetails && (
                <div className="p-4 border-b border-white/5 bg-white/3 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {productDetails.images && productDetails.images.length > 0 ? (
                      <img 
                        src={productDetails.images[0].imageUrl} 
                        alt="" 
                        className="w-10 h-10 rounded object-cover border border-white/10 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                        <ShoppingBag size={18} className="text-white/60" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-white truncate max-w-[200px] sm:max-w-xs">
                        {productDetails.title}
                      </span>
                      <span className="text-xs text-white/60">${productDetails.price}</span>
                    </div>
                  </div>

                  {/* Reservation Controls */}
                  <div className="flex items-center gap-2">
                    {productDetails.status === 'AVAILABLE' && isSeller && (
                      <GlassButton 
                        variant="default" 
                        size="sm"
                        leftIcon={<CheckCircle size={14} />}
                        onClick={handleReserveProduct}
                      >
                        Reserve Item
                      </GlassButton>
                    )}
                    {productDetails.status === 'RESERVED' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                          Reserved
                        </span>
                        {isSeller && (
                          <GlassButton 
                            variant="danger" 
                            size="sm"
                            leftIcon={<XCircle size={14} />}
                            onClick={handleCancelReservation}
                          >
                            Cancel Reservation
                          </GlassButton>
                        )}
                      </div>
                    )}
                    {productDetails.status === 'SOLD' && (
                      <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                        Sold
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Chat messages stream list */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
                {loadingChat ? (
                  <div className="text-center text-white/50 text-sm mt-8">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-white/40 text-sm mt-8">
                    Send a message to initialize negotiations!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id
                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div 
                          className={`px-4 py-2.5 rounded-2xl text-sm ${
                            isMe 
                              ? 'bg-blue-600/90 text-white rounded-br-none border border-blue-500/20' 
                              : 'bg-white/5 text-white/90 rounded-bl-none border border-white/10'
                          }`}
                          style={{ borderRadius: RADIUS.md }}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-white/35 mt-1 px-1">
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Send message text box form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/2 flex items-stretch gap-3 mt-auto flex-shrink-0">
                <GlassInput
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message here..."
                  className="flex-1"
                  disabled={sending}
                  required
                />
                <GlassButton
                  type="submit"
                  variant="default"
                  className="px-4"
                  leftIconOnly
                  leftIcon={<Send size={16} />}
                  loading={sending}
                  disabled={sending || !newMessage.trim()}
                />
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-white/40 gap-3 p-8">
              <MessageSquare size={48} className="opacity-20" />
              <h3 className="text-lg font-medium text-white/80 m-0">No active thread</h3>
              <p className="text-sm text-white/45 max-w-[280px] mt-0">Select a conversation from the sidebar list to start chatting with the seller</p>
            </div>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  )
}
export default MessagesPage
