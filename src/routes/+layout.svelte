<script>
  let { children } = $props();
</script>

<svelte:head>
  <title>T-Map - Tìm Bãi Đỗ Xe</title>
  <meta name="description" content="Tìm kiếm và định vị bãi đỗ xe nhanh chóng với T-Map. Hỗ trợ tìm bãi đỗ miễn phí, trả phí và cuối tuần miễn phí." />
  <meta name="keywords" content="bãi đỗ xe, parking, t-map, kosice, tìm bãi đỗ" />
  <meta name="author" content="T-Map" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="T-Map - Tìm Bãi Đỗ Xe" />
  <meta property="og:description" content="Tìm kiếm và định vị bãi đỗ xe nhanh chóng" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="T-Map - Tìm Bãi Đỗ Xe" />
  <meta name="twitter:description" content="Tìm kiếm và định vị bãi đỗ xe nhanh chóng" />
  
  <!-- Theme -->
  <meta name="theme-color" content="#6366f1" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="T-Map" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='4'/%3E%3Cpath d='M9 17V7h4a3 3 0 0 1 0 6h-2a2 2 0 0 0 0 4h2'/%3E%3C/svg%3E" />
  
  <!-- Preconnect to external resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="preconnect" href="https://overpass-api.de" />
  <link rel="preconnect" href="https://nominatim.openstreetmap.org" />
  <link rel="preconnect" href="https://basemaps.cartocdn.com" />
  
  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="anonymous" />
</svelte:head>

{@render children()}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overscroll-behavior: none;
  }
</style>
