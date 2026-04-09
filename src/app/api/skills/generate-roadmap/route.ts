import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFallbackRoadmap } from "@/lib/roadmap-fallbacks";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { skill } = await req.json();

    if (!skill) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert career counselor and technical educator.
      Create a comprehensive learning roadmap for the skill: "${skill}".
      
      The roadmap must be structured into three levels: beginner, intermediate, and advanced.
      For each level, provide 2-3 specific milestones (nodes).
      Each milestone MUST include:
      - title: A clear, descriptive name for the milestone.
      - duration: Estimated time to complete (e.g., "2 weeks").
      - topics: 4-6 specific sub-topics or concepts to learn.
      - project: A practical project idea that reinforces the learning in this milestone.
      
      Also provide a "totalDuration" for the entire roadmap (e.g., "6 months").
      
      Return ONLY a JSON object with the following structure:
      {
        "skill": "${skill}",
        "totalDuration": "string",
        "beginner": [ { "title": "string", "duration": "string", "topics": ["string"], "project": "string" } ],
        "intermediate": [ ... ],
        "advanced": [ ... ]
      }
    `;

    // 1. Try OpenAI (Primary)
    try {
      if (process.env.OPENAI_API_KEY) {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const data = JSON.parse(completion.choices[0].message.content || "{}");
        if (data.skill) return NextResponse.json(data);
      }
    } catch (oaError: any) {
      console.warn("OpenAI Failed, trying Gemini...", oaError.message);
    }

    // 2. Try Gemini (Secondary)
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt + " Return only the JSON without any markdown formatting.");
        const text = result.response.text();
        
        // Clean JSON in case Gemini adds markdown
        const cleanedJson = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanedJson);
        if (data.skill) return NextResponse.json(data);
      }
    } catch (gError: any) {
      console.warn("Gemini Failed, using Local Fallback...", gError.message);
    }

    // 3. Smart Local Fallback (Tertiary)
    const fallbackData = getFallbackRoadmap(skill);
    return NextResponse.json(fallbackData);

  } catch (error: any) {
    console.error("Roadmap Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
