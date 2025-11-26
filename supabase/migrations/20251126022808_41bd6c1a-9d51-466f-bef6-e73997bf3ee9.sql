-- Fase 4: Agregar columnas para tracking de sesión y memoria de largo plazo
ALTER TABLE conversation_summaries 
ADD COLUMN IF NOT EXISTS session_tone text DEFAULT 'friendly',
ADD COLUMN IF NOT EXISTS session_mood text DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS session_interaction text DEFAULT 'advise',
ADD COLUMN IF NOT EXISTS last_message_at timestamptz DEFAULT now();

-- Agregar política RLS para INSERT desde edge function (service role)
CREATE POLICY "Service role can insert summaries"
ON conversation_summaries FOR INSERT
TO service_role
WITH CHECK (true);

-- Agregar política RLS para UPDATE desde edge function (service role)
CREATE POLICY "Service role can update summaries"
ON conversation_summaries FOR UPDATE
TO service_role
USING (true);