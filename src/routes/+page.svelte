<script lang="ts">
  import { onMount } from 'svelte';
  import Map from '$lib/components/Map.svelte';
  import ParkingPanel from '$lib/components/ParkingPanel.svelte';
  import Header from '$lib/components/Header.svelte';
  import { CheckIcon, LocationIcon, ParkingIcon } from '$lib/icons';
  import type { Parking } from '$lib/types';
  import { cities, detectCity, getParkingForCity, vinhCenter, kosiceCenter } from '$lib/data';

  let parkings = $state<Parking[]>([]);
  let selectedParkingId = $state<string | null>(null);
  let selectedParking = $derived(parkings.find(p => p.id === selectedParkingId) || null);
  let userLocation = $state<{ lat: number; lng: number } | null>(null);
  let showPanel = $state(false);
  let isLoading = $state(true);
  let isInitialLoad = $state(true);
  let parkingCount = $state(0);
  let mapComponent: Map | undefined = $state(undefined);
  let currentBounds = $state({ south: 48.70, west: 21.23, north: 48.75, east: 21.28 });
  let lastFetchKey = '';
  let searchCenter = $state<{ lat: number; lng: number } | null>(null);
  let searchRadius = $state(2);
  let isSearching = $state(false);
  let fetchError = $state<string | null>(null);
  let retryCount = $state(0);
  let currentCityId = $state<string>('kosice');

  const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter',
  ];

  interface OverpassElement {
    type: 'node' | 'way' | 'relation';
    id: number;
    lat?: number;
    lon?: number;
    tags?: Record<string, string>;
  }

  async function fetchOverpass(query: string): Promise<OverpassElement[]> {
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return data.elements || [];
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Request timeout, trying next endpoint...');
        }
      }
    }
    return [];
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function checkWeekendFree(tags: Record<string, string>): boolean {
    const conditional = tags['fee:conditional'] || tags['access:conditional'] || '';
    
    const weekendPatterns = [
      /free.*weekend/i,
      /weekend.*free/i,
      /sa\-su.*free/i,
      /fr\-su.*free/i,
      /@.*\(sa|@.*\(su/i,
      /ph.*weekend/i,
      /vacation/i,
    ];
    
    return weekendPatterns.some(pattern => pattern.test(conditional));
  }

  async function searchLocation(query: string, radiusKm: number) {
    if (!query.trim()) {
      searchCenter = null;
      return;
    }

    isSearching = true;
    fetchError = null;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const results = await response.json();

      if (results.length > 0) {
        const result = results[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        searchCenter = { lat, lng: lon };
        searchRadius = radiusKm;

        const latRange = radiusKm / 111;
        const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180));
        
        currentBounds = {
          south: lat - latRange,
          west: lon - lngRange,
          north: lat + latRange,
          east: lon + lngRange,
        };
        
        if (mapComponent) {
          mapComponent.flyTo(lat, lon, 14);
        }
        
        await fetchParkings(currentBounds, true);
      } else {
        fetchError = 'Không tìm thấy địa điểm';
      }
    } catch {
      fetchError = 'Tìm kiếm thất bại';
    }
    isSearching = false;
  }

  function getFilteredParkings(): Parking[] {
    if (!searchCenter) return parkings;
    return parkings.filter(p => {
      const distance = calculateDistance(searchCenter!.lat, searchCenter!.lng, p.lat, p.lng);
      return distance <= searchRadius;
    }).map(p => ({
      ...p,
      distance: calculateDistance(searchCenter!.lat, searchCenter!.lng, p.lat, p.lng)
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  function loadLocalParkings(cityId: string) {
    const cityParkings = getParkingForCity(cityId);
    return cityParkings;
  }

  function switchCity(cityId: string) {
    currentCityId = cityId;
    const city = cities.find(c => c.id === cityId);
    if (city) {
      currentBounds = {
        south: city.center.lat - 0.05,
        west: city.center.lng - 0.05,
        north: city.center.lat + 0.05,
        east: city.center.lng + 0.05,
      };
      
      if (mapComponent) {
        mapComponent.flyTo(city.center.lat, city.center.lng, 14);
      }
      
      parkings = loadLocalParkings(cityId);
      parkingCount = parkings.length;
    }
  }

  async function fetchParkings(bounds: typeof currentBounds, immediate = false) {
    const minChange = 0.005;
    
    if (!immediate && lastFetchKey) {
      const lastBounds = JSON.parse(lastFetchKey);
      const latChange = Math.abs(bounds.south - lastBounds.south) + Math.abs(bounds.north - lastBounds.north);
      const lngChange = Math.abs(bounds.west - lastBounds.west) + Math.abs(bounds.east - lastBounds.east);
      
      if (latChange < minChange && lngChange < minChange) {
        return;
      }
    }
    
    const boundsKey = JSON.stringify(bounds);
    if (!immediate && boundsKey === lastFetchKey) return;
    lastFetchKey = boundsKey;

    isLoading = !immediate;
    fetchError = null;

    try {
      const query = `[out:json][timeout:25];
(
  way["amenity"="parking"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
  node["amenity"="parking"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
);
out center;`;

      const elements = await fetchOverpass(query);

      parkings = elements.map((el, index) => {
        const lat = el.lat ?? (el as any).center?.lat ?? 0;
        const lng = el.lon ?? (el as any).center?.lon ?? 0;
        const tags = el.tags || {};
        
        const capacity = tags.capacity ? parseInt(tags.capacity) : undefined;
        const hasConditionalAccess = tags['access:conditional'] || tags['fee:conditional'];
        const isWeekendFree = checkWeekendFree(tags);
        
        const isPaid = tags.fee === 'yes' && !isWeekendFree;
        const isFree = tags.fee !== 'yes' || isWeekendFree;
        
        let freeReason = 'Free';
        if (tags.fee === 'yes' && isWeekendFree) {
          freeReason = 'Free on weekends';
        } else if (tags.access === 'customers') {
          freeReason = 'Customers only';
        } else if (tags.fee === 'yes') {
          freeReason = 'Paid parking';
        }
        
        const feePerHour = isPaid ? (tags['fee:hourly'] ? parseFloat(tags['fee:hourly']) : 2.0) : undefined;
        const name = tags.name || tags['name:en'] || `Parking ${index + 1}`;

        return {
          id: `osm-${el.id}`,
          name,
          lat,
          lng,
          capacity,
          isFree,
          freeReason,
          feePerHour,
          isWeekendFree,
          hasConditionalAccess,
        };
      }).filter(p => p.lat !== 0 && p.lng !== 0);

      parkingCount = parkings.length;
      retryCount = 0;
    } catch {
      fetchError = 'Không thể tải dữ liệu bãi đỗ';
      if (retryCount < 3) {
        retryCount++;
        setTimeout(() => fetchParkings(bounds, immediate), 1000 * retryCount);
      }
    }
    
    isLoading = false;
    isInitialLoad = false;
  }

  onMount(async () => {
    // Load local parking data for Košice (default city)
    parkings = loadLocalParkings(currentCityId);
    parkingCount = parkings.length;
    isLoading = false;
    isInitialLoad = false;
  });

  let fetchTimeout: ReturnType<typeof setTimeout> | null = null;

  function handleSearch(query: string, radiusKm: number) {
    searchRadius = radiusKm;
    
    // Check if searching for Vinh
    const queryLower = query.toLowerCase();
    if (queryLower.includes('vinh') || queryLower.includes('nghệ an')) {
      switchCity('vinh');
    } else {
      switchCity('kosice');
    }
    
    searchLocation(query, radiusKm);
  }

  function handleRadiusChange(radiusKm: number) {
    searchRadius = radiusKm;
  }

  function handleMapMove(center: [number, number], zoom: number) {
    const latRange = 0.02 / Math.pow(2, zoom - 14);
    const lngRange = 0.03 / Math.pow(2, zoom - 14);
    
    const newBounds = {
      south: center[0] - latRange,
      west: center[1] - lngRange,
      north: center[0] + latRange,
      east: center[1] + lngRange,
    };
    
    currentBounds = newBounds;
    
    if (fetchTimeout) clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(() => {
      fetchParkings(currentBounds);
    }, 2000);
  }

  function handleSelectParking(parking: Parking | null) {
    if (parking) {
      selectedParkingId = parking.id;
    } else {
      selectedParkingId = null;
    }
    if (parking && mapComponent) {
      mapComponent.flyTo(parking.lat, parking.lng, 16);
    }
  }

  function handleMyLocation() {
    if (mapComponent) {
      mapComponent.centerOnUser();
    }
  }

  function handleToggleList() {
    showPanel = !showPanel;
  }

  function handleUserLocationChange(location: { lat: number; lng: number } | null) {
    userLocation = location;
  }

  async function retryFetch() {
    retryCount = 0;
    await fetchParkings(currentBounds, true);
  }
</script>

<svelte:head>
  <meta name="description" content="T-Map - Tìm kiếm và định vị bãi đỗ xe nhanh chóng" />
  <meta name="theme-color" content="#2563eb" />
</svelte:head>

<div class="app-container">
  {#if isInitialLoad && isLoading}
    <div class="loading-overlay" role="status" aria-label="Đang tải">
      <div class="loading-icon">
        {@html ParkingIcon}
      </div>
      <p class="loading-text">Đang tải bãi đỗ xe...</p>
      <p class="loading-subtext">Kết nối với OpenStreetMap</p>
    </div>
  {/if}

  <!-- Header -->
  <Header 
    onToggleList={handleToggleList}
    onMyLocation={handleMyLocation}
    onSearch={handleSearch}
    onRadiusChange={handleRadiusChange}
    onCityChange={switchCity}
    isListOpen={showPanel}
    currentCity={currentCityId}
  />

  <!-- Map -->
  <div class="map-wrapper">
    <Map
      bind:this={mapComponent}
      parkings={getFilteredParkings()}
      {selectedParking}
      {userLocation}
      onSelectParking={handleSelectParking}
      onMapMove={handleMapMove}
      onUserLocationChange={handleUserLocationChange}
    />

    <!-- Error Toast -->
    {#if fetchError}
      <div class="error-toast" role="alert">
        <span>{fetchError}</span>
        <button onclick={retryFetch} class="retry-btn">
          Thử lại
        </button>
        <button onclick={() => fetchError = null} class="dismiss-btn" aria-label="Đóng">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    {/if}

    <!-- Loading indicator -->
    {#if isLoading && !isInitialLoad}
      <div class="mini-loading">
        <div class="mini-spinner"></div>
        <span>Cập nhật...</span>
      </div>
    {/if}
  </div>

  <!-- Parking List Panel -->
  <ParkingPanel
    parkings={getFilteredParkings()}
    {selectedParking}
    {userLocation}
    isOpen={showPanel}
    onSelectParking={handleSelectParking}
    onClose={() => showPanel = false}
  />

  <!-- Search indicator -->
  {#if isSearching}
    <div class="search-loading" role="status">
      <div class="spinner"></div>
      <span>Đang tìm kiếm...</span>
    </div>
  {/if}

  <!-- FAB Button - My Location -->
  <button 
    class="fab" 
    onclick={handleMyLocation} 
    aria-label="Vị trí của tôi"
    title="Vị trí của tôi"
  >
    {@html LocationIcon}
  </button>
</div>

<style>
  .loading-subtext {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .error-toast {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--error);
    color: white;
    padding: 12px 16px;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-lg);
    z-index: 500;
    animation: slideUp 0.3s ease-out;
    font-size: 13px;
  }

  .retry-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .retry-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .dismiss-btn {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    opacity: 0.7;
    transition: opacity 0.15s ease;
  }

  .dismiss-btn:hover {
    opacity: 1;
  }

  .mini-loading {
    position: absolute;
    top: calc(var(--header-height) + 12px);
    right: 16px;
    background: var(--bg);
    padding: 8px 14px;
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 200;
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .mini-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes slideUp {
    from { 
      transform: translateX(-50%) translateY(20px);
      opacity: 0;
    }
    to { 
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
</style>
