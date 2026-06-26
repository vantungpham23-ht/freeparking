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
      icon: 'pin',
      iconColor: '#2563eb',
      iconBg: '#dbeafe',
      title: 'Chào mừng đến với T-Map',
      description: 'Ứng dụng giúp bạn tìm kiếm và định vị bãi đỗ xe nhanh chóng tại Košice và Vinh.',
    },
    {
      icon: 'city',
      iconColor: '#10b981',
      iconBg: '#d1fae5',
      title: 'Chọn thành phố của bạn',
      description: 'Chuyển đổi giữa Košice (Slovakia) và Vinh (Việt Nam) bằng nút ở góc trên bên trái.',
    },
    {
      icon: 'filter',
      iconColor: '#f59e0b',
      iconBg: '#fef3c7',
      title: 'Lọc bãi đỗ theo nhu cầu',
      description: 'Lọc theo miễn phí, trả phí hoặc cuối tuần miễn phí. Sắp xếp theo khoảng cách hoặc sức chứa.',
    },
    {
      icon: 'navigate',
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
      title: 'Chỉ đường dễ dàng',
      description: 'Nhấn nút định vị để mở Google Maps/Apple Maps và dẫn đường đến bãi đỗ gần nhất.',
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
        {#if step.icon === 'pin'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        {:else if step.icon === 'city'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"/>
            <path d="M5 21V7l8-4v18"/>
            <path d="M19 21V11l-6-4"/>
          </svg>
        {:else if step.icon === 'filter'}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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
    border-radius: var(--radius-xl);
    padding: 32px 28px 24px;
    max-width: 420px;
    width: 100%;
    position: relative;
    box-shadow: var(--shadow-xl);
    animation: slideUp 0.3s var(--ease-spring);
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
    transition: all 0.15s ease;
  }

  .close-btn:hover {
    background: var(--border);
    color: var(--text-primary);
  }

  .modal-icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  .modal-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .modal-description {
    font-size: 14px;
    color: var(--text-secondary);
    text-align: center;
    line-height: 1.6;
    margin-bottom: 24px;
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
    border-radius: 50%;
    background: var(--border);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;
  }

  .step-dot.active {
    background: var(--accent);
    width: 24px;
    border-radius: 4px;
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
    font-weight: 500;
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
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border-radius: var(--radius);
    transition: all 0.15s ease;
  }

  .btn-secondary:hover {
    background: var(--border-light);
  }

  .btn-primary {
    background: var(--accent);
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
  }

  .btn-primary:active {
    transform: scale(0.98);
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