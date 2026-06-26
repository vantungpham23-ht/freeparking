<script lang="ts">
  import Icon from './Icon.svelte';

  interface Props {
    isActive: boolean;
    destination: { lat: number; lng: number; name: string } | null;
    onActivate: () => void;
    onCancel: () => void;
    onConfirm: (lat: number, lng: number) => void;
  }

  let { isActive, destination, onActivate, onCancel, onConfirm }: Props = $props();
</script>

{#if destination && !isActive}
  <div class="destination-card" role="region" aria-label="Điểm đến hiện tại">
    <div class="destination-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
    <div class="destination-info">
      <div class="destination-label">Điểm đến</div>
      <div class="destination-name">{destination.name}</div>
    </div>
    <button
      class="destination-clear"
      onclick={onCancel}
      aria-label="Bỏ chọn điểm đến"
      type="button"
    >
      <Icon name="close" size={16} />
    </button>
  </div>
{:else if isActive}
  <div class="picker-banner" role="status">
    <div class="picker-pulse">
      <div class="pulse-dot"></div>
    </div>
    <div class="picker-text">
      <div class="picker-title">Chạm vào bản đồ</div>
      <div class="picker-subtitle">để chọn điểm đến của bạn</div>
    </div>
    <button
      class="picker-cancel"
      onclick={onCancel}
      type="button"
    >
      Hủy
    </button>
  </div>
{:else}
  <button
    class="destination-fab"
    onclick={onActivate}
    aria-label="Chọn điểm đến trên bản đồ"
    title="Chọn điểm đến"
    type="button"
  >
    <span class="fab-icon">
      <Icon name="pin" size={20} />
    </span>
    <span class="fab-text">Đi đâu?</span>
  </button>
{/if}

<style>
  .destination-card {
    position: absolute;
    bottom: 100px;
    left: 16px;
    right: 80px;
    z-index: 150;
    background: var(--bg);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-lg);
    padding: 8px 8px 8px 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideUp 0.3s var(--ease-spring);
    max-width: 360px;
  }

  .destination-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .destination-info {
    flex: 1;
    min-width: 0;
  }

  .destination-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .destination-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .destination-clear {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .destination-clear:hover {
    background: var(--error-light);
    color: var(--error);
  }

  .picker-banner {
    position: absolute;
    top: calc(var(--header-height) + 12px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    background: var(--text-primary);
    color: white;
    border-radius: var(--radius-full);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-lg);
    animation: slideDown 0.3s var(--ease-spring);
  }

  .picker-pulse {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--pink);
    position: relative;
    flex-shrink: 0;
  }

  .pulse-dot {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--pink);
    animation: pulse-dot 1.4s ease-out infinite;
  }

  @keyframes pulse-dot {
    0% {
      transform: scale(0.8);
      opacity: 1;
      box-shadow: 0 0 0 0 rgba(244, 114, 182, 0.6);
    }
    100% {
      transform: scale(1.6);
      opacity: 0.3;
      box-shadow: 0 0 0 12px rgba(244, 114, 182, 0);
    }
  }

  .picker-text {
    flex: 1;
  }

  .picker-title {
    font-size: 13px;
    font-weight: 700;
  }

  .picker-subtitle {
    font-size: 11px;
    opacity: 0.8;
  }

  .picker-cancel {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .picker-cancel:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .destination-fab {
    position: absolute;
    bottom: 232px;
    right: 16px;
    z-index: 150;
    background: var(--gradient-primary);
    border: none;
    border-radius: var(--radius-full);
    padding: 12px 18px 12px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
    cursor: pointer;
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    transition: all 0.2s var(--ease-spring);
    font-family: inherit;
  }

  .destination-fab:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: var(--shadow-xl), var(--shadow-glow);
  }

  .destination-fab:active {
    transform: scale(0.96);
  }

  .fab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
  }

  .fab-text {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @media (max-width: 640px) {
    .destination-card {
      right: 76px;
      bottom: 90px;
    }

    .destination-fab {
      bottom: 220px;
      right: 12px;
      padding: 10px 14px 10px 12px;
    }

    .fab-text {
      display: none;
    }

    .destination-fab {
      width: 48px;
      height: 48px;
      padding: 0;
      justify-content: center;
    }

    .fab-icon {
      background: transparent;
    }
  }
</style>