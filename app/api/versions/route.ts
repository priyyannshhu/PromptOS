import { NextRequest, NextResponse } from 'next/server';

// Shared storage
const versions: Map<string, any> = new Map();

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('id');

    if (!versionId) {
      return NextResponse.json(
        { error: 'Version ID is required' },
        { status: 400 }
      );
    }

    if (!versions.has(versionId)) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    versions.delete(versionId);

    return NextResponse.json({
      success: true,
      message: 'Version deleted successfully',
    });
  } catch (error) {
    console.error('Delete version error:', error);
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    );
  }
}
