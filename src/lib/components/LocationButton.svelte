<script lang="ts">
  import { locationStore, type LocationState } from '$lib/stores/location';
  import { LocationIcon } from '$lib/icons';

  interface Props {
    onClick: () => void;
  }

  let { onClick }: Props = $props();

  let showTooltip = $state(false);
  let tooltipMessage = $state('');

  const state = $derived($locationStore.state);
  const hasCoords = $derived($locationStore.coords !== null);

  function handleClick() {
    if (state === 'denied') {
      tooltipMessage = 'Vị trí bị chặn. Bật quyền trong cài đặt trình duyệt.';
      showTooltip = true;
      setTimeout(() => showTooltip = false, 4000);
    } else if (state === 'unavailable') {
      tooltipMessage = 'Trình duyệt không hỗ trợ định vị.';
      showTooltip = true;
      setTimeout(() => showTooltip = false, 4000);
    } else {
      onClick();
    }
  }
</script>

<div class="location-fab-wrapper">
  {#if showTooltip}
    <div class="tooltip" role="tooltip">
      {tooltipMessage}
    </div>
  {/if}

  <button
    class="location-fab"
    class:requesting={state === 'requesting'}
    class:granted={state === 'granted'}
    class:denied={state === 'denied'}
    onclick={handleClick}
    aria-label={
      state === 'requesting' ? 'Đang tìm vị trí...' :
      state === 'granted' ? 'Vị trí của tôi' :
      state === 'denied' ? 'Vị trí bị chặn' :
      'Bật vị trí của tôi'
    }
    title={
      state === 'denied' ? 'Vị trí bị chặn' :
      state === 'granted' ? 'Vị trí của tôi' :
      'Bật vị trí của tôi'
    }
    type="button"
  >
    {#if state === 'requesting'}
      <div class="spinner"></div>
      <div class="pulse-ring"></div>
    {:else if state === 'granted'}
      <span class="icon-active">{@html LocationIcon}</span>
    {:else if state === 'denied'}
      <span class="icon-denied">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
          <line x1="3" y1="3" x2="21" y2="21"/>
        </svg>
      </span>
    {:else}
      {@html LocationIcon}
    {/if}
  </button>
</div>

<style>
  .location-fab-wrapper {
    position: absolute;
    bottom: 168px;
    right: 16px;
    z-index: 150;
  }

  .location-fab {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: var(--radius-lg);
    background: var(--bg);
    border: none;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--accent);
    transition: all 0.2s var(--ease-out);
    overflow: visible;
  }

  .location-fab:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  .location-fab:active {
    transform: scale(0.95);
  }

  .location-fab.granted {
    color: var(--success);
    background: var(--success-light);
  }

  .location-fab.denied {
    color: var(--text-muted);
    background: var(--bg-secondary);
  }

  .location-fab svg {
    width: 24px;
    height: 24px;
  }

  .icon-active,
  .icon-denied {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--border-light);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .pulse-ring {
    position: absolute;
    inset: -4px;
    border-radius: var(--radius-lg);
    border: 2px solid var(--accent);
    animation: pulse-ring 1.4s ease-out infinite;
    pointer-events: none;
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(0.9);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.15);
      opacity: 0;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    background: var(--text-primary);
    color: white;
    padding: 8px 12px;
    border-radius: var(--radius);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    max-width: 240px;
    box-shadow: var(--shadow-lg);
    animation: tooltipIn 0.2s ease-out;
    z-index: 160;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 24px;
    border: 6px solid transparent;
    border-top-color: var(--text-primary);
  }

  @keyframes tooltipIn {
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
    .location-fab-wrapper {
      bottom: 156px;
      right: 12px;
    }

    .location-fab {
      width: 52px;
      height: 52px;
    }
  }
</style>