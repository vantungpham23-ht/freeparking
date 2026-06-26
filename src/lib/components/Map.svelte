<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { Parking } from '$lib/types';

  interface Props {
    parkings: Parking[];
    selectedParking: Parking | null;
    userLocation: { lat: number; lng: number } | null;
    onSelectParking: (p: Parking | null) => void;
    onMapMove: (center: [number, number], zoom: number) => void;
    onUserLocationChange: (location: { lat: number; lng: number } | null) => void;
  }

  let { parkings, selectedParking, userLocation, onSelectParking, onMapMove, onUserLocationChange }: Props = $props();

  let mapContainer: HTMLDivElement | undefined = $state();
  let map: any = $state(null);
  let L: any = $state(null);
  let markersLayer: any = $state(null);
  let userMarkerLayer: any = $state(null);
  let watchId: number | null = $state(null);
  let mapReady = $state(false);

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
      color = '#8b5cf6';
      bgColor = '#ede9fe';
      label = 'W';
    } else if (isFree) {
      color = '#10b981';
      bgColor = '#d1fae5';
      label = '✓';
    } else {
      color = '#f59e0b';
      bgColor = '#fef3c7';
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

    const size = 20;
    const icon = L.divIcon({
      html: `
        <div style="position: relative; width: ${size}px; height: ${size}px;">
          <div style="
            position: absolute;
            inset: 0;
            background: #2563eb;
            border-radius: 50%;
            animation: ripple 2s ease-out infinite;
          "></div>
          <div style="
            position: absolute;
            inset: 4px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(37,99,235,0.4);
          "></div>
          <div style="
            position: absolute;
            inset: 8px;
            background: #2563eb;
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
      statusBg = '#ede9fe';
      statusColor = '#8b5cf6';
      statusText = 'Cuối tuần miễn phí';
    } else if (isFree) {
      statusBg = '#d1fae5';
      statusColor = '#10b981';
      statusText = 'Miễn phí';
    } else {
      statusBg = '#fef3c7';
      statusColor = '#f59e0b';
      statusText = 'Trả phí';
    }

    const navHandler = `window.__openNav(${parking.lat}, ${parking.lng}, '${parking.name.replace(/'/g, "\\'")}')`;

    return `
      <div style="padding: 16px; font-family: 'Inter', sans-serif; min-width: 220px;">
        <h3 style="font-weight: 600; font-size: 15px; color: #0f172a; margin-bottom: 10px; line-height: 1.3;">
          ${parking.name}
        </h3>
        
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="
            display: inline-flex;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            background: ${statusBg};
            color: ${statusColor};
          ">${statusText}</span>
          ${parking.capacity ? `<span style="font-size: 12px; color: #64748b;">${parking.capacity} chỗ</span>` : ''}
        </div>
        
        ${parking.feePerHour ? `<p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">€${parking.feePerHour}/giờ</p>` : ''}
        
        <button 
          onclick="${navHandler}"
          onmouseover="this.style.background='#1d4ed8'"
          onmouseout="this.style.background='#2563eb'"
          style="width:100%;padding:10px 16px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background 0.15s ease;">
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

        marker.on('click', () => {
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

  function initGeolocation() {
    if (!browser || !navigator.geolocation) return;

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
        
        if (map) {
          map.setView([loc.lat, loc.lng], 15);
        }
      },
      (error) => {
        console.log('Geolocation error:', error.message);
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
      },
      () => {},
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

      map.on('moveend', handleMapMove);
      map.on('zoomend', handleMapMove);

      mapReady = true;
      
      initGeolocation();
      
      setTimeout(() => updateMarkers(), 100);
    } catch (error) {
      console.error('Failed to initialize map:', error);
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

<div class="map-container" bind:this={mapContainer}></div>

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
</style>
