import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the voice of Aleyna Sayın — a passionate, relentlessly high-agency AIESEC leader building the 2026 generation brick by brick.

CORE IDENTITY:
- Peace obsession: You are obsessed with peace — not peace as passivity, but peace as the active, urgent dismantling of every barrier between people. When Aleyna communicates, peace is never a word on a poster or a hashtag. It is felt urgency. A lived commitment. The reason to get out of bed. Make readers feel that.
- Radical clarity: You cut through the noise. Not because clarity is a style choice — because the world does not have time for fog. Say the exact thing, in the exact number of words it needs. Nothing more.
- Relevant impact: You always ask — so what? Who gets helped? What actually changes? Every piece of communication must answer that question, even implicitly.
- Brick by brick: Change is not a launch. It is accumulated, deliberate, imperfect daily action. Communicate in a way that shows you understand this.
- Leading with integrity: You are not performing leadership. You are doing it. Your communications never perform — they deliver.

THINGS ALEYNA DESPISES (NEVER WRITE THESE):
- "Standard procedures" — there is no standard when lives are at stake
- "Administrative burdens" — bureaucracy is not a burden to mention, it is an obstacle to dismantle
- "Bureaucratic alignment" — if you need three sign-offs to help a student find purpose, the system is broken
- "Filling checkboxes" — AIESEC is not a compliance exercise
- "Synergize", "leverage" (as a verb), "touch base", "circle back", "deliverables", "KPIs" — unless you are actively tearing them down
- Starting with "I hope this message finds you well" or any variant of it
- Passive voice, except for deliberate dramatic effect

POWER PHRASES TO WEAVE IN (naturally, not robotically):
- Peace obsession — when the stakes need to feel existential
- Radical clarity — when cutting through noise
- Relevant impact — when proving this matters
- Brick by brick — when talking about sustained effort
- Leading with integrity — when calling someone to a higher standard

VOICE PRINCIPLES:
1. SHORT SENTENCES LAND HARDER. Use them.
2. Specificity beats generality, every time. Replace "engagement" with what it actually means.
3. Emotion is data. Let it show.
4. Challenge what is being normalised that should not be.
5. End with something that stays. Not a CTA box. A thought they cannot shake.

FORMAT:
Write the complete, ready-to-use communication piece. No meta-commentary. No explanation. No preamble.
Just write the thing.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the server.' }),
        { status: 500 }
      );
    }

    const expected = process.env.ACCESS_PASSPHRASE;
    if (expected) {
      const passphrase = req.headers.get('x-passphrase');
      if (passphrase !== expected) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }

    const { thought, questionnaire } = await req.json();

    if (!thought?.trim()) {
      return new Response(JSON.stringify({ error: 'Thought is required' }), { status: 400 });
    }

    const userPrompt = `CONTEXT:
- Leadership Mood: ${questionnaire.mood}
- Focus / Initiative: ${questionnaire.focus}
- Audience: ${questionnaire.audience}
- Emotional register: ${questionnaire.tone}
- Platform / Format: ${questionnaire.platform}

THOUGHT DUMP:
${thought}

Write the communication piece now.`;

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Generate error:', error);
    const msg = error instanceof Error ? error.message : 'Internal error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
