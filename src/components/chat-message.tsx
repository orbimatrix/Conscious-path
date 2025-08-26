import { cn } from '@/lib/utils'
import type { PersistentChatMessage } from '@/hooks/use-persistent-chat'

interface ChatMessageItemProps {
  message: PersistentChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-2 mb-1', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <span className={'font-medium text-gray-700'}>{message.user.name}</span>
            <span className="text-gray-500 text-xs">
              {message.createdAt ? new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }) : 'Invalid Date'}
            </span>
          </div>
        )}
        <div
          className={cn(
            'py-2 px-3 rounded-xl text-sm w-fit shadow-sm',
            isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
