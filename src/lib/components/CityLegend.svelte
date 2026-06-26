<script lang="ts">
  interface Props {
    onFilterClick?: (filter: 'free' | 'paid' | 'weekend') => void;
  }

  let { onFilterClick }: Props = $props();

  const legendItems = [
    {
      filter: 'free' as const,
      label: 'Miễn phí',
      color: '#10b981',
      bgColor: '#d1fae5',
      icon: '✓',
    },
    {
      filter: 'paid' as const,
      label: 'Trả phí',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      icon: 'P',
    },
    {
      filter: 'weekend' as const,
      label: 'Cuối tuần',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      icon: 'W',
    },
  ];

  let expanded = $state(false);
</script>

<div class="legend" class:expanded role="region" aria-label="Chú thích bãi đỗ">
  <button
    class="legend-toggle"
    onclick={() => expanded = !expanded}
    aria-expanded={expanded}
    aria-label={expanded ? 'Thu gọn chú thích' : 'Mở rộng chú thích'}
    type="button"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
    {#if !expanded}
      <span>Chú thích</span>
    {/if}
  </button>

  {#if expanded}
    <div class="legend-items">
      {#each legendItems as item}
        <button
          class="legend-item"
          onclick={() => onFilterClick?.(item.filter)}
          type="button"
          aria-label="Lọc theo {item.label}"
        >
          <span
            class="legend-marker"
            style="background: {item.bgColor}; border-color: {item.color}; color: {item.color}"
          >
            {item.icon}
          </span>
          <span class="legend-label">{item.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .legend {
    position: absolute;
    bottom: 100px;
    left: 16px;
    z-index: 150;
    background: var(--bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    transition: all 0.2s var(--ease-out);
  }

  .legend-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    width: 100%;
    transition: color 0.15s ease;
  }

  .legend-toggle:hover {
    color: var(--text-primary);
  }

  .legend.expanded .legend-toggle {
    border-bottom: 1px solid var(--border-light);
    padding: 10px 14px 8px;
  }

  .legend-items {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 6px 6px;
    animation: slideUp 0.2s ease-out;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    background: transparent;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    color: var(--text-primary);
    font-size: 13px;
    transition: background 0.1s ease;
    text-align: left;
    width: 100%;
  }

  .legend-item:hover {
    background: var(--bg-secondary);
  }

  .legend-marker {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 11px;
    flex-shrink: 0;
  }

  .legend-label {
    font-weight: 500;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    .legend {
      bottom: 90px;
      left: 12px;
    }

    .legend-toggle {
      padding: 8px 12px;
      font-size: 11px;
    }
  }
</style>