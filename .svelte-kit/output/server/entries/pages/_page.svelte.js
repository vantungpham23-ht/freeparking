import { a5 as ssr_context, a6 as bind_props, a7 as ensure_array_like, a8 as attr_style, a3 as derived, a9 as stringify, aa as attr, ab as attr_class, ac as clsx, e as escape_html, ad as store_get, ae as unsubscribe_stores, a4 as head } from "../../chunks/index.js";
import "clsx";
import { w as writable } from "../../chunks/index2.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
const locationStore = writable({
  state: "unknown",
  coords: null,
  errorMessage: null
});
function Map_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      parkings,
      selectedParking,
      userLocation,
      destination,
      pickerMode,
      onSelectParking,
      onMapMove,
      onUserLocationChange,
      onMapClick
    } = $$props;
    onDestroy(() => {
      return;
    });
    function flyTo(lat, lng, zoom = 17) {
    }
    function centerOnUser() {
    }
    function refreshMarkers() {
    }
    $$renderer2.push(`<div class="map-container svelte-13da2aa">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="map-loading svelte-13da2aa" role="status" aria-label="Đang tải bản đồ"><div class="map-loading-spinner svelte-13da2aa"></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { flyTo, centerOnUser, refreshMarkers });
  });
}
function SkeletonCard($$renderer, $$props) {
  let { count = 4 } = $$props;
  const items = derived(() => Array.from({ length: count }));
  $$renderer.push(`<div class="skeleton-list svelte-lx25l7" role="status" aria-label="Đang tải danh sách"><!--[-->`);
  const each_array = ensure_array_like(items());
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    each_array[i];
    $$renderer.push(`<div class="skeleton-card svelte-lx25l7"${attr_style(`animation-delay: ${stringify(i * 80)}ms`)}><div class="skeleton-status shimmer svelte-lx25l7"></div> <div class="skeleton-info svelte-lx25l7"><div class="skeleton-name shimmer svelte-lx25l7"></div> <div class="skeleton-meta shimmer svelte-lx25l7"></div></div> <div class="skeleton-distance shimmer svelte-lx25l7"></div> <div class="skeleton-nav shimmer svelte-lx25l7"></div></div>`);
  }
  $$renderer.push(`<!--]--></div>`);
}
function Icon($$renderer, $$props) {
  let { name, size = 20, strokeWidth = 1.8, class: className = "" } = $$props;
  $$renderer.push(`<svg${attr("width", size)}${attr("height", size)} viewBox="0 0 24 24" fill="none" stroke="currentColor"${attr("stroke-width", strokeWidth)} stroke-linecap="round" stroke-linejoin="round"${attr_class(clsx(className))} aria-hidden="true">`);
  if (name === "parking") {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6h-2a2 2 0 0 0 0 4h2"></path>`);
  } else if (name === "location") {
    $$renderer.push("<!--[1-->");
    $$renderer.push(`<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>`);
  } else if (name === "navigate") {
    $$renderer.push("<!--[2-->");
    $$renderer.push(`<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>`);
  } else if (name === "close") {
    $$renderer.push("<!--[3-->");
    $$renderer.push(`<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>`);
  } else if (name === "search") {
    $$renderer.push("<!--[4-->");
    $$renderer.push(`<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>`);
  } else if (name === "list") {
    $$renderer.push("<!--[5-->");
    $$renderer.push(`<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>`);
  } else if (name === "check") {
    $$renderer.push("<!--[6-->");
    $$renderer.push(`<polyline points="20 6 9 17 4 12"></polyline>`);
  } else if (name === "menu") {
    $$renderer.push("<!--[7-->");
    $$renderer.push(`<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>`);
  } else if (name === "filter") {
    $$renderer.push("<!--[8-->");
    $$renderer.push(`<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>`);
  } else if (name === "sort") {
    $$renderer.push("<!--[9-->");
    $$renderer.push(`<path d="M3 6h18M6 12h12M9 18h6"></path>`);
  } else if (name === "info") {
    $$renderer.push("<!--[10-->");
    $$renderer.push(`<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>`);
  } else if (name === "help") {
    $$renderer.push("<!--[11-->");
    $$renderer.push(`<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>`);
  } else if (name === "arrow-right") {
    $$renderer.push("<!--[12-->");
    $$renderer.push(`<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>`);
  } else if (name === "car") {
    $$renderer.push("<!--[13-->");
    $$renderer.push(`<path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path><circle cx="6.5" cy="16.5" r="2.5"></circle><circle cx="16.5" cy="16.5" r="2.5"></circle>`);
  } else if (name === "pin") {
    $$renderer.push("<!--[14-->");
    $$renderer.push(`<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>`);
  } else if (name === "star") {
    $$renderer.push("<!--[15-->");
    $$renderer.push(`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>`);
  } else if (name === "city") {
    $$renderer.push("<!--[16-->");
    $$renderer.push(`<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path>`);
  } else if (name === "sparkle") {
    $$renderer.push("<!--[17-->");
    $$renderer.push(`<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"></path>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></svg>`);
}
function ParkingPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      parkings,
      selectedParking,
      userLocation,
      isOpen,
      isLoading = false
    } = $$props;
    let sortBy = "distance";
    let filterBy = "all";
    let showSortMenu = false;
    let showFilterMenu = false;
    function calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371e3;
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
    function formatDistance(meters) {
      if (meters < 100) return "< 100m";
      if (meters < 1e3) return `${Math.round(meters)}m`;
      return `${(meters / 1e3).toFixed(1)}km`;
    }
    function estimateWalkingMinutes(meters) {
      const minutes = Math.ceil(meters / 80);
      if (minutes < 1) return "< 1 phút";
      return `${minutes} phút đi bộ`;
    }
    function getSortedAndFilteredParkings() {
      let result = [...parkings];
      switch (filterBy) {
        case "free":
          result = result.filter((p) => p.isFree && !p.isWeekendFree);
          break;
        case "paid":
          result = result.filter((p) => !p.isFree);
          break;
        case "weekend":
          result = result.filter((p) => p.isWeekendFree || p.isFree && !p.feePerHour);
          break;
      }
      switch (sortBy) {
        case "distance":
          if (userLocation) {
            result.sort((a, b) => {
              const distA = a.distance ?? calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
              const distB = b.distance ?? calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
              return distA - distB;
            });
          }
          break;
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "capacity":
          result.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
          break;
      }
      return result;
    }
    let filteredParkings = derived(getSortedAndFilteredParkings);
    $$renderer2.push(`<div${attr_class("parking-panel", void 0, { "open": isOpen })} role="dialog" aria-label="Danh sách bãi đỗ xe"${attr("aria-hidden", !isOpen)}><div class="panel-handle" role="button" tabindex="0" aria-label="Đóng panel"></div> <div class="panel-header"><div class="panel-title">`);
    Icon($$renderer2, { name: "parking", size: 18 });
    $$renderer2.push(`<!----> <span>Bãi đỗ xe</span> <span class="panel-count">${escape_html(filteredParkings().length)}</span></div> <div class="panel-actions svelte-122re7a"><div class="dropdown-container svelte-122re7a"><button${attr_class("panel-action-btn svelte-122re7a", void 0, { "active": filterBy !== "all" })} aria-label="Lọc bãi đỗ"${attr("aria-expanded", showFilterMenu)}>`);
    Icon($$renderer2, { name: "filter", size: 18 });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="dropdown-container svelte-122re7a"><button class="panel-action-btn svelte-122re7a" aria-label="Sắp xếp"${attr("aria-expanded", showSortMenu)}>`);
    Icon($$renderer2, { name: "sort", size: 18 });
    $$renderer2.push(`<!----></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="panel-content" role="listbox" aria-label="Danh sách bãi đỗ">`);
    if (isLoading) {
      $$renderer2.push("<!--[0-->");
      SkeletonCard($$renderer2, { count: 4 });
    } else if (parkings.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="empty-state"><div class="empty-icon">`);
      Icon($$renderer2, { name: "car", size: 36 });
      $$renderer2.push(`<!----></div> <p class="empty-title">Không có bãi đỗ</p> <p class="empty-text">Di chuyển bản đồ để tìm bãi đỗ xe</p></div>`);
    } else if (filteredParkings().length === 0) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="empty-state"><div class="empty-icon">`);
      Icon($$renderer2, { name: "filter", size: 18 });
      $$renderer2.push(`<!----></div> <p class="empty-title">Không tìm thấy</p> <p class="empty-text">Thử thay đổi bộ lọc</p> <button class="reset-filter-btn svelte-122re7a">Xóa bộ lọc</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(filteredParkings());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let parking = each_array[$$index];
        const isSelected = selectedParking?.id === parking.id;
        const distance = parking.distance ?? (userLocation ? calculateDistance(userLocation.lat, userLocation.lng, parking.lat, parking.lng) : null);
        $$renderer2.push(`<div${attr_class("parking-card", void 0, { "selected": isSelected })} role="option"${attr("aria-selected", isSelected)} tabindex="0"><div${attr_class("parking-status svelte-122re7a", void 0, {
          "free": parking.isFree,
          "paid": !parking.isFree,
          "weekend": parking.isWeekendFree
        })}>`);
        if (parking.isWeekendFree) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span>W</span>`);
        } else if (parking.isFree) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span>✓</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span>P</span>`);
        }
        $$renderer2.push(`<!--]--></div> <div class="parking-info"><div class="parking-name">${escape_html(parking.name)}</div> <div class="parking-meta">`);
        if (parking.isWeekendFree) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="parking-badge weekend svelte-122re7a">Cuối tuần miễn phí</span>`);
        } else if (parking.isFree) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="parking-badge free">Miễn phí</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="parking-badge paid">Trả phí</span>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (parking.capacity) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="separator svelte-122re7a">·</span> <span class="capacity svelte-122re7a"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path></svg> ${escape_html(parking.capacity)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> `);
        if (distance !== null) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="parking-distance"${attr("title", estimateWalkingMinutes(distance))}><div class="distance-value">${escape_html(formatDistance(distance))}</div> `);
          if (distance < 2e3) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="distance-time">${escape_html(estimateWalkingMinutes(distance))}</div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <button class="parking-nav-btn" title="Chỉ đường"${attr("aria-label", `Chỉ đường đến ${stringify(parking.name)}`)}>`);
        Icon($$renderer2, { name: "navigate", size: 18 });
        $$renderer2.push(`<!----></button></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      onShowHelp,
      isListOpen = false,
      currentCity = "kosice",
      cityCounts = {}
    } = $$props;
    let searchQuery = "";
    let radiusKm = 2;
    let isSearching = false;
    let showSuggestions = false;
    const radiusOptions = [
      { value: 0.5, label: "500m" },
      { value: 1, label: "1 km" },
      { value: 2, label: "2 km" },
      { value: 5, label: "5 km" },
      { value: 10, label: "10 km" }
    ];
    function handleRadiusChange(e) {
      const value = parseFloat(e.target.value);
      radiusKm = value;
    }
    $$renderer2.push(`<header class="header"><a href="/" class="header-logo" aria-label="T-Map - Trang chủ">`);
    Icon($$renderer2, { name: "parking", size: 22 });
    $$renderer2.push(`<!----> <span>T-map</span></a> <div class="city-selector svelte-1elxaub"><button${attr_class("city-btn svelte-1elxaub", void 0, { "active": currentCity === "kosice" })} type="button">Košice `);
    if (cityCounts.kosice !== void 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="city-count svelte-1elxaub">${escape_html(cityCounts.kosice)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> <button${attr_class("city-btn svelte-1elxaub", void 0, { "active": currentCity === "vinh" })} type="button">Vinh `);
    if (cityCounts.vinh !== void 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="city-count svelte-1elxaub">${escape_html(cityCounts.vinh)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button></div> <div class="search-container svelte-1elxaub"><div${attr_class("search-box svelte-1elxaub", void 0, { "searching": isSearching })}><span class="search-icon svelte-1elxaub">`);
    Icon($$renderer2, { name: "search", size: 18 });
    $$renderer2.push(`<!----></span> <div class="input-wrapper svelte-1elxaub"><input type="text" class="search-input svelte-1elxaub" placeholder="Tìm kiếm địa điểm (VD: Aupark)..." aria-label="Tìm kiếm địa điểm"${attr("value", searchQuery)} role="combobox"${attr("aria-expanded", showSuggestions)} aria-autocomplete="list" aria-controls="search-suggestions" autocomplete="off"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    $$renderer2.select(
      {
        class: "radius-select",
        value: radiusKm,
        onchange: handleRadiusChange,
        "aria-label": "Bán kính tìm kiếm"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(radiusOptions);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let r = each_array[$$index];
          $$renderer3.option({ value: r.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(r.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-1elxaub"
    );
    $$renderer2.push(` <button class="search-btn svelte-1elxaub" aria-label="Tìm kiếm" type="button">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`);
    }
    $$renderer2.push(`<!--]--></button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="header-actions">`);
    if (onShowHelp) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="icon-btn" aria-label="Xem hướng dẫn" title="Hướng dẫn" type="button">`);
      Icon($$renderer2, { name: "help", size: 20 });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button${attr_class("icon-btn", void 0, { "active": isListOpen })}${attr("aria-label", isListOpen ? "Đóng danh sách" : "Mở danh sách bãi đỗ")}${attr("title", isListOpen ? "Đóng danh sách" : "Mở danh sách")} type="button">`);
    Icon($$renderer2, { name: "menu", size: 20 });
    $$renderer2.push(`<!----></button></div></header>`);
  });
}
function WelcomeModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { isOpen } = $$props;
    let currentStep = 0;
    const steps = [
      {
        icon: "sparkle",
        iconColor: "#6366f1",
        iconBg: "linear-gradient(135deg, #eef2ff 0%, #fce7f3 100%)",
        title: "Chào bạn! 👋",
        description: "T-Map giúp bạn tìm bãi đỗ xe gần nhất một cách nhanh chóng và dễ thương."
      },
      {
        icon: "city",
        iconColor: "#10b981",
        iconBg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
        title: "Chọn thành phố 🏙️",
        description: "Chuyển đổi giữa Košice (Slovakia) và Vinh (Việt Nam) chỉ với một cú chạm."
      },
      {
        icon: "pin",
        iconColor: "#ec4899",
        iconBg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
        title: "Chọn điểm đến 📍",
        description: 'Nhấn nút "Đi đâu?" rồi chạm vào bất kỳ đâu trên bản đồ để xem các bãi đỗ gần đó.'
      },
      {
        icon: "filter",
        iconColor: "#f59e0b",
        iconBg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        title: "Lọc thông minh ✨",
        description: "Tìm bãi miễn phí, trả phí hoặc cuối tuần miễn phí. Sắp xếp theo khoảng cách hoặc sức chứa."
      }
    ];
    const step = derived(() => steps[currentStep]);
    if (isOpen) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="modal-backdrop svelte-1tjvg83" role="presentation"><div class="modal-content svelte-1tjvg83" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><button class="close-btn svelte-1tjvg83" aria-label="Đóng hướng dẫn" type="button"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svelte-1tjvg83"><line x1="18" y1="6" x2="6" y2="18" class="svelte-1tjvg83"></line><line x1="6" y1="6" x2="18" y2="18" class="svelte-1tjvg83"></line></svg></button> <div class="modal-icon svelte-1tjvg83"${attr_style(`background: ${stringify(step().iconBg)}; color: ${stringify(step().iconColor)}`)}>`);
      if (step().icon === "sparkle") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1tjvg83"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z" class="svelte-1tjvg83"></path></svg>`);
      } else if (step().icon === "city") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1tjvg83"><path d="M3 21h18" class="svelte-1tjvg83"></path><path d="M5 21V7l8-4v18" class="svelte-1tjvg83"></path><path d="M19 21V11l-6-4" class="svelte-1tjvg83"></path><circle cx="9" cy="10" r="1" fill="currentColor" class="svelte-1tjvg83"></circle><circle cx="9" cy="14" r="1" fill="currentColor" class="svelte-1tjvg83"></circle><circle cx="16" cy="14" r="1" fill="currentColor" class="svelte-1tjvg83"></circle></svg>`);
      } else if (step().icon === "pin") {
        $$renderer2.push("<!--[2-->");
        $$renderer2.push(`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-1tjvg83"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" class="svelte-1tjvg83"></path><circle cx="12" cy="10" r="3" class="svelte-1tjvg83"></circle></svg>`);
      } else if (step().icon === "filter") {
        $$renderer2.push("<!--[3-->");
        $$renderer2.push(`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1tjvg83"><path d="M9 11l3 3L22 4" class="svelte-1tjvg83"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" class="svelte-1tjvg83"></path></svg>`);
      } else if (step().icon === "navigate") {
        $$renderer2.push("<!--[4-->");
        $$renderer2.push(`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1tjvg83"><polygon points="3 11 22 2 13 21 11 13 3 11" class="svelte-1tjvg83"></polygon></svg>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <h2 class="modal-title svelte-1tjvg83" id="welcome-title">${escape_html(step().title)}</h2> <p class="modal-description svelte-1tjvg83">${escape_html(step().description)}</p> <div class="step-indicators svelte-1tjvg83" role="tablist"><!--[-->`);
      const each_array = ensure_array_like(steps);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        each_array[i];
        $$renderer2.push(`<button${attr_class("step-dot svelte-1tjvg83", void 0, { "active": i === currentStep })}${attr("aria-label", `Bước ${stringify(i + 1)}`)}${attr("aria-selected", i === currentStep)} role="tab" type="button"></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="modal-actions svelte-1tjvg83"><button class="btn-text svelte-1tjvg83" type="button">Bỏ qua</button> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="btn-primary svelte-1tjvg83" type="button">${escape_html(currentStep < steps.length - 1 ? "Tiếp theo" : "Bắt đầu")} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-1tjvg83"><line x1="5" y1="12" x2="19" y2="12" class="svelte-1tjvg83"></line><polyline points="12 5 19 12 12 19" class="svelte-1tjvg83"></polyline></svg></button></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function CityLegend($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let expanded = false;
    $$renderer2.push(`<div${attr_class("legend svelte-1yvkcm6", void 0, { "expanded": expanded })} role="region" aria-label="Chú thích bãi đỗ"><button class="legend-toggle svelte-1yvkcm6"${attr("aria-expanded", expanded)}${attr("aria-label", "Mở rộng chú thích")} type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>Chú thích</span>`);
    }
    $$renderer2.push(`<!--]--></button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function LocationButton($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const state = derived(() => store_get($$store_subs ??= {}, "$locationStore", locationStore).state);
    $$renderer2.push(`<div class="location-fab-wrapper svelte-1tde8mt">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button${attr_class("location-fab svelte-1tde8mt", void 0, {
      "requesting": state() === "requesting",
      "granted": state() === "granted",
      "denied": state() === "denied"
    })}${attr("aria-label", state() === "requesting" ? "Đang tìm vị trí..." : state() === "granted" ? "Vị trí của tôi" : state() === "denied" ? "Vị trí bị chặn" : "Bật vị trí của tôi")}${attr("title", state() === "denied" ? "Vị trí bị chặn" : state() === "granted" ? "Vị trí của tôi" : "Bật vị trí của tôi")} type="button">`);
    if (state() === "requesting") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="spinner svelte-1tde8mt"></div> <div class="pulse-ring svelte-1tde8mt"></div>`);
    } else if (state() === "granted") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<span class="icon-active svelte-1tde8mt">`);
      Icon($$renderer2, { name: "location", size: 22 });
      $$renderer2.push(`<!----></span>`);
    } else if (state() === "denied") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<span class="icon-denied svelte-1tde8mt"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-1tde8mt"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" class="svelte-1tde8mt"></path><circle cx="12" cy="10" r="3" class="svelte-1tde8mt"></circle><line x1="3" y1="3" x2="21" y2="21" class="svelte-1tde8mt"></line></svg></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      Icon($$renderer2, { name: "location", size: 22 });
    }
    $$renderer2.push(`<!--]--></button></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function DestinationPicker($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button class="destination-fab svelte-dhrmjy" aria-label="Chọn điểm đến trên bản đồ" title="Chọn điểm đến" type="button"><span class="fab-icon svelte-dhrmjy">`);
      Icon($$renderer2, { name: "pin", size: 20 });
      $$renderer2.push(`<!----></span> <span class="fab-text svelte-dhrmjy">Đi đâu?</span></button>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const vinhParkings = [
  {
    id: "v001",
    name: "Vincom Plaza Vinh",
    lat: 18.6732,
    lng: 105.6738,
    capacity: 300,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 20,
    isWeekendFree: false
  },
  {
    id: "v002",
    name: "Quảng trường Hồ Chí Minh",
    lat: 18.6701,
    lng: 105.6814,
    capacity: 100,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 15,
    isWeekendFree: false
  },
  {
    id: "v003",
    name: "Bãi xe đường Cao Thắng",
    lat: 18.6698,
    lng: 105.6835,
    capacity: 100,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 10,
    isWeekendFree: false
  },
  {
    id: "v004",
    name: "Lotte Mart Vinh",
    lat: 18.6935,
    lng: 105.6915,
    capacity: 50,
    isFree: true,
    freeReason: "Free with purchase",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "v005",
    name: "Bến xe Vinh",
    lat: 18.6689,
    lng: 105.6856,
    capacity: 60,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 20,
    isWeekendFree: false
  },
  {
    id: "v006",
    name: "Bến xe Bắc Vinh",
    lat: 18.6789,
    lng: 105.7012,
    capacity: 150,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "v007",
    name: "Ga Vinh",
    lat: 18.6685,
    lng: 105.6878,
    capacity: 50,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 15,
    isWeekendFree: false
  },
  {
    id: "v008",
    name: "BV Hữu nghị Đa khoa Nghệ An",
    lat: 18.6956,
    lng: 105.7012,
    capacity: 60,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 5,
    isWeekendFree: false
  },
  {
    id: "v009",
    name: "Sân bay Vinh",
    lat: 18.7012,
    lng: 105.6712,
    capacity: 200,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 25,
    isWeekendFree: false
  },
  {
    id: "v010",
    name: "Vinh Centre",
    lat: 18.6712,
    lng: 105.6798,
    capacity: 100,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 15,
    isWeekendFree: false
  },
  {
    id: "v011",
    name: "Big C Vinh (GO!)",
    lat: 18.6698,
    lng: 105.6765,
    capacity: 80,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 15,
    isWeekendFree: false
  },
  {
    id: "v012",
    name: "Bãi đỗ đường Lê Mao",
    lat: 18.6789,
    lng: 105.6898,
    capacity: 60,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "v013",
    name: "Bãi đỗ Nguyễn Thị Minh Khai",
    lat: 18.6756,
    lng: 105.6912,
    capacity: 50,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "v014",
    name: "Bãi đỗ Lê Hồng Phong",
    lat: 18.6656,
    lng: 105.6823,
    capacity: 40,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "v015",
    name: "HC Vinh Mall",
    lat: 18.6834,
    lng: 105.6734,
    capacity: 120,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 15,
    isWeekendFree: false
  },
  {
    id: "v016",
    name: "Maximax Vinh",
    lat: 18.6712,
    lng: 105.6689,
    capacity: 100,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 12,
    isWeekendFree: false
  },
  {
    id: "v017",
    name: "Bãi xe Happy Park",
    lat: 18.6956,
    lng: 105.6723,
    capacity: 80,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 20,
    isWeekendFree: false
  },
  {
    id: "v018",
    name: "Chợ Vinh",
    lat: 18.6689,
    lng: 105.6845,
    capacity: 80,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 10,
    isWeekendFree: false
  },
  {
    id: "v019",
    name: "Đại học Vinh",
    lat: 18.6834,
    lng: 105.6923,
    capacity: 150,
    isFree: true,
    freeReason: "Free 2h",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "v020",
    name: "Trường ĐH Bách khoa Vinh",
    lat: 18.6867,
    lng: 105.6856,
    capacity: 100,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  }
];
const vinhCenter = {
  lat: 18.6795,
  lng: 105.6875
};
const kosiceParkings = [
  {
    id: "p001",
    name: "Aupark Shopping Center",
    lat: 48.7215,
    lng: 21.2581,
    capacity: 400,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 2,
    isWeekendFree: false
  },
  {
    id: "p002",
    name: "Staničné námestie",
    lat: 48.7198,
    lng: 21.2612,
    capacity: 150,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p003",
    name: "OC Galéria Košice",
    lat: 48.7234,
    lng: 21.2567,
    capacity: 300,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 1.5,
    isWeekendFree: false
  },
  {
    id: "p004",
    name: "OC Cassovar",
    lat: 48.7189,
    lng: 21.2523,
    capacity: 200,
    isFree: true,
    freeReason: "Free 2h",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p005",
    name: "Železničná stanica Košice",
    lat: 48.7201,
    lng: 21.2645,
    capacity: 100,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 2.5,
    isWeekendFree: false
  },
  {
    id: "p006",
    name: "Tesco Extra Košice",
    lat: 48.7256,
    lng: 21.2412,
    capacity: 250,
    isFree: true,
    freeReason: "Free with purchase",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p007",
    name: "Ťahanovce Centrum",
    lat: 48.7145,
    lng: 21.2689,
    capacity: 80,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p008",
    name: "OC Arena Košice",
    lat: 48.7089,
    lng: 21.2578,
    capacity: 180,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 1.8,
    isWeekendFree: false
  },
  {
    id: "p009",
    name: "Košice - Barca",
    lat: 48.7301,
    lng: 21.2534,
    capacity: 120,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p010",
    name: "Billa Košice",
    lat: 48.7156,
    lng: 21.2434,
    capacity: 60,
    isFree: true,
    freeReason: "Free 90min",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p011",
    name: "Metro Košice",
    lat: 48.7298,
    lng: 21.2412,
    capacity: 180,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 1.2,
    isWeekendFree: false
  },
  {
    id: "p012",
    name: "Lidl Moldava",
    lat: 48.7123,
    lng: 21.2798,
    capacity: 90,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p013",
    name: "Kaufland Košice",
    lat: 48.7356,
    lng: 21.2489,
    capacity: 220,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 1,
    isWeekendFree: false
  },
  {
    id: "p014",
    name: "dm Drogerie",
    lat: 48.7178,
    lng: 21.2534,
    capacity: 40,
    isFree: true,
    freeReason: "Free 30min",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p015",
    name: "Košice - Sever",
    lat: 48.7423,
    lng: 21.2456,
    capacity: 110,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p016",
    name: "Šaca Shopping",
    lat: 48.6989,
    lng: 21.2789,
    capacity: 150,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 1.5,
    isWeekendFree: false
  },
  {
    id: "p017",
    name: "Košice - Juh",
    lat: 48.7056,
    lng: 21.2356,
    capacity: 95,
    isFree: true,
    freeReason: "Free 2h",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p018",
    name: "Indepo Košice",
    lat: 48.7267,
    lng: 21.2678,
    capacity: 200,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 1.8,
    isWeekendFree: false
  },
  {
    id: "p019",
    name: "Fructop Košice",
    lat: 48.7134,
    lng: 21.2512,
    capacity: 50,
    isFree: true,
    freeReason: "Free 1h",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p020",
    name: "ZOO Košice",
    lat: 48.7389,
    lng: 21.2723,
    capacity: 75,
    isFree: true,
    freeReason: "Free on weekends",
    feePerHour: 0,
    isWeekendFree: true
  },
  {
    id: "p021",
    name: "Tech Garden",
    lat: 48.7223,
    lng: 21.2434,
    capacity: 120,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 2,
    isWeekendFree: false
  },
  {
    id: "p022",
    name: "UNLP Košice",
    lat: 48.7291,
    lng: 21.2567,
    capacity: 300,
    isFree: false,
    freeReason: "Staff only",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p023",
    name: "Košice - Džungľa",
    lat: 48.7156,
    lng: 21.2645,
    capacity: 60,
    isFree: true,
    freeReason: "Free all day",
    feePerHour: 0,
    isWeekendFree: false
  },
  {
    id: "p024",
    name: "Avion Shopping",
    lat: 48.6923,
    lng: 21.2489,
    capacity: 250,
    isFree: false,
    freeReason: "Paid parking",
    feePerHour: 1.5,
    isWeekendFree: false
  },
  {
    id: "p025",
    name: "Košice - KVP",
    lat: 48.7312,
    lng: 21.2389,
    capacity: 85,
    isFree: true,
    freeReason: "Free 3h",
    feePerHour: 0,
    isWeekendFree: false
  }
];
const kosiceCenter = {
  lat: 48.72,
  lng: 21.26
};
const cities = [
  {
    id: "vinh",
    name: "Vinh",
    nameVi: "Thành phố Vinh",
    center: vinhCenter,
    parkings: vinhParkings
  },
  {
    id: "kosice",
    name: "Košice",
    nameVi: "Košice",
    center: kosiceCenter,
    parkings: kosiceParkings
  }
];
function getParkingCounts() {
  return cities.reduce((acc, city) => {
    acc[city.id] = city.parkings.length;
    return acc;
  }, {});
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let parkings = [];
    let selectedParkingId = null;
    let selectedParking = derived(() => parkings.find((p) => p.id === selectedParkingId) || null);
    let userLocation = null;
    let showPanel = false;
    let isLoading = false;
    let parkingCount = 0;
    let currentBounds = { south: 48.7, west: 21.23, north: 48.75, east: 21.28 };
    let lastFetchKey = "";
    let fetchError = null;
    let retryCount = 0;
    let currentCityId = "kosice";
    let showWelcome = false;
    let destination = null;
    let pickerMode = false;
    const cityCounts = getParkingCounts();
    const OVERPASS_ENDPOINTS = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.openstreetmap.fr/api/interpreter"
    ];
    async function fetchOverpass(query) {
      for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3e4);
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(query)}`,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          if (response.ok) {
            const data = await response.json();
            return data.elements || [];
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            console.log("Request timeout, trying next endpoint...");
          }
        }
      }
      return [];
    }
    function checkWeekendFree(tags) {
      const conditional = tags["fee:conditional"] || tags["access:conditional"] || "";
      const weekendPatterns = [
        /free.*weekend/i,
        /weekend.*free/i,
        /sa\-su.*free/i,
        /fr\-su.*free/i,
        /@.*\(sa|@.*\(su/i,
        /ph.*weekend/i,
        /vacation/i
      ];
      return weekendPatterns.some((pattern) => pattern.test(conditional));
    }
    function getFilteredParkings() {
      return parkings;
    }
    async function handleMapClick(lat, lng) {
      return;
    }
    async function fetchParkings(bounds, immediate = false) {
      const minChange = 5e-3;
      if (!immediate && lastFetchKey) {
        const lastBounds = JSON.parse(lastFetchKey);
        const latChange = Math.abs(bounds.south - lastBounds.south) + Math.abs(bounds.north - lastBounds.north);
        const lngChange = Math.abs(bounds.west - lastBounds.west) + Math.abs(bounds.east - lastBounds.east);
        if (latChange < minChange && lngChange < minChange) {
          return;
        }
      }
      const boundsKey = JSON.stringify(bounds);
      if (!immediate && boundsKey === lastFetchKey) return;
      lastFetchKey = boundsKey;
      isLoading = !immediate;
      fetchError = null;
      try {
        const query = `[out:json][timeout:25];
(
  way["amenity"="parking"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
  node["amenity"="parking"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
);
out center;`;
        const elements = await fetchOverpass(query);
        parkings = elements.map((el, index) => {
          const lat = el.lat ?? el.center?.lat ?? 0;
          const lng = el.lon ?? el.center?.lon ?? 0;
          const tags = el.tags || {};
          const capacity = tags.capacity ? parseInt(tags.capacity) : void 0;
          const hasConditionalAccess = tags["access:conditional"] || tags["fee:conditional"];
          const isWeekendFree = checkWeekendFree(tags);
          const isPaid = tags.fee === "yes" && !isWeekendFree;
          const isFree = tags.fee !== "yes" || isWeekendFree;
          let freeReason = "Free";
          if (tags.fee === "yes" && isWeekendFree) {
            freeReason = "Free on weekends";
          } else if (tags.access === "customers") {
            freeReason = "Customers only";
          } else if (tags.fee === "yes") {
            freeReason = "Paid parking";
          }
          const feePerHour = isPaid ? tags["fee:hourly"] ? parseFloat(tags["fee:hourly"]) : 2 : void 0;
          const name = tags.name || tags["name:en"] || `Parking ${index + 1}`;
          return {
            id: `osm-${el.id}`,
            name,
            lat,
            lng,
            capacity,
            isFree,
            freeReason,
            feePerHour,
            isWeekendFree,
            hasConditionalAccess
          };
        }).filter((p) => p.lat !== 0 && p.lng !== 0);
        parkingCount = parkings.length;
        retryCount = 0;
      } catch {
        fetchError = "Không thể tải dữ liệu bãi đỗ";
        if (retryCount < 3) {
          retryCount++;
          setTimeout(() => fetchParkings(bounds, immediate), 1e3 * retryCount);
        }
      }
      isLoading = false;
    }
    let fetchTimeout = null;
    function handleMapMove(center, zoom) {
      const latRange = 0.02 / Math.pow(2, zoom - 14);
      const lngRange = 0.03 / Math.pow(2, zoom - 14);
      const newBounds = {
        south: center[0] - latRange,
        west: center[1] - lngRange,
        north: center[0] + latRange,
        east: center[1] + lngRange
      };
      currentBounds = newBounds;
      if (fetchTimeout) clearTimeout(fetchTimeout);
      fetchTimeout = setTimeout(
        () => {
          fetchParkings(currentBounds);
        },
        2e3
      );
    }
    function handleSelectParking(parking) {
      if (parking) {
        selectedParkingId = parking.id;
      } else {
        selectedParkingId = null;
      }
    }
    function handleUserLocationChange(location) {
      userLocation = location;
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="description" content="T-Map - Tìm kiếm và định vị bãi đỗ xe nhanh chóng"/> <meta name="theme-color" content="#2563eb"/>`);
    });
    $$renderer2.push(`<div class="app-container">`);
    Header($$renderer2, {
      onShowHelp: () => showWelcome = true,
      isListOpen: showPanel,
      currentCity: currentCityId,
      cityCounts
    });
    $$renderer2.push(`<!----> <div class="map-wrapper">`);
    Map_1($$renderer2, {
      parkings: getFilteredParkings(),
      selectedParking: selectedParking(),
      userLocation,
      destination,
      pickerMode,
      onSelectParking: handleSelectParking,
      onMapMove: handleMapMove,
      onUserLocationChange: handleUserLocationChange,
      onMapClick: handleMapClick
    });
    $$renderer2.push(`<!----> `);
    DestinationPicker($$renderer2);
    $$renderer2.push(`<!----> `);
    CityLegend($$renderer2);
    $$renderer2.push(`<!----> `);
    LocationButton($$renderer2);
    $$renderer2.push(`<!----> `);
    if (fetchError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="error-toast svelte-1uha8ag" role="alert"><span>${escape_html(fetchError)}</span> <button class="retry-btn svelte-1uha8ag">Thử lại</button> <button class="dismiss-btn svelte-1uha8ag" aria-label="Đóng"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    ParkingPanel($$renderer2, {
      parkings: getFilteredParkings(),
      selectedParking: selectedParking(),
      userLocation,
      isOpen: showPanel,
      isLoading
    });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    WelcomeModal($$renderer2, { isOpen: showWelcome });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
