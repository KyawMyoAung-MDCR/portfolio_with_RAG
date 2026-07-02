import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

const EMBEDDING_DIMENSION = 3072; // 

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

type HistoryRow = {
  role: string;
  message: string;
};

type DocumentRow = {
  content: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];
    const sessionId: string = body.sessionId || 'default';

    const last = messages[messages.length - 1];

    if (!last?.content) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const question = last.content;

    // SAVE USER
    const saveUser = await supabase.from('chat_history').insert([
      { session_id: sessionId, role: 'user', message: question },
    ]);
    if (saveUser.error) console.error('SAVE USER ERROR:', saveUser.error);

    // EMBEDDING
    let vector: number[] | undefined;
    try {
      const embed = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: question,
        config: {
          taskType: 'RETRIEVAL_QUERY',
          outputDimensionality: EMBEDDING_DIMENSION,
        },
      });
      vector = embed.embeddings?.[0]?.values;
    } catch (err) {
      console.error('EMBED ERROR:', err);
      vector = undefined;
    }

    // RAG
    let context = '';
    if (vector) {
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: vector,
        match_threshold: 0.2,
        match_count: 5,
      });

      if (error) {
        console.error('RPC ERROR:', error);
      }

      const docs = (data || []) as DocumentRow[];
      context = docs.map(d => d.content).join('\n\n'); 
    }

    // HISTORY
    
    const { data: history, error: historyError } = await supabase
      .from('chat_history')
      .select('role,message')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false }) 
      .limit(20);

    if (historyError) console.error('HISTORY ERROR:', historyError);

    const rows = ((history || []) as HistoryRow[]).reverse(); 
    const historyText = rows.map(h => `${h.role}: ${h.message}`).join('\n');

    // PROMPT
    const prompt = `
You are the portfolio assistant for Kyaw Myo Aung.

Conversation History (previous questions and answers in this session):
${historyText}

Portfolio Knowledge (facts about Kyaw Myo Aung from his documents):
${context}

Current Question:
${question}

Rules:
- If the question asks about "previous questions", "history", "earlier questions", "what did I ask", or similar — answer using the Conversation History section above, NOT the Portfolio Knowledge section.
- If the question asks about Kyaw Myo Aung himself (skills, education, background, projects, etc.) — answer using the Portfolio Knowledge section.
- If neither section has relevant information, say so honestly instead of guessing.
- Keep answers concise.
`;

    // GENERATE
    let reply = '';
    try {
      const modelsToTry = [
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite', 
        'gemini-3.1-flash-lite', 
      ];

      let result;
      let lastError: unknown;

      for (const model of modelsToTry) {
        try {
          result = await ai.models.generateContent({
            model,
            contents: prompt,
          });
          break;
        } catch (err) {
          console.error(`FAILED with model ${model}:`, err);
          lastError = err;
          result = undefined;
        }
      }

      if (!result) {
        throw lastError;
      }

      reply = result.text || 'No response';
    } catch (error: unknown) {
      console.error('GEMINI ERROR:', error);
      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? (error as { status?: number }).status
          : undefined;

      if (status === 429) {
        reply =
          "I'm currently experiencing high demand. Please try again in a moment, or feel free to contact me directly!";
      } else if (status === 503) {
        reply = 'AI service is busy. Please retry in a moment.';
      } else {
        reply = 'Unable to generate response.';
      }
    }

    // SAVE MODEL
    const saveModel = await supabase.from('chat_history').insert([
      { session_id: sessionId, role: 'model', message: reply },
    ]);
    if (saveModel.error) console.error('SAVE MODEL ERROR:', saveModel.error);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('CHAT ROUTE ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}