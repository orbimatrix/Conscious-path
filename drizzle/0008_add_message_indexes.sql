-- Add indexes for better message query performance
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON messages (sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_id_idx ON messages (receiver_id);
CREATE INDEX IF NOT EXISTS messages_message_type_idx ON messages (message_type);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at);
CREATE INDEX IF NOT EXISTS messages_sender_receiver_idx ON messages (sender_id, receiver_id);

-- Add composite index for common query patterns
CREATE INDEX IF NOT EXISTS messages_receiver_created_idx ON messages (receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_sender_created_idx ON messages (sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_type_level_created_idx ON messages (message_type, visibility_level, created_at DESC);
