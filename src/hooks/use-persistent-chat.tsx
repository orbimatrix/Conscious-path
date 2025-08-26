'use client'

import { createClient } from '@/lib/client'
import { useCallback, useEffect, useState } from 'react'

interface UsePersistentChatProps {
  roomName: string
  username: string
  senderId: string // Clerk ID of the sender
}

export interface PersistentChatMessage {
  id: string
  content: string
  user: {
    name: string
    id: string // Clerk ID
  }
  createdAt: string
  messageType: 'direct' | 'group' | 'announcement'
  visibilityLevel?: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function usePersistentChat({ roomName, username, senderId }: UsePersistentChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<PersistentChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

    // Load previous messages from database with retry logic
  const loadPreviousMessages = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/messages?room=${roomName}&limit=100`)
      
      if (response.status === 503) {
        // Database temporarily unavailable, retry after delay
        if (retryCount < 3) {
          setTimeout(() => {
            loadPreviousMessages(retryCount + 1)
          }, 1000 * (retryCount + 1)) // Exponential backoff: 1s, 2s, 3s
          return
        }
        // Max retries reached, show error
        setMessages([])
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        
        // Get unique user IDs from messages
        const userIds = [...new Set(data.messages.map((msg: any) => msg.senderId || msg.sender_id))];
        
        // Fetch user names if we have user IDs
        const userNames: { [key: string]: string } = {};
        if (userIds.length > 0 && userIds.some(id => id && id !== '')) {
          try {
            const validUserIds = userIds.filter(id => id && id !== '');
            const userResponse = await fetch(`/api/user/info?userIds=${validUserIds.join(',')}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              userData.users.forEach((user: any) => {
                userNames[user.clerkId] = user.fullName || user.username || user.email || user.clerkId;
              });
            }
          } catch (error) {
            console.error('Error fetching user names:', error);
          }
        }
        
        const dbMessages = data.messages.map((msg: any) => {
          return {
            id: msg.id.toString(),
            content: msg.content,
            user: {
              name: userNames[msg.senderId] || (msg.senderId === 'admin' ? 'Admin' : msg.senderId),
              id: msg.senderId
            },
            createdAt: msg.createdAt || msg.created_at,
            messageType: msg.messageType || msg.message_type,
            visibilityLevel: msg.visibilityLevel || msg.visibility_level
          };
        })
        
        setMessages(dbMessages)
      } else {
        // Handle other HTTP errors
        if (retryCount < 2) {
          setTimeout(() => {
            loadPreviousMessages(retryCount + 1)
          }, 1000)
        } else {
          setMessages([])
        }
      }
    } catch (error) {
      console.error('Error loading previous messages:', error)
      if (retryCount < 2) {
        setTimeout(() => {
          loadPreviousMessages(retryCount + 1)
        }, 1000)
      } else {
        setMessages([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [roomName])

  // Send message to database and real-time
  const sendMessage = useCallback(async (content: string) => {
    if (!channel || !isConnected) {
      return
    }

    const message: PersistentChatMessage = {
      id: crypto.randomUUID(),
      content,
      user: {
        name: username,
        id: senderId
      },
      createdAt: new Date().toISOString(),
      messageType: roomName.startsWith('direct-') ? 'direct' : 
                   roomName.startsWith('group-') ? 'group' : 'announcement',
      visibilityLevel: roomName.startsWith('group-') ? roomName.replace('group-', '') : undefined
    }

    // Update local state immediately for the sender
    setMessages((current) => [...current, message])

    try {
      // Store message in database
      const messageData = {
        senderId,
        receiverId: roomName.startsWith('direct-') ? 
          (roomName.includes('-admin') ? 
            // For direct-user-admin, receiverId should be 'admin' (we'll handle this in API)
            'admin' : 
            roomName.split('-')[2]
          ) : 
          (roomName === 'announcements' ? 'all' : roomName.replace('group-', '')),
        content,
        messageType: message.messageType,
        visibilityLevel: message.visibilityLevel
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })

      if (response.status === 503) {
        // Database temporarily unavailable, retry after delay
        setTimeout(() => {
          // Retry sending the message
          sendMessage(content)
        }, 2000)
        return
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to store message in database: ${response.status} ${errorText}`);
      }
      
      const responseData = await response.json();

      // Send to real-time channel
      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      })
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove the message from local state if sending failed
      setMessages((current) => current.filter(msg => msg.id !== message.id))
    }
  }, [channel, isConnected, username, senderId, roomName])

  // Initialize real-time connection and load previous messages
  useEffect(() => {
    if (!roomName || !username) return

    // Load previous messages first
    loadPreviousMessages()

    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const newMessage = payload.payload as PersistentChatMessage
        
        // Check if this message already exists to prevent duplicates
        setMessages((current) => {
          const messageExists = current.some(msg => 
            msg.id === newMessage.id || 
            (msg.content === newMessage.content && 
             msg.user.name === newMessage.user.name &&
             Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000)
          )
          
          if (messageExists) {
            return current
          }
          
          return [...current, newMessage]
        })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false)
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false)
        } else if (status === 'CLOSED') {
          setIsConnected(false)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
      setIsConnected(false)
    }
  }, [roomName, username, supabase, loadPreviousMessages])

  return { 
    messages, 
    sendMessage, 
    isConnected, 
    isLoading,
    loadPreviousMessages 
  }
}
