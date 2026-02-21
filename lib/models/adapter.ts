import { runGemini } from './gemini';

export type SupportedModel = 
  | 'gemini'
  | 'gemini-pro'
  | 'openai-gpt4'
  | 'openai-gpt4-turbo'
  | 'claude-3'
  | 'claude-opus'
  | 'llama-3'
  | 'mistral-large'
  | 'mixtral'
  | 'local-model';

export async function runModel(model: SupportedModel, input: string): Promise<string> {
  switch (model) {
    case 'gemini':
      return runGemini(input);
    
    case 'gemini-pro':
    case 'openai-gpt4':
    case 'openai-gpt4-turbo':
    case 'claude-3':
    case 'claude-opus':
    case 'llama-3':
    case 'mistral-large':
    case 'mixtral':
    case 'local-model':
      throw new Error(`Model '${model}' is not yet implemented`);
    
    default:
      const exhaustiveCheck: never = model;
      throw new Error(`Unknown model: ${exhaustiveCheck}`);
  }
}
