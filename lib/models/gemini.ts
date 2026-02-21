import "server-only";
import { GoogleGenAI } from "@google/genai";

export interface GeminiConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

export const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

const GEMINI_MODEL = "gemini-2.5-flash";

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable.");
  }
  return apiKey;
}

function createGenAI(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: getApiKey() });
}

async function generateStatelessText(prompt: string, config: GeminiConfig = {}): Promise<string> {
  const input = prompt?.trim();
  if (!input) {
    throw new Error("Prompt must be a non-empty string.");
  }

  const ai = createGenAI();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: input,
    config: {
      temperature: config.temperature ?? generationConfig.temperature,
      topP: config.topP ?? generationConfig.topP,
      topK: config.topK ?? generationConfig.topK,
      maxOutputTokens: config.maxOutputTokens ?? generationConfig.maxOutputTokens,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty text response.");
  }

  return text;
}

function createChatSession(defaultConfig: GeminiConfig) {
  return {
    async sendMessage(input: string) {
      const text = await runGemini(input, defaultConfig);
      return {
        response: {
          text: () => text,
        },
      };
    },
  };
}

export const chatSession = createChatSession(generationConfig);
export const GenAiCode = createChatSession(CodeGenerationConfig);

export async function runGemini(prompt: string, config: GeminiConfig = {}): Promise<string> {
  try {
    return await generateStatelessText(prompt, config);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Gemini request failed: ${error.message}`);
    }
    throw new Error("Gemini request failed with an unknown error.");
  }
}
