'use client';

import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { GameSession, PlayerPath } from '@/lib/db';
import { MAX_DAILY_DISTANCE_KM } from '@/lib/game-logic';

interface Props {
  game: GameSession;
  onMove: (lat: number, lng: number, locationType: string, action: string) => Promise<any>;
}

export default function GameMap({ game, onMove }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState<'move' | 'loot'>('move');
  const markerRef = useRef<google.maps.Marker | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    const initMap = async () => {
      setOptions({
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        v: 'weekly',
        libraries: ['places'],
      });

      await importLibrary('maps');
      await importLibrary('places');
      
      if (mapRef.current && typeof google !== 'undefined') {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: game.current_lat, lng: game.current_lng },
          zoom: 13,
          mapTypeId: 'roadmap',
          styles: [
            {
              elementType: 'geometry',
              stylers: [{ color: '#242f3e' }],
            },
            {
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#242f3e' }],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [{ color: '#746855' }],
            },
          ],
        });

        setMap(mapInstance);
        placesServiceRef.current = new google.maps.places.PlacesService(mapInstance);

        // Add player marker
        const playerMarker = new google.maps.Marker({
          position: { lat: game.current_lat, lng: game.current_lng },
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="15" fill="#00ff00" stroke="#000" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="20">👤</text></svg>'
            ),
          },
        });

        // Add movement range circle
        const rangeCircle = new google.maps.Circle({
          map: mapInstance,
          center: { lat: game.current_lat, lng: game.current_lng },
          radius: MAX_DAILY_DISTANCE_KM * 1000,
          fillColor: '#00ff00',
          fillOpacity: 0.1,
          strokeColor: '#00ff00',
          strokeOpacity: 0.5,
          strokeWeight: 2,
        });

        circleRef.current = rangeCircle;

        // Add click listener for selecting locations
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Check if within range
            const distance = calculateDistance(game.current_lat, game.current_lng, lat, lng);
            if (distance > MAX_DAILY_DISTANCE_KM) {
              setMessage(`Too far! Maximum distance: ${MAX_DAILY_DISTANCE_KM}km`);
              return;
            }

            // Get place info
            if (placesServiceRef.current) {
              placesServiceRef.current.nearbySearch(
                {
                  location: { lat, lng },
                  radius: 50,
                },
                (results, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                    const place = results[0];
                    setSelectedLocation({
                      lat,
                      lng,
                      name: place.name || 'Unknown Location',
                      type: place.types?.[0] || 'point_of_interest',
                    });
                  } else {
                    setSelectedLocation({
                      lat,
                      lng,
                      name: 'Open Area',
                      type: 'residential',
                    });
                  }
                }
              );
            }

            // Update marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            markerRef.current = new google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              title: 'Selected Location',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="15" fill="#ff0000" stroke="#000" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="20">📍</text></svg>'
                ),
              },
            });
          }
        });
      }
    };

    initMap();
  }, [game.current_lat, game.current_lng]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleConfirmMove = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await onMove(
        selectedLocation.lat,
        selectedLocation.lng,
        selectedLocation.type,
        action === 'loot' ? 'loot' : 'move'
      );

      if (result.died) {
        setMessage(`💀 You were killed by zombies! You survived ${result.finalDay - 1} days.`);
      } else if (result.won) {
        setMessage(`🎉 Congratulations! You survived 30 days!`);
      } else {
        let msg = `Day ${result.newDay}: Moved ${result.distance}km`;
        if (result.encounterResult.encountered) {
          msg += ` | ⚠️ Zombie encounter! Roll: ${result.encounterResult.roll} vs DC: ${result.encounterResult.dc} - Survived!`;
        }
        if (result.newSupplies.length > 0) {
          msg += ` | 📦 Found: ${result.newSupplies.join(', ')}`;
        }
        setMessage(msg);
      }
    } catch (error) {
      setMessage('Failed to process move. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 bg-gray-800/95 rounded-lg p-4 border border-red-900 max-w-md">
        <div className="space-y-3">
          <div>
            <h3 className="text-white font-bold">Day {game.current_day} / 30</h3>
            <p className="text-gray-400 text-sm">
              Max distance: {MAX_DAILY_DISTANCE_KM}km | Status: {game.is_alive ? '✅ Alive' : '💀 Dead'}
            </p>
          </div>

          {selectedLocation && (
            <>
              <div className="bg-gray-700 rounded p-3">
                <p className="text-white font-semibold">{selectedLocation.name}</p>
                <p className="text-gray-400 text-sm">Type: {selectedLocation.type}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setAction('move')}
                  className={`flex-1 py-2 px-4 rounded ${
                    action === 'move' ? 'bg-blue-600' : 'bg-gray-700'
                  } text-white`}
                >
                  🚶 Move
                </button>
                <button
                  onClick={() => setAction('loot')}
                  className={`flex-1 py-2 px-4 rounded ${
                    action === 'loot' ? 'bg-blue-600' : 'bg-gray-700'
                  } text-white`}
                >
                  📦 Loot
                </button>
              </div>

              <button
                onClick={handleConfirmMove}
                disabled={loading || !game.is_alive}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Confirm ${action === 'loot' ? 'Loot' : 'Move'}`}
              </button>
            </>
          )}

          {message && (
            <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-200 px-3 py-2 rounded text-sm">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Inventory Overlay */}
      <div className="absolute bottom-4 right-4 bg-gray-800/95 rounded-lg p-4 border border-red-900 max-w-xs">
        <h3 className="text-white font-bold mb-2">📦 Inventory</h3>
        <div className="max-h-48 overflow-y-auto">
          {game.inventory.length === 0 ? (
            <p className="text-gray-400 text-sm">No items</p>
          ) : (
            <ul className="text-white text-sm space-y-1">
              {game.inventory.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
