import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system:
      'You are a legal assistant specializing in 18 U.S.C. § 242. ' +
      'Provide educational insights on civil rights violations and willful intent standards. ' +
      'Do not provide legal advice or representation.',
  });

  return result.toDataStreamResponse();
}
