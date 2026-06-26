<script lang="ts">
  import { onMount } from 'svelte';
  import Map from '$lib/components/Map.svelte';
  import ParkingPanel from '$lib/components/ParkingPanel.svelte';
  import Header from '$lib/components/Header.svelte';
  import WelcomeModal from '$lib/components/WelcomeModal.svelte';
  import CityLegend from '$lib/components/CityLegend.svelte';
  import LocationButton from '$lib/components/LocationButton.svelte';
  import DestinationPicker from '$lib/components/DestinationPicker.svelte';
  import type { Parking } from '$lib/types';
  import { cities, getParkingCounts, getParkingForCity } from '$lib/data';
  import { preferences } from '$lib/stores/preferences';

  let parkings = $state<Parking[]>([]);
  let selectedParkingId = $state<string | null>(null);
  let selectedParking = $derived(parkings.find(p => p.id === selectedParkingId) || null);
  let userLocation = $state<{ lat: number; lng: number } | null>(null);
  let showPanel = $state(false);
  let isLoading = $state(false);
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
  let showWelcome = $state(false);
  let destination = $state<{ lat: number; lng: number; name: string } | null>(null);
  let pickerMode = $state(false);

  const cityCounts = getParkingCounts();

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
    // Filter by destination if set
    const center = destination || searchCenter;
    if (!center) return parkings;

    const radius = destination ? 2 : searchRadius; // 2km radius for destination
    return parkings.filter(p => {
      const distance = calculateDistance(center.lat, center.lng, p.lat, p.lng);
      return distance <= radius;
    }).map(p => ({
      ...p,
      distance: calculateDistance(center.lat, center.lng, p.lat, p.lng)
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  function loadLocalParkings(cityId: string) {
    const cityParkings = getParkingForCity(cityId);
    return cityParkings;
  }

  function switchCity(cityId: string) {
    currentCityId = cityId;
    preferences.update((p) => ({ ...p, lastCity: cityId }));
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

  function handleLegendFilter(filter: 'free' | 'paid' | 'weekend') {
    showPanel = true;
  }

  function activatePicker() {
    pickerMode = true;
    showPanel = false;
  }

  function cancelPicker() {
    pickerMode = false;
  }

  function clearDestination() {
    destination = null;
    pickerMode = false;
  }

  async function handleMapClick(lat: number, lng: number) {
    if (!pickerMode) return;

    pickerMode = false;

    // Reverse geocode to get name
    let name = 'Điểm đã chọn';
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
      );
      const result = await response.json();
      if (result.display_name) {
        name = result.display_name.split(',').slice(0, 2).join(',').trim();
      }
    } catch {
      // Use default name
    }

    destination = { lat, lng, name };

    // Fetch parkings near destination
    const latRange = 0.02;
    const lngRange = 0.03;
    currentBounds = {
      south: lat - latRange,
      west: lng - lngRange,
      north: lat + latRange,
      east: lng + lngRange,
    };

    if (mapComponent) {
      mapComponent.flyTo(lat, lng, 16);
    }

    // Auto-open panel to show nearby
    showPanel = true;
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
  }

  onMount(async () => {
    // Load last city from preferences
    const prefs = $preferences;
    if (prefs.lastCity && (prefs.lastCity === 'kosice' || prefs.lastCity === 'vinh')) {
      currentCityId = prefs.lastCity;
    }

    // Load local parking data for current city
    parkings = loadLocalParkings(currentCityId);
    parkingCount = parkings.length;

    // Show welcome modal if not seen
    if (!prefs.hasSeenOnboarding) {
      setTimeout(() => {
        showWelcome = true;
      }, 600);
    }
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
  <!-- Header -->
  <Header
    onToggleList={handleToggleList}
    onSearch={handleSearch}
    onRadiusChange={handleRadiusChange}
    onCityChange={switchCity}
    onShowHelp={() => showWelcome = true}
    isListOpen={showPanel}
    currentCity={currentCityId}
    {cityCounts}
  />

  <!-- Map -->
  <div class="map-wrapper">
    <Map
      bind:this={mapComponent}
      parkings={getFilteredParkings()}
      {selectedParking}
      {userLocation}
      {destination}
      {pickerMode}
      onSelectParking={handleSelectParking}
      onMapMove={handleMapMove}
      onUserLocationChange={handleUserLocationChange}
      onMapClick={handleMapClick}
    />

    <!-- Destination Picker -->
    <DestinationPicker
      isActive={pickerMode}
      {destination}
      onActivate={activatePicker}
      onCancel={cancelPicker}
      onConfirm={() => {}}
    />

    <!-- City Legend -->
    <CityLegend onFilterClick={handleLegendFilter} />

    <!-- Location Button (FAB) -->
    <LocationButton onClick={handleMyLocation} />

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
  </div>

  <!-- Parking List Panel -->
  <ParkingPanel
    parkings={getFilteredParkings()}
    {selectedParking}
    {userLocation}
    isOpen={showPanel}
    isLoading={isLoading}
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

  <!-- Welcome Modal -->
  <WelcomeModal
    isOpen={showWelcome}
    onClose={() => showWelcome = false}
  />
</div>

<style>
  .error-toast {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--text-primary);
    color: white;
    padding: 12px 16px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-lg);
    z-index: 500;
    animation: slideUp 0.3s var(--ease-spring);
    font-size: 13px;
    font-weight: 600;
  }

  .retry-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 700;
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
