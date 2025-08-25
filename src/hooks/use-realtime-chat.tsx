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

    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const newMessage = payload.payload as ChatMessage
        
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
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) {
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

      // Update local state immediately for the sender
      setMessages((current) => {
        // Check if message already exists to prevent duplicates
        const messageExists = current.some(msg => 
          msg.content === message.content && 
          msg.user.name === message.user.name &&
          Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000
        )
        
        if (messageExists) {
          return current
        }
        
        return [...current, message]
      })

      try {
        await channel.send({
          type: 'broadcast',
          event: EVENT_MESSAGE_TYPE,
          payload: message,
        })
      } catch (error) {
        // Remove the message from local state if sending failed
        setMessages((current) => current.filter(msg => msg.id !== message.id))
      }
    },
    [channel, isConnected, username, roomName]
  )

  return { messages, sendMessage, isConnected }
}
