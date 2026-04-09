import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Save file to temporary directory
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `resume_${Date.now()}.pdf`);
    fs.writeFileSync(tempFilePath, buffer);

    // 2. Run Python analysis
    let pythonOutput;
    try {
      const scriptPath = path.join(process.cwd(), "src/lib/python/analyze_resume.py");
      const command = `python "${scriptPath}" "${tempFilePath}"`;
      pythonOutput = JSON.parse(execSync(command, { encoding: "utf8" }));
      
      if (!pythonOutput.success) {
         throw new Error(pythonOutput.error || "Python analysis failed");
      }
    } catch (pyError: any) {
      console.error("Python Error:", pyError);
      return NextResponse.json({ error: "Failed to parse PDF: " + pyError.message }, { status: 500 });
    } finally {
      // Cleanup temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }

    // 3. Use OpenAI to structure and enhance the data (with fallback)
    const prompt = `
      You are an expert career consultant and ATS (Applicant Tracking System) specialist.
      Analyze the following resume data extracted by a Python NLP tool and generate a comprehensive ResumeAnalysis JSON object.
      
      RAW TEXT:
      ${pythonOutput.raw_text}
      
      NLP ENTITIES:
      ${JSON.stringify(pythonOutput.analysis.analysis)}
      
      Return ONLY valid JSON properly formatted.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }, {
        timeout: 10000, // 10s timeout for AI
      });

      const finalAnalysis = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json(finalAnalysis);
    } catch (aiError) {
      console.warn("AI Analysis failed or timed out, falling back to Python-only analysis:", aiError);
      
      // FALLBACK: Use the result directly from our enhanced Python script
      // The Python script 'analysis' field already matches the ResumeAnalysis structure
      return NextResponse.json(pythonOutput.analysis);
    }
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
