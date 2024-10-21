import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
export const runtime = 'edge';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
   try {
      const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-8b-8192",
      });

      const content = chatCompletion.choices[0]?.message?.content || '';

      return new Response(content, {
        headers: { 'Content-Type': 'application/json' },
      });
   } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        return NextResponse.json({ message: data.message }, { status });
      }

      return NextResponse.json(
        { message: 'An unexpected error occurred.' },
        { status: 500 }
      );
   }
}
