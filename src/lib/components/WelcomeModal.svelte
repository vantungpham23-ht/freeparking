<script lang="ts">
  import { markOnboardingSeen } from '$lib/stores/preferences';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();

  let currentStep = $state(0);

  const steps = [
    {
      icon: 'sparkle',
      iconColor: '#6366f1',
      iconBg: 'linear-gradient(135deg, #eef2ff 0%, #fce7f3 100%)',
      title: 'Chào bạn! 👋',
      description: 'T-Map giúp bạn tìm bãi đỗ xe gần nhất một cách nhanh chóng và dễ thương.',
    },
    {
      icon: 'city',
      iconColor: '#10b981',
      iconBg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      title: 'Chọn thành phố 🏙️',
      description: 'Chuyển đổi giữa Košice (Slovakia) và Vinh (Việt Nam) chỉ với một cú chạm.',
    },
    {
      icon: 'pin',
      iconColor: '#ec4899',
      iconBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      title: 'Chọn điểm đến 📍',
      description: 'Nhấn nút "Đi đâu?" rồi chạm vào bất kỳ đâu trên bản đồ để xem các bãi đỗ gần đó.',
    },
    {
      icon: 'filter',
      iconColor: '#f59e0b',
      iconBg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      title: 'Lọc thông minh ✨',
      description: 'Tìm bãi miễn phí, trả phí hoặc cuối tuần miễn phí. Sắp xếp theo khoảng cách hoặc sức chứa.',
    },
  ];

  function handleNext() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      handleFinish();
    }
  }

  function handleFinish() {
    markOnboardingSeen();
    onClose();
  }

  function handleSkip() {
    handleFinish();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleSkip();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleSkip();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      if (currentStep > 0) currentStep--;
    }
  }

  const step = $derived(steps[currentStep]);
</script>

<svelte:window onkeydown={isOpen ? handleKeydown : undefined} />

{#if isOpen}
  <div
    class="modal-backdrop"
    role="presentation"
    onclick={handleBackdropClick}
  >
    <div
      class="modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <button
        class="close-btn"
        onclick={handleSkip}
        aria-label="Đóng hướng dẫn"
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="modal-icon" style="background: {step.iconBg}; color: {step.iconColor}">
        {#if step.icon === 'sparkle'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/>
          </svg>
        {:else if step.icon === 'city'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
            <circle cx="9" cy="10" r="1" fill="currentColor"/>
            <circle cx="9" cy="14" r="1" fill="currentColor"/>
            <circle cx="16" cy="14" r="1" fill="currentColor"/>
          </svg>
        {:else if step.icon === 'pin'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        {:else if step.icon === 'filter'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        {:else if step.icon === 'navigate'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
        {/if}
      </div>

      <h2 class="modal-title" id="welcome-title">{step.title}</h2>
      <p class="modal-description">{step.description}</p>

      <div class="step-indicators" role="tablist">
        {#each steps as _, i}
          <button
            class="step-dot"
            class:active={i === currentStep}
            onclick={() => currentStep = i}
            aria-label="Bước {i + 1}"
            aria-selected={i === currentStep}
            role="tab"
            type="button"
          ></button>
        {/each}
      </div>

      <div class="modal-actions">
        <button
          class="btn-text"
          onclick={handleSkip}
          type="button"
        >
          Bỏ qua
        </button>

        {#if currentStep > 0}
          <button
            class="btn-secondary"
            onclick={() => currentStep--}
            type="button"
          >
            Quay lại
          </button>
        {/if}

        <button
          class="btn-primary"
          onclick={handleNext}
          type="button"
        >
          {currentStep < steps.length - 1 ? 'Tiếp theo' : 'Bắt đầu'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    padding: 20px;
    animation: fadeIn 0.2s ease-out;
  }

  .modal-content {
    background: var(--bg);
    border-radius: var(--radius-2xl);
    padding: 36px 28px 24px;
    max-width: 420px;
    width: 100%;
    position: relative;
    box-shadow: var(--shadow-xl);
    animation: slideUp 0.4s var(--ease-spring);
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: var(--bg-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all 0.2s var(--ease-spring);
  }

  .close-btn:hover {
    background: var(--error-light);
    color: var(--error);
    transform: rotate(90deg);
  }

  .modal-icon {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    animation: bounce-icon 2s ease-in-out infinite;
  }

  @keyframes bounce-icon {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }

  .modal-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: 8px;
    line-height: 1.3;
    letter-spacing: -0.5px;
  }

  .modal-description {
    font-size: 14px;
    color: var(--text-secondary);
    text-align: center;
    line-height: 1.6;
    margin-bottom: 24px;
    font-weight: 500;
  }

  .step-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
  }

  .step-dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: var(--border);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s var(--ease-spring);
  }

  .step-dot.active {
    background: var(--gradient-primary);
    width: 28px;
  }

  .modal-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .btn-text {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-right: auto;
    border-radius: var(--radius);
    transition: color 0.15s ease;
  }

  .btn-text:hover {
    color: var(--text-primary);
  }

  .btn-secondary {
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-light);
    color: var(--text-primary);
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border-radius: var(--radius-full);
    transition: all 0.2s var(--ease-spring);
  }

  .btn-secondary:hover {
    background: var(--bg);
    border-color: var(--accent-light);
    transform: translateY(-1px);
  }

  .btn-primary {
    background: var(--gradient-primary);
    border: none;
    color: white;
    padding: 10px 22px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s var(--ease-spring);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }

  .btn-primary:active {
    transform: scale(0.96);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      padding: 28px 20px 20px;
    }

    .modal-title {
      font-size: 18px;
    }
  }
</style>