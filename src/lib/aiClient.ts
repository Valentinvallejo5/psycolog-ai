import { supabase } from "@/integrations/supabase/client";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type AIParams = {
  temperature?: number;
  maxTokens?: number;
};

export async function askAI(
  messages: Message[],
  params: AIParams = {}
): Promise<{ text: string; limitReached?: boolean }> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { messages, params }
    });

    if (error) throw error;
    
    if (data.error) {
      if (data.error === 'rate_limit') {
        throw new Error('RATE_LIMIT');
      }
      if (data.error === 'credits_exhausted') {
        throw new Error('CREDITS_EXHAUSTED');
      }
      throw new Error(data.error);
    }

    return {
      text: data.text || "Sin respuesta / No response",
      limitReached: data.meta?.limit_reached || false
    };
  } catch (err) {
    console.error('AI Client Error:', err);
    throw err;
  }
}
