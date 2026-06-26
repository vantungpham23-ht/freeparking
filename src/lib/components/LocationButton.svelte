<script lang="ts">
  import { locationStore, type LocationState } from '$lib/stores/location';
  import Icon from './Icon.svelte';

  interface Props {
    onClick: () => void;
  }

  let { onClick }: Props = $props();

  let showTooltip = $state(false);
  let tooltipMessage = $state('');

  const state = $derived($locationStore.state);

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
      <span class="icon-active"><Icon name="location" size={22} /></span>
    {:else if state === 'denied'}
      <span class="icon-denied">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
          <line x1="3" y1="3" x2="21" y2="21"/>
        </svg>
      </span>
    {:else}
      <Icon name="location" size={22} />
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
    border-radius: 50%;
    background: var(--bg);
    border: 1.5px solid var(--border-light);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--accent);
    transition: all 0.25s var(--ease-spring);
    overflow: visible;
  }

  .location-fab:hover {
    box-shadow: var(--shadow-xl), 0 0 24px rgba(99, 102, 241, 0.2);
    transform: translateY(-3px) scale(1.05);
    border-color: var(--accent-light);
  }

  .location-fab:active {
    transform: scale(0.92);
  }

  .location-fab.granted {
    color: white;
    background: var(--gradient-primary);
    border-color: transparent;
  }

  .location-fab.denied {
    color: var(--text-muted);
    background: var(--bg-secondary);
  }

  .location-fab svg {
    width: 22px;
    height: 22px;
  }

  .icon-active,
  .icon-denied {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 22px;
    height: 22px;
    border: 3px solid var(--accent-light);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .pulse-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2.5px solid var(--accent);
    animation: pulse-ring 1.4s ease-out infinite;
    pointer-events: none;
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(0.85);
      opacity: 0.7;
    }
    100% {
      transform: scale(1.25);
      opacity: 0;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    right: 0;
    background: var(--text-primary);
    color: white;
    padding: 8px 14px;
    border-radius: var(--radius);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    max-width: 240px;
    box-shadow: var(--shadow-lg);
    animation: tooltipIn 0.25s var(--ease-spring);
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