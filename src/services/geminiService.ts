import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAnalysis(decision: string, type: AnalysisType) {
  const model = "gemini-3-flash-preview";

  let responseSchema: any;
  let prompt = "";

  if (type === AnalysisType.PROS_CONS) {
    prompt = `Analyze the following decision and provide a list of pros and cons, along with a final verdict: "${decision}"`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        verdict: { type: Type.STRING },
      },
      required: ["pros", "cons", "verdict"],
    };
  } else if (type === AnalysisType.COMPARISON) {
    prompt = `Analyze the following decision by comparing different options. Identify the options and criteria. Provide a list of comparison entries where each entry links an option and a criterion to a specific value. Also provide a final verdict: "${decision}"`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        criteria: { type: Type.ARRAY, items: { type: Type.STRING } },
        entries: { 
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              option: { type: Type.STRING, description: "The name of the option being compared" },
              criterion: { type: Type.STRING, description: "The specific criterion for comparison" },
              value: { type: Type.STRING, description: "The value or description for this option and criterion" }
            },
            required: ["option", "criterion", "value"]
          }
        },
        verdict: { type: Type.STRING },
      },
      required: ["options", "criteria", "entries", "verdict"],
    };
  } else if (type === AnalysisType.SWOT) {
    prompt = `Perform a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the following decision, along with a final verdict: "${decision}"`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
        verdict: { type: Type.STRING },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats", "verdict"],
    };
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  return JSON.parse(response.text);
}
