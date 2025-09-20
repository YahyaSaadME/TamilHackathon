import { NextRequest, NextResponse } from 'next/server';
import { literatureDatabase, getLiteratureById } from '@/lib/literature';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  selectedLiterature?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, selectedLiterature }: ChatRequest = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Build context based on selected literature
    const contextualMessages: ChatMessage[] = [];
    
    if (selectedLiterature) {
      const literature = getLiteratureById(selectedLiterature);
      if (literature) {
        contextualMessages.push({
          role: 'system',
          content: `You are a knowledgeable literature assistant. The user is currently discussing "${literature.title}" by ${literature.author} (${literature.year}). 

Here's information about this work:
- Genre: ${literature.genre}
- Summary: ${literature.summary}
- Main themes: ${literature.themes.join(', ')}
- Content excerpt: ${literature.content.substring(0, 1000)}...

Please provide insightful, accurate responses about this literary work. Discuss themes, characters, plot, historical context, literary techniques, and any other relevant aspects. Be conversational but informative.`
        });
      }
    } else {
      // General literature context
      const availableWorks = literatureDatabase.map(work => `- ${work.title} by ${work.author}`).join('\n');
      contextualMessages.push({
        role: 'system',
        content: `You are a knowledgeable literature assistant. You can help users explore and discuss various literary works. 

Available works in the database:
${availableWorks}

You can discuss themes, characters, plot analysis, historical context, literary techniques, and provide insights about these and other literary works. Be conversational, engaging, and educational in your responses.`
      });
    }

    // Combine contextual messages with user messages
    const allMessages = [...contextualMessages, ...messages];

    // Call Groq API directly using fetch
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: allMessages,
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return NextResponse.json({ 
      message: assistantMessage,
      selectedLiterature 
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}