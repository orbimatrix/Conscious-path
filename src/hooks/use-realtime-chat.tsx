'use client'

import { createClient } from '@/lib/client'
import { useCallback, useEffect, useState } from 'react'

interface UseRealtimeChatProps {
  roomName: string
  username: string
}

export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
  }
  createdAt: string
}

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!roomName || !username) return

    console.log(`🔌 Connecting to room: ${roomName} as user: ${username}`)
    
    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        console.log(`📨 Received message in ${roomName}:`, payload)
        const newMessage = payload.payload as ChatMessage
        
        // Additional debugging for message reception
        console.log(`🔍 Message Details:`, {
          roomName,
          username,
          messageId: newMessage.id,
          messageContent: newMessage.content,
          messageUser: newMessage.user.name,
          currentUser: username,
          isOwnMessage: newMessage.user.name === username
        });
        
        // Check if this message already exists to prevent duplicates
        setMessages((current) => {
          const messageExists = current.some(msg => 
            msg.id === newMessage.id || 
            (msg.content === newMessage.content && 
             msg.user.name === newMessage.user.name &&
             Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000)
          )
          
          if (messageExists) {
            console.log(`🔄 Duplicate message detected, not adding: ${newMessage.content}`)
            return current
          }
          
          console.log(`➕ Adding new message: ${newMessage.content} from ${newMessage.user.name}`)
          return [...current, newMessage]
        })
      })
      .subscribe(async (status) => {
        console.log(`📡 Channel ${roomName} status: ${status}`)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          console.log(`✅ Connected to room: ${roomName}`)
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          console.error(`❌ Channel error for room: ${roomName}`)
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false)
          console.error(`⏰ Channel timeout for room: ${roomName}`)
        } else if (status === 'CLOSED') {
          setIsConnected(false)
          console.log(`🔒 Channel closed for room: ${roomName}`)
        } else if (status === 'PENDING') {
          console.log(`⏳ Channel pending for room: ${roomName}`)
        }
      })

    setChannel(newChannel)

    return () => {
      console.log(`🔌 Disconnecting from room: ${roomName}`)
      supabase.removeChannel(newChannel)
      setIsConnected(false)
    }
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) {
        console.error(`❌ Cannot send message to ${roomName}: channel or connection not ready`)
        console.log(`Channel: ${!!channel}, Connected: ${isConnected}`)
        return
      }

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      }

      console.log(`📤 Sending message to ${roomName}:`, message)

      // Update local state immediately for the sender
      setMessages((current) => {
        // Check if message already exists to prevent duplicates
        const messageExists = current.some(msg => 
          msg.content === message.content && 
          msg.user.name === message.user.name &&
          Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000
        )
        
        if (messageExists) {
          console.log(`🔄 Message already exists locally, not adding duplicate`)
          return current
        }
        
        console.log(`➕ Adding message to local state: ${message.content}`)
        return [...current, message]
      })

      try {
        const result = await channel.send({
          type: 'broadcast',
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        })
        console.log(`✅ Message sent successfully to ${roomName}:`, result)
        console.log(`📡 Broadcast Details:`, {
          roomName,
          username,
          messageId: message.id,
          messageContent: message.content,
          messageUser: message.user.name,
          broadcastResult: result
        });
      } catch (error) {
        console.error(`❌ Error sending message to ${roomName}:`, error)
        // Remove the message from local state if sending failed
        setMessages((current) => current.filter(msg => msg.id !== message.id))
      }
    },
    [channel, isConnected, username, roomName]
  )

  return { messages, sendMessage, isConnected }
}
