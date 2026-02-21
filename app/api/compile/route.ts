import { analyzeIntent, buildAST, calculateMetrics } from '@/lib/compiler-engine';
import { runModel } from '@/lib/models/adapter';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      const raw = await request.text();
      console.error('[Compile API] Invalid JSON body received:', raw.slice(0, 1000));
      return NextResponse.json(
        { error: 'Invalid JSON body', raw: raw.slice(0, 1000) },
        { status: 400 }
      );
    }

    const { code, model = 'gemini' } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    if (model !== 'gemini') {
      return NextResponse.json(
        { error: `Model '${model}' is not yet available. Only Gemini is currently active.` },
        { status: 400 }
      );
    }

    // Perform intent analysis
    const intentAnalysis = analyzeIntent(code);

    // Build AST
    const ast = buildAST(code, intentAnalysis);

    // Create base system prompt
    const baseSystemPrompt = `You are an expert prompt engineer. Your task is to optimize and refine user intents into clear, structured prompts.

Domain: ${intentAnalysis.domain}
Task Type: ${intentAnalysis.taskType}
Constraints: ${intentAnalysis.constraints.join(', ') || 'None'}

Based on this analysis, create an optimized system prompt that would guide an AI to best handle this task.`;

    // Call Gemini to generate optimized prompts
    const optimizedOutput = await runModel('gemini', baseSystemPrompt);

    // Extract system and user prompts from Gemini response
    const systemPrompt = extractSystemPrompt(optimizedOutput, code);
    const userPrompt = extractUserPrompt(optimizedOutput, code);

    // Calculate metrics
    const metrics = calculateMetrics({
      code,
      constraints: intentAnalysis.constraints,
      astDepth: getASTDepth(ast),
    });

    return NextResponse.json({
      success: true,
      data: {
        systemPrompt,
        userPrompt,
        ast,
        metrics: {
          estimatedTokens: metrics.estimatedTokens,
          estimatedCost: metrics.estimatedCost,
          reliabilityScore: metrics.reliabilityScore,
          complexityScore: metrics.complexityScore,
        },
        model: 'gemini',
        compiledAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Compile API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Compilation failed' },
      { status: 500 }
    );
  }
}

function extractSystemPrompt(response: string, userInput: string): string {
  // If Gemini response contains system prompt section, extract it
  const systemMatch = response.match(/(?:System Prompt|System Instructions?)[:\n]+([\s\S]*?)(?:\n\n|User|$)/i);
  if (systemMatch?.[1]) {
    return systemMatch[1].trim();
  }
  
  // Fallback: use the first part of the response
  return response.split('\n\n')[0] || response;
}

function extractUserPrompt(response: string, userInput: string): string {
  // If Gemini response contains user prompt section, extract it
  const userMatch = response.match(/(?:User Prompt|User Input|User Message)[:\n]+([\s\S]*?)(?:\n\n|$)/i);
  if (userMatch?.[1]) {
    return userMatch[1].trim();
  }
  
  // Fallback: use original input if optimization didn't create a separate user prompt
  return userInput;
}

function getASTDepth(ast: any): number {
  if (!ast || typeof ast !== 'object') return 0;
  
  let maxDepth = 0;
  const traverse = (node: any, depth: number) => {
    if (depth > maxDepth) maxDepth = depth;
    if (Array.isArray(node)) {
      node.forEach(item => traverse(item, depth + 1));
    } else if (typeof node === 'object' && node !== null) {
      Object.values(node).forEach(value => traverse(value, depth + 1));
    }
  };
  
  traverse(ast, 0);
  return maxDepth;
}
