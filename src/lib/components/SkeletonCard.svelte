<script lang="ts">
  interface Props {
    count?: number;
  }

  let { count = 4 }: Props = $props();

  const items = $derived(Array.from({ length: count }));
</script>

<div class="skeleton-list" role="status" aria-label="Đang tải danh sách">
  {#each items as _, i}
    <div class="skeleton-card" style="animation-delay: {i * 80}ms">
      <div class="skeleton-status shimmer"></div>
      <div class="skeleton-info">
        <div class="skeleton-name shimmer"></div>
        <div class="skeleton-meta shimmer"></div>
      </div>
      <div class="skeleton-distance shimmer"></div>
      <div class="skeleton-nav shimmer"></div>
    </div>
  {/each}
</div>

<style>
  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .skeleton-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .skeleton-status {
    width: 40px;
    height: 40px;
    border-radius: var(--radius);
    flex-shrink: 0;
  }

  .skeleton-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .skeleton-name {
    height: 14px;
    width: 70%;
    border-radius: 4px;
  }

  .skeleton-meta {
    height: 12px;
    width: 45%;
    border-radius: 4px;
  }

  .skeleton-distance {
    width: 40px;
    height: 12px;
    border-radius: 4px;
  }

  .skeleton-nav {
    width: 40px;
    height: 40px;
    border-radius: var(--radius);
    flex-shrink: 0;
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      var(--bg-secondary) 0%,
      var(--border-light) 50%,
      var(--bg-secondary) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>