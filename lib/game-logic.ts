import { CharacterStats } from './db';

// D&D style stat generation (3d6 for each stat)
export function generateRandomStats(): CharacterStats {
  const rollStat = () => {
    return Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1).reduce((a, b) => a + b, 0);
  };

  return {
    strength: rollStat(),
    dexterity: rollStat(),
    constitution: rollStat(),
    intelligence: rollStat(),
    wisdom: rollStat(),
    charisma: rollStat(),
  };
}

// Calculate stat modifier (D&D 5e style)
export function getStatModifier(stat: number): number {
  return Math.floor((stat - 10) / 2);
}

// Roll a d20 with modifier
export function rollD20(modifier: number = 0): { roll: number; total: number } {
  const roll = Math.floor(Math.random() * 20) + 1;
  return { roll, total: roll + modifier };
}

// Calculate distance between two points (in km using Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Maximum walking distance per day in km
export const MAX_DAILY_DISTANCE_KM = 20;

// Zombie encounter check based on population density
export function checkZombieEncounter(
  populationDensity: 'low' | 'medium' | 'high',
  stats: CharacterStats
): { encountered: boolean; survived: boolean; roll: number; dc: number } {
  // Set DC based on population density
  const dcMap = {
    low: 8,
    medium: 12,
    high: 16,
  };
  
  const dc = dcMap[populationDensity];
  
  // Dexterity saving throw to avoid/survive encounter
  const dexModifier = getStatModifier(stats.dexterity);
  const constitutionModifier = getStatModifier(stats.constitution);
  
  // Combined modifier (using both dex to avoid and constitution to survive)
  const modifier = Math.floor((dexModifier + constitutionModifier) / 2);
  
  const { roll, total } = rollD20(modifier);
  
  const survived = total >= dc;
  
  // Encounter chance based on density
  const encounterChance = {
    low: 0.1,
    medium: 0.3,
    high: 0.6,
  };
  
  const encountered = Math.random() < encounterChance[populationDensity];
  
  return {
    encountered,
    survived: !encountered || survived,
    roll: total,
    dc,
  };
}

// Determine population density based on location type
export function getPopulationDensity(locationType: string): 'low' | 'medium' | 'high' {
  const highDensity = ['shopping_mall', 'school', 'hospital', 'stadium', 'transit_station'];
  const mediumDensity = ['restaurant', 'store', 'supermarket', 'pharmacy', 'gas_station'];
  
  if (highDensity.includes(locationType)) return 'high';
  if (mediumDensity.includes(locationType)) return 'medium';
  return 'low';
}

// Generate random supplies based on location type
export function generateSupplies(locationType: string): string[] {
  const supplyMap: { [key: string]: string[] } = {
    supermarket: ['Canned Food', 'Water Bottles', 'First Aid Kit', 'Batteries', 'Flashlight'],
    pharmacy: ['Medicine', 'Bandages', 'Pain Relievers', 'Antiseptic'],
    gas_station: ['Water', 'Snacks', 'Lighter', 'Map'],
    restaurant: ['Food', 'Water', 'Kitchen Knife'],
    hardware_store: ['Tools', 'Rope', 'Tape', 'Knife', 'Flashlight'],
    clothing_store: ['Warm Clothes', 'Backpack', 'Shoes'],
    sporting_goods_store: ['Camping Gear', 'Water Filter', 'First Aid Kit', 'Rope'],
  };
  
  const genericSupplies = ['Food', 'Water', 'Basic Supplies'];
  const supplies = supplyMap[locationType] || genericSupplies;
  
  // Return 1-3 random items
  const count = Math.floor(Math.random() * 3) + 1;
  const selectedSupplies: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const item = supplies[Math.floor(Math.random() * supplies.length)];
    if (!selectedSupplies.includes(item)) {
      selectedSupplies.push(item);
    }
  }
  
  return selectedSupplies;
}

// Check if player has enough supplies to continue (survival check)
export function checkSupplies(inventory: string[], day: number): boolean {
  // Need at least 1 food/water item per 3 days
  const foodWaterItems = inventory.filter(item => 
    item.toLowerCase().includes('food') || 
    item.toLowerCase().includes('water')
  ).length;
  
  return foodWaterItems >= Math.floor(day / 3);
}

// Denver coordinates (approximate center)
export const DENVER_CENTER = {
  lat: 39.7392,
  lng: -104.9903,
};

// Generate random starting location within Denver bounds
export function generateStartingLocation(): { lat: number; lng: number } {
  // Denver metropolitan area bounds (approximate)
  const denverBounds = {
    north: 39.9142,
    south: 39.6142,
    east: -104.6003,
    west: -105.1093,
  };
  
  const lat = denverBounds.south + Math.random() * (denverBounds.north - denverBounds.south);
  const lng = denverBounds.west + Math.random() * (denverBounds.east - denverBounds.west);
  
  return { lat, lng };
}

// Generate zombie locations based on population density
export function generateZombieLocations(center: { lat: number; lng: number }): Array<{ lat: number; lng: number; density: number }> {
  const zombies: Array<{ lat: number; lng: number; density: number }> = [];
  const count = Math.floor(Math.random() * 20) + 30; // 30-50 zombie hotspots
  
  for (let i = 0; i < count; i++) {
    // Generate zombies within ~10km of center
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 0.1; // ~10km in degrees
    
    const lat = center.lat + distance * Math.cos(angle);
    const lng = center.lng + distance * Math.sin(angle);
    const density = Math.random(); // 0-1 density
    
    zombies.push({ lat, lng, density });
  }
  
  return zombies;
}
