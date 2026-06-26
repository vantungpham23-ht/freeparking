<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { Parking } from '$lib/types';
  import { setLocationState } from '$lib/stores/location';

  interface Destination {
    lat: number;
    lng: number;
    name: string;
  }

  interface Props {
    parkings: Parking[];
    selectedParking: Parking | null;
    userLocation: { lat: number; lng: number } | null;
    destination: Destination | null;
    pickerMode: boolean;
    onSelectParking: (p: Parking | null) => void;
    onMapMove: (center: [number, number], zoom: number) => void;
    onUserLocationChange: (location: { lat: number; lng: number } | null) => void;
    onMapClick?: (lat: number, lng: number) => void;
  }

  let {
    parkings,
    selectedParking,
    userLocation,
    destination,
    pickerMode,
    onSelectParking,
    onMapMove,
    onUserLocationChange,
    onMapClick
  }: Props = $props();

  let mapContainer: HTMLDivElement | undefined = $state();
  let map: any = $state(null);
  let L: any = $state(null);
  let markersLayer: any = $state(null);
  let userMarkerLayer: any = $state(null);
  let destinationLayer: any = $state(null);
  let watchId: number | null = $state(null);
  let mapReady = $state(false);
  let mapLoading = $state(true);

  // Cache for marker icons
  const iconCache: Map<string, any> = new Map();

  function createParkingMarkerIcon(parking: Parking, isSelected: boolean) {
    const cacheKey = `${parking.id}-${isSelected}`;
    if (iconCache.has(cacheKey)) {
      return iconCache.get(cacheKey);
    }

    const isWeekendFree = parking.isWeekendFree;
    const isFree = parking.isFree;
    const size = isSelected ? 44 : 36;
    
    let color: string;
    let bgColor: string;
    let label: string;

    if (isWeekendFree) {
      color = '#a78bfa';
      bgColor = '#f5f3ff';
      label = 'W';
    } else if (isFree) {
      color = '#10b981';
      bgColor = '#ecfdf5';
      label = '✓';
    } else {
      color = '#f59e0b';
      bgColor = '#fffbeb';
      label = 'P';
    }

    const icon = L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${bgColor};
          border: 2.5px solid ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: ${size * 0.4}px;
          color: ${color};
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          ${isSelected ? 'transform: scale(1.15); box-shadow: 0 6px 20px rgba(37,99,235,0.3);' : ''}
          transition: all 0.2s ease;
        ">${label}</div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });

    iconCache.set(cacheKey, icon);
    return icon;
  }

  function createUserMarkerIcon() {
    if (iconCache.has('user')) {
      return iconCache.get('user');
    }

    const size = 22;
    const icon = L.divIcon({
      html: `
        <div style="position: relative; width: ${size}px; height: ${size}px;">
          <div style="
            position: absolute;
            inset: 0;
            background: #6366f1;
            border-radius: 50%;
            animation: ripple 2s ease-out infinite;
            opacity: 0.4;
          "></div>
          <div style="
            position: absolute;
            inset: 4px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
          "></div>
          <div style="
            position: absolute;
            inset: 8px;
            background: #6366f1;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'user-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    iconCache.set('user', icon);
    return icon;
  }

  function openNavigation(lat: number, lng: number, name: string) {
    if (!browser) return;
    
    const encodedName = encodeURIComponent(name);
    let url = '';

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      url = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`;
    } else if (/android/i.test(navigator.userAgent)) {
      url = `geo:${lat},${lng}?q=${lat},${lng}(${encodedName})`;
      // Try Waze as fallback
      setTimeout(() => {
        if (!document.hidden) {
          window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
        }
      }, 500);
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    if (url) {
      window.open(url, '_blank');
    }
  }

  function createPopupContent(parking: Parking) {
    const isWeekendFree = parking.isWeekendFree;
    const isFree = parking.isFree;
    
    let statusBg: string;
    let statusColor: string;
    let statusText: string;
    
    if (isWeekendFree) {
      statusBg = '#f5f3ff';
      statusColor = '#a78bfa';
      statusText = 'Cuối tuần miễn phí';
    } else if (isFree) {
      statusBg = '#ecfdf5';
      statusColor = '#10b981';
      statusText = 'Miễn phí';
    } else {
      statusBg = '#fffbeb';
      statusColor = '#f59e0b';
      statusText = 'Trả phí';
    }

    const navHandler = `window.__openNav(${parking.lat}, ${parking.lng}, '${parking.name.replace(/'/g, "\\'")}')`;

    return `
      <div style="padding: 16px; font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
        <h3 style="font-weight: 700; font-size: 15px; color: #1e1b4b; margin-bottom: 10px; line-height: 1.3;">
          ${parking.name}
        </h3>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="
            display: inline-flex;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            background: ${statusBg};
            color: ${statusColor};
          ">${statusText}</span>
          ${parking.capacity ? `<span style="font-size: 12px; color: #64748b;">${parking.capacity} chỗ</span>` : ''}
        </div>

        ${parking.feePerHour ? `<p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">€${parking.feePerHour}/giờ</p>` : ''}

        <button
          onclick="${navHandler}"
          onmouseover="this.style.background='#4f46e5'"
          onmouseout="this.style.background='#6366f1'"
          style="width:100%;padding:10px 16px;background:#6366f1;color:white;border:none;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background 0.15s ease;font-family:inherit;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Chỉ đường
        </button>
      </div>
    `;
  }

  function updateMarkers() {
    if (!map || !L || !mapReady) return;

    markersLayer.clearLayers();

    // Add user location marker
    if (userLocation && userMarkerLayer) {
      userMarkerLayer.clearLayers();
      L.marker([userLocation.lat, userLocation.lng], { 
        icon: createUserMarkerIcon(),
        zIndexOffset: 1000 
      }).addTo(userMarkerLayer);
    }

    // Add parking markers with batch processing
    const batchSize = 50;
    let currentIndex = 0;

    function addBatch() {
      const endIndex = Math.min(currentIndex + batchSize, parkings.length);
      
      for (let i = currentIndex; i < endIndex; i++) {
        const parking = parkings[i];
        const isSelected = selectedParking?.id === parking.id;
        
        const marker = L.marker([parking.lat, parking.lng], { 
          icon: createParkingMarkerIcon(parking, isSelected),
          alt: parking.name
        });

        marker.bindPopup(createPopupContent(parking), {
          closeButton: true,
          className: 'parking-popup',
          maxWidth: 300,
          minWidth: 240,
        });

        marker.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          onSelectParking(parking);
          setTimeout(() => marker.openPopup(), 50);
        });

        marker.addTo(markersLayer);
      }

      currentIndex = endIndex;

      if (currentIndex < parkings.length) {
        requestAnimationFrame(addBatch);
      }
    }

    addBatch();
  }

  function handleMapMove() {
    if (map) {
      const center = map.getCenter();
      onMapMove([center.lat, center.lng], map.getZoom());
    }
  }

  function createDestinationMarkerIcon() {
    const icon = L.divIcon({
      html: `
        <div style="position: relative; width: 40px; height: 50px;">
          <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #f472b6, #ec4899);
            border-radius: 50% 50% 50% 0;
            transform: translateX(-50%) rotate(-45deg);
            transform-origin: center;
            box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
            animation: bounce-pin 1.6s ease-in-out infinite;
          "></div>
          <div style="
            position: absolute;
            bottom: 18px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            z-index: 2;
          "></div>
        </div>
      `,
      className: 'destination-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50],
    });

    return icon;
  }

  function handleMapClick(e: any) {
    // Only handle clicks when in picker mode
    if (pickerMode && onMapClick) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  }

  function initGeolocation() {
    if (!browser || !navigator.geolocation) {
      setLocationState('unavailable');
      return;
    }

    setLocationState('requesting');

    const locationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    // Initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onUserLocationChange(loc);
        setLocationState('granted', loc);

        if (map) {
          map.setView([loc.lat, loc.lng], 15);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationState('denied', null, 'Bạn đã từ chối cấp quyền vị trí');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationState('unavailable', null, 'Không thể xác định vị trí');
        } else {
          setLocationState('denied', null, error.message);
        }
      },
      locationOptions
    );

    // Watch position
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onUserLocationChange(loc);
        setLocationState('granted', loc);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationState('denied');
        }
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  }

  onMount(async () => {
    if (!browser) return;

    try {
      L = await import('leaflet');

      // Expose navigation function
      (window as any).__openNav = openNavigation;

      map = L.map(mapContainer!, {
        center: [48.72, 21.25],
        zoom: 15,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true, // Better performance
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayer = L.layerGroup().addTo(map);
      userMarkerLayer = L.layerGroup().addTo(map);
      destinationLayer = L.layerGroup().addTo(map);

      map.on('moveend', handleMapMove);
      map.on('zoomend', handleMapMove);
      map.on('click', handleMapClick);

      mapReady = true;
      mapLoading = false;

      initGeolocation();

      setTimeout(() => updateMarkers(), 100);
    } catch (error) {
      console.error('Failed to initialize map:', error);
      mapLoading = false;
    }
  });

  onDestroy(() => {
    if (!browser) return;
    
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
    
    if (map) {
      map.remove();
    }
    
    delete (window as any).__openNav;
    iconCache.clear();
  });

  // Reactive effects
  $effect(() => {
    if (browser && mapReady && parkings) {
      updateMarkers();
    }
  });

  $effect(() => {
    if (browser && map && selectedParking && mapReady) {
      map.flyTo([selectedParking.lat, selectedParking.lng], 17, {
        animate: true,
        duration: 0.6
      });
    }
  });

  // Update destination marker
  $effect(() => {
    if (!browser || !map || !L || !mapReady || !destinationLayer) return;
    if (!destination) return;

    destinationLayer.clearLayers();

    const marker = L.marker([destination.lat, destination.lng], {
      icon: createDestinationMarkerIcon(),
      zIndexOffset: 2000,
    });

    marker.bindPopup(`
      <div style="padding: 12px 16px; font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px;">
        <div style="font-size: 11px; color: #a5a3c0; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">
          Điểm đến
        </div>
        <div style="font-size: 14px; font-weight: 600; color: #1e1b4b;">
          ${destination.name}
        </div>
      </div>
    `, { closeButton: false, className: 'destination-popup' });

    marker.addTo(destinationLayer);
  });

  // Update cursor when in picker mode
  $effect(() => {
    if (browser && mapContainer) {
      const leafletPane = mapContainer.querySelector('.leaflet-container') as HTMLElement;
      if (leafletPane) {
        leafletPane.style.cursor = pickerMode ? 'crosshair' : '';
      }
    }
  });

  // Expose methods for parent component
  export function flyTo(lat: number, lng: number, zoom = 17) {
    if (browser && map) {
      map.flyTo([lat, lng], zoom, { duration: 0.6 });
    }
  }

  export function centerOnUser() {
    if (browser && map && userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true, duration: 0.6 });
    }
  }

  export function refreshMarkers() {
    if (browser && mapReady) {
      iconCache.clear();
      updateMarkers();
    }
  }
</script>

<div class="map-container" bind:this={mapContainer}>
  {#if mapLoading}
    <div class="map-loading" role="status" aria-label="Đang tải bản đồ">
      <div class="map-loading-spinner"></div>
    </div>
  {/if}
</div>

<style>
  :global(.custom-marker) {
    background: transparent !important;
    border: none !important;
  }

  :global(.parking-popup .leaflet-popup-content-wrapper) {
    border-radius: 16px !important;
    padding: 0 !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
  }

  :global(.parking-popup .leaflet-popup-content) {
    margin: 0 !important;
  }

  :global(.parking-popup .leaflet-popup-tip) {
    background: white !important;
  }

  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .map-loading {
    position: absolute;
    inset: 0;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }

  .map-loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
</style>
