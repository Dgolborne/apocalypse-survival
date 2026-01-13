import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGame, updateGamePosition, updateGameInventory, endGame } from '@/lib/db';
import { calculateDistance, MAX_DAILY_DISTANCE_KM, checkZombieEncounter, getPopulationDensity, generateSupplies } from '@/lib/game-logic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session.isAuthenticated) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { gameId } = await params;
    const { targetLat, targetLng, locationType, action } = await request.json();
    
    const game = await getGame(gameId);
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    if (!game.is_alive) {
      return NextResponse.json({ error: 'Game already ended' }, { status: 400 });
    }
    
    // Check if movement is within daily limit
    const distance = calculateDistance(game.current_lat, game.current_lng, targetLat, targetLng);
    
    if (distance > MAX_DAILY_DISTANCE_KM) {
      return NextResponse.json({ 
        error: 'Distance exceeds daily limit',
        distance,
        maxDistance: MAX_DAILY_DISTANCE_KM 
      }, { status: 400 });
    }
    
    // Check for zombie encounter
    const populationDensity = getPopulationDensity(locationType || 'residential');
    const encounterResult = checkZombieEncounter(populationDensity, game.stats);
    
    if (encounterResult.encountered && !encounterResult.survived) {
      // Player died
      await endGame(gameId);
      await updateGamePosition(game.id, game.current_day + 1, targetLat, targetLng, 'Killed by zombies');
      
      return NextResponse.json({
        success: false,
        died: true,
        encounterResult,
        finalDay: game.current_day + 1,
      });
    }
    
    // Generate supplies if at a lootable location
    let newSupplies: string[] = [];
    if (action === 'loot' && locationType) {
      newSupplies = generateSupplies(locationType);
      await updateGameInventory(gameId, [...game.inventory, ...newSupplies]);
    }
    
    // Update position
    const newDay = game.current_day + 1;
    await updateGamePosition(game.id, newDay, targetLat, targetLng, action || 'Moved');
    
    // Check if won (survived 30 days)
    const won = newDay >= 30;
    if (won) {
      await endGame(gameId);
    }
    
    return NextResponse.json({
      success: true,
      newDay,
      encounterResult,
      newSupplies,
      won,
      distance: distance.toFixed(2),
    });
  } catch (error) {
    console.error('Error processing move:', error);
    return NextResponse.json({ error: 'Failed to process move' }, { status: 500 });
  }
}
