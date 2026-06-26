<script lang="ts">
  import { browser } from '$app/environment';
  import type { Parking } from '$lib/types';
  import { ParkingIcon, NavigateIcon, CarIcon, SortIcon, FilterIcon } from '$lib/icons';

  interface Props {
    parkings: Parking[];
    selectedParking: Parking | null;
    userLocation: { lat: number; lng: number } | null;
    isOpen: boolean;
    onSelectParking: (p: Parking) => void;
    onClose: () => void;
  }

  let { parkings, selectedParking, userLocation, isOpen, onSelectParking, onClose }: Props = $props();

  type SortOption = 'distance' | 'name' | 'capacity';
  type FilterOption = 'all' | 'free' | 'paid' | 'weekend';
  
  let sortBy = $state<SortOption>('distance');
  let filterBy = $state<FilterOption>('all');
  let showSortMenu = $state(false);
  let showFilterMenu = $state(false);

  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function formatDistance(meters: number): string {
    if (meters < 100) return '< 100m';
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  }

  function openNavigation(parking: Parking, e: Event) {
    if (!browser) return;
    e.stopPropagation();
    
    const { lat, lng, name } = parking;
    let url = '';

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      url = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(name)}`;
    } else if (/android/i.test(navigator.userAgent)) {
      url = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`;
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

  function getSortedAndFilteredParkings(): Parking[] {
    let result = [...parkings];

    // Apply filter
    switch (filterBy) {
      case 'free':
        result = result.filter(p => p.isFree && !p.isWeekendFree);
        break;
      case 'paid':
        result = result.filter(p => !p.isFree);
        break;
      case 'weekend':
        result = result.filter(p => p.isWeekendFree || (p.isFree && !p.feePerHour));
        break;
    }

    // Apply sort
    switch (sortBy) {
      case 'distance':
        if (userLocation) {
          result.sort((a, b) => {
            const distA = a.distance ?? calculateDistance(userLocation!.lat, userLocation!.lng, a.lat, a.lng);
            const distB = b.distance ?? calculateDistance(userLocation!.lat, userLocation!.lng, b.lat, b.lng);
            return distA - distB;
          });
        }
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'capacity':
        result.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
        break;
    }

    return result;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  // Get counts for filter badges
  function getFilterCounts() {
    return {
      all: parkings.length,
      free: parkings.filter(p => p.isFree && !p.isWeekendFree).length,
      paid: parkings.filter(p => !p.isFree).length,
      weekend: parkings.filter(p => p.isWeekendFree || (p.isFree && !p.feePerHour)).length,
    };
  }

  let filteredParkings = $derived(getSortedAndFilteredParkings());
  let filterCounts = $derived(getFilterCounts());
</script>

<svelte:window onkeydown={handleKeydown} />

<div 
  class="parking-panel" 
  class:open={isOpen}
  role="dialog"
  aria-label="Danh sách bãi đỗ xe"
  aria-hidden={!isOpen}
>
  <div 
    class="panel-handle" 
    onclick={onClose} 
    onkeypress={(e) => e.key === 'Enter' && onClose()} 
    role="button" 
    tabindex="0" 
    aria-label="Đóng panel"
  ></div>
  
  <div class="panel-header">
    <div class="panel-title">
      {@html ParkingIcon}
      <span>Bãi đỗ xe</span>
      <span class="panel-count">{filteredParkings.length}</span>
    </div>
    
    <div class="panel-actions">
      <!-- Filter Button -->
      <div class="dropdown-container">
        <button 
          class="panel-action-btn"
          class:active={filterBy !== 'all'}
          onclick={() => { showFilterMenu = !showFilterMenu; showSortMenu = false; }}
          aria-label="Lọc bãi đỗ"
          aria-expanded={showFilterMenu}
        >
          {@html FilterIcon}
        </button>
        
        {#if showFilterMenu}
          <div class="dropdown-menu" role="menu">
            <button 
              class="dropdown-item" 
              class:active={filterBy === 'all'}
              onclick={() => { filterBy = 'all'; showFilterMenu = false; }}
              role="menuitem"
            >
              <span>Tất cả</span>
              <span class="badge">{filterCounts.all}</span>
            </button>
            <button 
              class="dropdown-item" 
              class:active={filterBy === 'free'}
              onclick={() => { filterBy = 'free'; showFilterMenu = false; }}
              role="menuitem"
            >
              <span>Miễn phí</span>
              <span class="badge success">{filterCounts.free}</span>
            </button>
            <button 
              class="dropdown-item" 
              class:active={filterBy === 'paid'}
              onclick={() => { filterBy = 'paid'; showFilterMenu = false; }}
              role="menuitem"
            >
              <span>Trả phí</span>
              <span class="badge warning">{filterCounts.paid}</span>
            </button>
            <button 
              class="dropdown-item" 
              class:active={filterBy === 'weekend'}
              onclick={() => { filterBy = 'weekend'; showFilterMenu = false; }}
              role="menuitem"
            >
              <span>Cuối tuần</span>
              <span class="badge purple">{filterCounts.weekend}</span>
            </button>
          </div>
        {/if}
      </div>

      <!-- Sort Button -->
      <div class="dropdown-container">
        <button 
          class="panel-action-btn"
          onclick={() => { showSortMenu = !showSortMenu; showFilterMenu = false; }}
          aria-label="Sắp xếp"
          aria-expanded={showSortMenu}
        >
          {@html SortIcon}
        </button>
        
        {#if showSortMenu}
          <div class="dropdown-menu" role="menu">
            <button 
              class="dropdown-item" 
              class:active={sortBy === 'distance'}
              onclick={() => { sortBy = 'distance'; showSortMenu = false; }}
              role="menuitem"
            >
              Khoảng cách
            </button>
            <button 
              class="dropdown-item" 
              class:active={sortBy === 'name'}
              onclick={() => { sortBy = 'name'; showSortMenu = false; }}
              role="menuitem"
            >
              Tên A-Z
            </button>
            <button 
              class="dropdown-item" 
              class:active={sortBy === 'capacity'}
              onclick={() => { sortBy = 'capacity'; showSortMenu = false; }}
              role="menuitem"
            >
              Sức chứa
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="panel-content" role="listbox" aria-label="Danh sách bãi đỗ">
    {#if parkings.length === 0}
      <div class="empty-state">
        <div class="empty-icon">
          {@html CarIcon}
        </div>
        <p class="empty-title">Không có bãi đỗ</p>
        <p class="empty-text">Di chuyển bản đồ để tìm bãi đỗ xe</p>
      </div>
    {:else if filteredParkings.length === 0}
      <div class="empty-state">
        <div class="empty-icon">
          {@html FilterIcon}
        </div>
        <p class="empty-title">Không tìm thấy</p>
        <p class="empty-text">Thử thay đổi bộ lọc</p>
        <button class="reset-filter-btn" onclick={() => filterBy = 'all'}>
          Xóa bộ lọc
        </button>
      </div>
    {:else}
      {#each filteredParkings as parking (parking.id)}
        {@const isSelected = selectedParking?.id === parking.id}
        {@const distance = parking.distance ?? (userLocation ? calculateDistance(userLocation.lat, userLocation.lng, parking.lat, parking.lng) : null)}
        
        <div 
          class="parking-card"
          class:selected={isSelected}
          onclick={() => onSelectParking(parking)}
          onkeypress={(e) => e.key === 'Enter' && onSelectParking(parking)}
          role="option"
          aria-selected={isSelected}
          tabindex="0"
        >
          <div class="parking-status" class:free={parking.isFree} class:paid={!parking.isFree} class:weekend={parking.isWeekendFree}>
            {#if parking.isWeekendFree}
              <span>W</span>
            {:else if parking.isFree}
              <span>✓</span>
            {:else}
              <span>P</span>
            {/if}
          </div>
          
          <div class="parking-info">
            <div class="parking-name">{parking.name}</div>
            <div class="parking-meta">
              {#if parking.isWeekendFree}
                <span class="parking-badge weekend">
                  Cuối tuần miễn phí
                </span>
              {:else if parking.isFree}
                <span class="parking-badge free">
                  Miễn phí
                </span>
              {:else}
                <span class="parking-badge paid">
                  Trả phí
                </span>
              {/if}
              {#if parking.capacity}
                <span class="separator">·</span>
                <span class="capacity">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                  </svg>
                  {parking.capacity}
                </span>
              {/if}
            </div>
          </div>

          {#if distance !== null}
            <div class="parking-distance" title="Khoảng cách">
              {formatDistance(distance)}
            </div>
          {/if}

          <button 
            class="parking-nav-btn"
            onclick={(e) => openNavigation(parking, e)}
            title="Chỉ đường"
            aria-label="Chỉ đường đến {parking.name}"
          >
            {@html NavigateIcon}
          </button>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .panel-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .panel-action-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius);
    background: transparent;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.15s var(--ease-out);
  }

  .panel-action-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .panel-action-btn.active {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
  }

  .panel-action-btn :global(svg) {
    width: 18px;
    height: 18px;
  }

  .dropdown-container {
    position: relative;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    min-width: 160px;
    z-index: 100;
    overflow: hidden;
    animation: fadeIn 0.15s ease-out;
  }

  .dropdown-item {
    width: 100%;
    padding: 10px 14px;
    border: none;
    background: transparent;
    text-align: left;
    font-size: 13px;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    transition: background 0.1s ease;
  }

  .dropdown-item:hover {
    background: var(--bg-secondary);
  }

  .dropdown-item.active {
    background: var(--accent-light);
    color: var(--accent);
    font-weight: 500;
  }

  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    background: var(--bg-secondary);
    color: var(--text-secondary);
  }

  .badge.success {
    background: var(--success-light);
    color: var(--success);
  }

  .badge.warning {
    background: var(--warning-light);
    color: var(--warning);
  }

  .badge.purple {
    background: #ede9fe;
    color: #8b5cf6;
  }

  .parking-status.weekend {
    background: #ede9fe;
    color: #8b5cf6;
  }

  .parking-badge.weekend {
    color: #8b5cf6;
    background: #ede9fe;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-weight: 500;
  }

  .separator {
    color: var(--text-muted);
  }

  .capacity {
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--text-secondary);
  }

  .capacity :global(svg) {
    opacity: 0.7;
  }

  .reset-filter-btn {
    margin-top: 12px;
    padding: 8px 16px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .reset-filter-btn:hover {
    background: var(--accent-hover);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 640px) {
    .panel-actions {
      gap: 2px;
    }
    
    .panel-action-btn {
      width: 32px;
      height: 32px;
    }
    
    .panel-action-btn :global(svg) {
      width: 16px;
      height: 16px;
    }
  }
</style>
