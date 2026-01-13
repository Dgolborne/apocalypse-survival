import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createGame } from '@/lib/db';
import { CharacterStats } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { playerName, scenario, stats, startLat, startLng } = await request.json();
    
    if (!playerName || !scenario || !stats || startLat === undefined || startLng === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const gameId = await createGame(playerName, scenario, stats as CharacterStats, startLat, startLng);
    
    session.currentGameId = gameId;
    await session.save();
    
    return NextResponse.json({ success: true, gameId });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
