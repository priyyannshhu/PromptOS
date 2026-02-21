import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
const versions: Map<string, any> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { name, content, model, metrics } = await request.json();

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    const versionId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const version = {
      id: versionId,
      name,
      content,
      model: model || 'gpt-4',
      metrics,
      createdAt: new Date().toISOString(),
    };

    versions.set(versionId, version);

    return NextResponse.json({
      success: true,
      data: version,
    });
  } catch (error) {
    console.error('Save version error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save version' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const versionList = Array.from(versions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: versionList,
    });
  } catch (error) {
    console.error('Fetch versions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}
