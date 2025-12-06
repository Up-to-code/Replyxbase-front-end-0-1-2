import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, agentId } = body;

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response for now
    // In a real app, this would call OpenAI or another LLM
    return NextResponse.json({ 
      response: `I received your message: "${message}". I am a demo agent (ID: ${agentId}).` 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
