<script lang="ts">
  import Icon from './Icon.svelte';

  interface Props {
    onToggleList?: () => void;
    onSearch?: (query: string, radiusKm: number) => void;
    onRadiusChange?: (radiusKm: number) => void;
    onCityChange?: (cityId: string) => void;
    onShowHelp?: () => void;
    isListOpen?: boolean;
    currentCity?: string;
    cityCounts?: Record<string, number>;
  }

  let {
    onToggleList,
    onSearch,
    onRadiusChange,
    onCityChange,
    onShowHelp,
    isListOpen = false,
    currentCity = 'kosice',
    cityCounts = {}
  }: Props = $props();

  let searchQuery = $state('');
  let radiusKm = $state(2);
  let isSearching = $state(false);
  let inputRef: HTMLInputElement | undefined = $state(undefined);
  let suggestions: string[] = $state([]);
  let showSuggestions = $state(false);
  
  const radiusOptions = [
    { value: 0.5, label: '500m' },
    { value: 1, label: '1 km' },
    { value: 2, label: '2 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
  ];

  // Popular search suggestions
  const popularSearches = [
    'Aupark Košice',
    'Staničné námestie',
    'Košice center',
    'Železničná stanica',
    'OC Galéria',
    'Vincom Vinh',
    'Quảng trường Hồ Chí Minh Vinh',
    'Bến xe Vinh',
  ];

  async function searchLocation(query: string) {
    if (query.length < 2) {
      suggestions = [];
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      
      suggestions = results.map((r: any) => ({
        display: r.display_name.split(',').slice(0, 3).join(','),
        lat: r.lat,
        lon: r.lon,
      }));
    } catch {
      suggestions = [];
    }
  }

  function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
    let timeoutId: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
  }

  const debouncedSearch = debounce(searchLocation, 300);

  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    searchQuery = value;
    debouncedSearch(value);
    showSuggestions = true;
  }

  function handleSearch() {
    if (!searchQuery.trim()) return;
    isSearching = true;
    onSearch?.(searchQuery, radiusKm);
    showSuggestions = false;
    setTimeout(() => {
      isSearching = false;
    }, 500);
  }

  function handleSelectSuggestion(suggestion: typeof suggestions[0]) {
    searchQuery = suggestion.display;
    showSuggestions = false;
    isSearching = true;
    onSearch?.(suggestion.display, radiusKm);
    setTimeout(() => {
      isSearching = false;
    }, 500);
  }

  function handlePopularSearch(search: string) {
    searchQuery = search;
    handleSearch();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      showSuggestions = false;
      searchQuery = '';
    }
  }

  function handleRadiusChange(e: Event) {
    const value = parseFloat((e.target as HTMLSelectElement).value);
    radiusKm = value;
    onRadiusChange?.(value);
  }

  function clearSearch() {
    searchQuery = '';
    suggestions = [];
    inputRef?.focus();
  }
</script>

<header class="header">
  <a href="/" class="header-logo" aria-label="T-Map - Trang chủ">
    <Icon name="parking" size={22} />
    <span>T-map</span>
  </a>

  <div class="city-selector">
    <button
      class="city-btn"
      class:active={currentCity === 'kosice'}
      onclick={() => onCityChange?.('kosice')}
      type="button"
    >
      Košice
      {#if cityCounts.kosice !== undefined}
        <span class="city-count">{cityCounts.kosice}</span>
      {/if}
    </button>
    <button
      class="city-btn"
      class:active={currentCity === 'vinh'}
      onclick={() => onCityChange?.('vinh')}
      type="button"
    >
      Vinh
      {#if cityCounts.vinh !== undefined}
        <span class="city-count">{cityCounts.vinh}</span>
      {/if}
    </button>
  </div>

  <div class="search-container">
    <div class="search-box" class:searching={isSearching}>
      <span class="search-icon"><Icon name="search" size={18} /></span>

      <div class="input-wrapper">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Tìm kiếm địa điểm (VD: Aupark)..."
          aria-label="Tìm kiếm địa điểm"
          bind:value={searchQuery}
          bind:this={inputRef}
          oninput={handleInput}
          onkeydown={handleKeydown}
          onfocus={() => showSuggestions = true}
          onblur={() => setTimeout(() => showSuggestions = false, 200)}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          autocomplete="off"
        />
        
        {#if searchQuery}
          <button
            class="clear-btn"
            onclick={clearSearch}
            aria-label="Xóa tìm kiếm"
            type="button"
          >
            <Icon name="close" size={14} />
          </button>
        {/if}
      </div>
      
      <select 
        class="radius-select"
        value={radiusKm}
        onchange={handleRadiusChange}
        aria-label="Bán kính tìm kiếm"
      >
        {#each radiusOptions as r}
          <option value={r.value}>{r.label}</option>
        {/each}
      </select>
      
      <button 
        class="search-btn" 
        onclick={handleSearch}
        aria-label="Tìm kiếm"
        type="button"
      >
        {#if isSearching}
          <div class="spinner"></div>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        {/if}
      </button>
    </div>

    {#if showSuggestions && (suggestions.length > 0 || searchQuery.length === 0)}
      <div class="suggestions-dropdown" id="search-suggestions" role="listbox">
        {#if suggestions.length > 0}
          {#each suggestions as suggestion}
            <button 
              class="suggestion-item"
              onclick={() => handleSelectSuggestion(suggestion)}
              role="option"
              aria-selected="false"
              type="button"
            >
              <svg class="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span class="suggestion-text">{suggestion.display}</span>
            </button>
          {/each}
        {:else if searchQuery.length === 0}
          <div class="suggestions-header">Tìm kiếm phổ biến</div>
          {#each popularSearches as search}
            <button 
              class="suggestion-item popular"
              onclick={() => handlePopularSearch(search)}
              role="option"
              aria-selected="false"
              type="button"
            >
              <svg class="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span class="suggestion-text">{search}</span>
            </button>
          {/each}
        {/if}
      </div>
    {/if}
  </div>

  <div class="header-actions">
    {#if onShowHelp}
      <button
        class="icon-btn"
        onclick={onShowHelp}
        aria-label="Xem hướng dẫn"
        title="Hướng dẫn"
        type="button"
      >
        <Icon name="help" size={20} />
      </button>
    {/if}

    <button
        class="icon-btn"
        class:active={isListOpen}
        onclick={onToggleList}
        aria-label={isListOpen ? 'Đóng danh sách' : 'Mở danh sách bãi đỗ'}
        title={isListOpen ? 'Đóng danh sách' : 'Mở danh sách'}
        type="button"
      >
        <Icon name="menu" size={20} />
      </button>
  </div>
</header>

<style>
  .city-selector {
    display: flex;
    gap: 4px;
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-light);
    border-radius: var(--radius-full);
    padding: 4px;
  }

  .city-btn {
    padding: 6px 14px;
    border: none;
    border-radius: var(--radius-full);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    background: transparent;
    color: var(--text-secondary);
    transition: all 0.2s var(--ease-spring);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .city-btn:hover {
    color: var(--text-primary);
  }

  .city-btn.active {
    background: var(--gradient-primary);
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .city-count {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.25);
    color: inherit;
    min-width: 18px;
    text-align: center;
  }

  .city-btn:not(.active) .city-count {
    background: var(--bg);
    color: var(--text-muted);
  }

  .search-container {
    flex: 1;
    max-width: 480px;
    position: relative;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 0 6px 0 16px;
    transition: all 0.2s var(--ease-out);
  }

  .search-box:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-light);
    background: var(--bg);
  }

  .search-box.searching {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    font-family: inherit;
    background: transparent;
    color: var(--text-primary);
    min-width: 0;
  }

  .search-input::placeholder {
    color: var(--text-muted);
  }

  .clear-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .clear-btn:hover {
    background: var(--border);
    color: var(--text-primary);
  }

  .search-icon {
    color: var(--text-muted);
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .radius-select {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 6px 10px;
    font-size: 13px;
    font-family: inherit;
    color: var(--text-primary);
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
  }

  .radius-select:focus {
    border-color: var(--accent);
  }

  .search-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius);
    background: var(--accent);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    flex-shrink: 0;
    transition: all 0.15s var(--ease-out);
  }

  .search-btn:hover {
    background: var(--accent-hover);
    transform: scale(1.05);
  }

  .search-btn:active {
    transform: scale(0.95);
  }

  .search-btn :global(svg) {
    width: 18px;
    height: 18px;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .suggestions-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    max-height: 320px;
    overflow-y: auto;
    z-index: 1000;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .suggestions-header {
    padding: 12px 16px 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
  }

  .suggestion-item {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background 0.1s ease;
  }

  .suggestion-item:hover {
    background: var(--bg-secondary);
  }

  .suggestion-item.popular {
    color: var(--text-primary);
  }

  .suggestion-icon {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .suggestion-item.popular .suggestion-icon {
    color: var(--warning);
  }

  .suggestion-text {
    font-size: 14px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    .search-container {
      max-width: none;
    }

    .city-selector {
      gap: 2px;
      padding: 3px;
    }

    .city-btn {
      padding: 4px 10px;
      font-size: 12px;
    }

    .search-box {
      height: 40px;
      padding: 0 4px 0 12px;
    }

    .radius-select {
      display: none;
    }

    .suggestion-text {
      font-size: 13px;
    }
  }
</style>
