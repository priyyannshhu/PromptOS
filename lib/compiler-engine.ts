// Compiler Engine for PromptOS
// Handles intent analysis, prompt generation, and metrics calculation

export interface IntentAnalysis {
  domain: string;
  taskType: string;
  constraints: string[];
  outputFormat: string;
  complexity: number;
}

export interface CompilationResult {
  systemPrompt: string;
  userPrompt: string;
  ast: Record<string, any>;
  metrics: {
    estimatedTokens: number;
    estimatedCost: number;
    reliabilityScore: number;
    complexityScore: number;
  };
}

// Intent Analysis - Parse user input and extract key information
export function analyzeIntent(input: string): IntentAnalysis {
  const lines = input.split('\n').filter(l => l.trim());
  
  // Detect domain from keywords
  const domainPatterns: Record<string, string> = {
    'data|analysis|chart|graph|plot': 'data-analysis',
    'code|program|function|algorithm': 'code-generation',
    'story|creative|write|compose': 'creative-writing',
    'question|answer|faq|help': 'qa-assistant',
    'translate|language|grammar': 'language',
    'image|visual|design|ui|ux': 'design',
  };

  let domain = 'general';
  for (const [pattern, d] of Object.entries(domainPatterns)) {
    if (new RegExp(pattern, 'i').test(input)) {
      domain = d;
      break;
    }
  }

  // Detect task type
  const taskPatterns: Record<string, string> = {
    'summarize|summary|condense': 'summarization',
    'translate|convert': 'transformation',
    'generate|create|write|compose': 'generation',
    'analyze|evaluate|assess': 'analysis',
    'answer|explain|describe': 'explanation',
  };

  let taskType = 'general';
  for (const [pattern, t] of Object.entries(taskPatterns)) {
    if (new RegExp(pattern, 'i').test(input)) {
      taskType = t;
      break;
    }
  }

  // Extract constraints
  const constraints: string[] = [];
  if (input.includes('short') || input.includes('brief')) constraints.push('brevity');
  if (input.includes('detailed') || input.includes('comprehensive')) constraints.push('detail');
  if (input.includes('json') || input.includes('structured')) constraints.push('structured-output');
  if (input.includes('markdown') || input.includes('format')) constraints.push('formatting');

  // Detect output format
  let outputFormat = 'text';
  if (input.includes('json')) outputFormat = 'json';
  if (input.includes('markdown') || input.includes('md')) outputFormat = 'markdown';
  if (input.includes('table') || input.includes('csv')) outputFormat = 'table';
  if (input.includes('code')) outputFormat = 'code';

  // Calculate complexity
  const complexity = Math.min(
    100,
    Math.floor(
      lines.length * 5 +
      (input.match(/\?/g) || []).length * 3 +
      (input.split(' ').length / 10)
    )
  );

  return {
    domain,
    taskType,
    constraints,
    outputFormat,
    complexity,
  };
}

// Generate system and user prompts based on analysis
export function generatePrompts(
  input: string,
  analysis: IntentAnalysis
): { systemPrompt: string; userPrompt: string } {
  const systemPrompts: Record<string, string> = {
    'data-analysis': 'You are an expert data analyst. Provide clear, actionable insights with supporting evidence.',
    'code-generation': 'You are an expert programmer. Generate clean, efficient, well-commented code.',
    'creative-writing': 'You are a creative writer. Produce engaging, original, and thoughtful content.',
    'qa-assistant': 'You are a helpful assistant. Answer questions accurately and comprehensively.',
    'language': 'You are a language expert. Provide grammatically correct and natural language outputs.',
    'design': 'You are a design expert. Provide creative and practical design recommendations.',
  };

  const systemPrompt =
    systemPrompts[analysis.domain] ||
    'You are a helpful assistant. Provide accurate and useful responses.';

  // Build user prompt with constraints
  let userPrompt = input;
  if (analysis.outputFormat !== 'text') {
    userPrompt += `\n\nPlease format your response as ${analysis.outputFormat}.`;
  }
  if (analysis.constraints.length > 0) {
    userPrompt += `\n\nConstraints: ${analysis.constraints.join(', ')}.`;
  }

  return { systemPrompt, userPrompt };
}

// Generate Abstract Syntax Tree representation
export function generateAST(
  input: string,
  analysis: IntentAnalysis
): Record<string, any> {
  return {
    type: 'prompt',
    meta: {
      domain: analysis.domain,
      taskType: analysis.taskType,
      outputFormat: analysis.outputFormat,
      timestamp: new Date().toISOString(),
    },
    content: {
      input: input,
      constraints: analysis.constraints,
      complexity: analysis.complexity,
    },
    structure: {
      sentences: input.split('.').filter(s => s.trim()).length,
      words: input.split(/\s+/).length,
      tokens: Math.ceil(input.length / 4),
    },
  };
}

// Alias for API route compatibility
export function buildAST(
  input: string,
  analysis: IntentAnalysis
): Record<string, any> {
  return generateAST(input, analysis);
}

// Calculate metrics based on input and analysis
export function calculateMetrics(options: {
  code?: string;
  input?: string;
  constraints?: string[];
  astDepth?: number;
  analysis?: IntentAnalysis;
}): CompilationResult['metrics'] {
  const input = options.code || options.input || '';
  const constraints = options.constraints || [];
  const astDepth = options.astDepth || 0;
  
  // Token estimation: word_count * 1.3
  const wordCount = input.split(/\s+/).length;
  const estimatedTokens = Math.ceil(wordCount * 1.3);
  
  // Gemini Flash pricing: approximately $0.075 per 1M input tokens, $0.30 per 1M output tokens
  // Using conservative estimate of $0.0001 per 1000 tokens
  const costPerToken = 0.0000001;
  const estimatedCost = estimatedTokens * costPerToken;

  // Reliability score based on constraint adherence and clarity
  let reliabilityScore = 85;
  if (constraints.length > 3) reliabilityScore -= 5;
  if (astDepth > 5) reliabilityScore -= 10;
  if (wordCount < 5) reliabilityScore -= 10; // Too short, unclear intent
  reliabilityScore = Math.max(0, Math.min(100, reliabilityScore));

  // Complexity score based on AST depth and constraint count
  const complexityScore = Math.min(100, (astDepth * 15) + (constraints.length * 10));

  return {
    estimatedTokens,
    estimatedCost: parseFloat(estimatedCost.toFixed(8)),
    reliabilityScore,
    complexityScore,
  };
}

// Main compilation function
export function compile(input: string): CompilationResult {
  if (!input.trim()) {
    throw new Error('Input cannot be empty');
  }

  const analysis = analyzeIntent(input);
  const { systemPrompt, userPrompt } = generatePrompts(input, analysis);
  const ast = generateAST(input, analysis);
  const metrics = calculateMetrics(input, analysis);

  return {
    systemPrompt,
    userPrompt,
    ast,
    metrics,
  };
}
