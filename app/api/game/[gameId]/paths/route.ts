import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPlayerPaths, getAllDeadGamePaths } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { gameId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeAllDead = searchParams.get('includeAllDead') === 'true';
    
    if (includeAllDead) {
      // Return all dead game paths for recap view
      const allDeadPaths = await getAllDeadGamePaths();
      return NextResponse.json({ allDeadPaths });
    } else {
      // Return paths for specific game
      const paths = await getPlayerPaths(gameId);
      return NextResponse.json({ paths });
    }
  } catch (error) {
    console.error('Error fetching paths:', error);
    return NextResponse.json({ error: 'Failed to fetch paths' }, { status: 500 });
  }
}
