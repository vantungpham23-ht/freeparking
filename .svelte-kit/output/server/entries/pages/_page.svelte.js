import { a5 as ssr_context, a6 as bind_props, a7 as attr_class, a8 as attr, e as escape_html, a9 as ensure_array_like, aa as stringify, a3 as derived, a4 as head } from "../../chunks/index.js";
import "clsx";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function Map_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      parkings,
      selectedParking,
      userLocation,
      onSelectParking,
      onMapMove,
      onUserLocationChange
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
    $$renderer2.push(`<div class="map-container svelte-13da2aa"></div>`);
    bind_props($$props, { flyTo, centerOnUser, refreshMarkers });
  });
}
const icons = {
  parking: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <path d="M9 17V7h4a3 3 0 0 1 0 6h-2a2 2 0 0 0 0 4h2"/>
  </svg>`,
  location: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
  </svg>`,
  navigate: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>`,
  search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>`,
  menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>`,
  filter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>`,
  car: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
    <circle cx="6.5" cy="16.5" r="2.5"/>
    <circle cx="16.5" cy="16.5" r="2.5"/>
  </svg>`
};
const ParkingIcon = icons.parking;
const LocationIcon = icons.location;
const NavigateIcon = icons.navigate;
const SearchIcon = icons.search;
const MenuIcon = icons.menu;
const FilterIcon = icons.filter;
const CarIcon = icons.car;
const SortIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 6h18M6 12h12M9 18h6"/>
</svg>`;
function ParkingPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      parkings,
      selectedParking,
      userLocation,
      isOpen
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
    $$renderer2.push(`<div${attr_class("parking-panel", void 0, { "open": isOpen })} role="dialog" aria-label="Danh sách bãi đỗ xe"${attr("aria-hidden", !isOpen)}><div class="panel-handle" role="button" tabindex="0" aria-label="Đóng panel"></div> <div class="panel-header"><div class="panel-title">${html(ParkingIcon)} <span>Bãi đỗ xe</span> <span class="panel-count">${escape_html(filteredParkings().length)}</span></div> <div class="panel-actions svelte-122re7a"><div class="dropdown-container svelte-122re7a"><button${attr_class("panel-action-btn svelte-122re7a", void 0, { "active": filterBy !== "all" })} aria-label="Lọc bãi đỗ"${attr("aria-expanded", showFilterMenu)}>${html(FilterIcon)}</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="dropdown-container svelte-122re7a"><button class="panel-action-btn svelte-122re7a" aria-label="Sắp xếp"${attr("aria-expanded", showSortMenu)}>${html(SortIcon)}</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="panel-content" role="listbox" aria-label="Danh sách bãi đỗ">`);
    if (parkings.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="empty-state"><div class="empty-icon">${html(CarIcon)}</div> <p class="empty-title">Không có bãi đỗ</p> <p class="empty-text">Di chuyển bản đồ để tìm bãi đỗ xe</p></div>`);
    } else if (filteredParkings().length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="empty-state"><div class="empty-icon">${html(FilterIcon)}</div> <p class="empty-title">Không tìm thấy</p> <p class="empty-text">Thử thay đổi bộ lọc</p> <button class="reset-filter-btn svelte-122re7a">Xóa bộ lọc</button></div>`);
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
          $$renderer2.push(`<div class="parking-distance" title="Khoảng cách">${escape_html(formatDistance(distance))}</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <button class="parking-nav-btn" title="Chỉ đường"${attr("aria-label", `Chỉ đường đến ${stringify(parking.name)}`)}>${html(NavigateIcon)}</button></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      isListOpen = false,
      currentCity = "kosice"
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
    $$renderer2.push(`<header class="header"><a href="/" class="header-logo" aria-label="T-Map - Trang chủ">${html(ParkingIcon)} <span>T-map</span></a> <div class="city-selector svelte-1elxaub"><button${attr_class("city-btn svelte-1elxaub", void 0, { "active": currentCity === "kosice" })} type="button">Košice</button> <button${attr_class("city-btn svelte-1elxaub", void 0, { "active": currentCity === "vinh" })} type="button">Vinh</button></div> <div class="search-container svelte-1elxaub"><div${attr_class("search-box svelte-1elxaub", void 0, { "searching": isSearching })}><span class="search-icon svelte-1elxaub">${html(SearchIcon)}</span> <div class="input-wrapper svelte-1elxaub"><input type="text" class="search-input svelte-1elxaub" placeholder="Tìm kiếm địa điểm (VD: Aupark)..." aria-label="Tìm kiếm địa điểm"${attr("value", searchQuery)} role="combobox"${attr("aria-expanded", showSuggestions)} aria-autocomplete="list" aria-controls="search-suggestions" autocomplete="off"/> `);
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
    $$renderer2.push(`<!--]--></div> <div class="header-actions"><button${attr_class("icon-btn", void 0, { "active": isListOpen })}${attr("aria-label", isListOpen ? "Đóng danh sách" : "Mở danh sách bãi đỗ")}${attr("title", isListOpen ? "Đóng danh sách" : "Mở danh sách")}>${html(MenuIcon)}</button> <button class="icon-btn" aria-label="Vị trí của tôi" title="Vị trí của tôi">${html(LocationIcon)}</button></div></header>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let parkings = [];
    let selectedParkingId = null;
    let selectedParking = derived(() => parkings.find((p) => p.id === selectedParkingId) || null);
    let userLocation = null;
    let showPanel = false;
    let isLoading = true;
    let isInitialLoad = true;
    let parkingCount = 0;
    let currentBounds = { south: 48.7, west: 21.23, north: 48.75, east: 21.28 };
    let lastFetchKey = "";
    let fetchError = null;
    let retryCount = 0;
    let currentCityId = "kosice";
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
      isInitialLoad = false;
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
    if (isInitialLoad && isLoading) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="loading-overlay" role="status" aria-label="Đang tải"><div class="loading-icon">${html(ParkingIcon)}</div> <p class="loading-text">Đang tải bãi đỗ xe...</p> <p class="loading-subtext svelte-1uha8ag">Kết nối với OpenStreetMap</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    Header($$renderer2, {
      isListOpen: showPanel,
      currentCity: currentCityId
    });
    $$renderer2.push(`<!----> <div class="map-wrapper">`);
    Map_1($$renderer2, {
      parkings: getFilteredParkings(),
      selectedParking: selectedParking(),
      userLocation,
      onSelectParking: handleSelectParking,
      onMapMove: handleMapMove,
      onUserLocationChange: handleUserLocationChange
    });
    $$renderer2.push(`<!----> `);
    if (fetchError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="error-toast svelte-1uha8ag" role="alert"><span>${escape_html(fetchError)}</span> <button class="retry-btn svelte-1uha8ag">Thử lại</button> <button class="dismiss-btn svelte-1uha8ag" aria-label="Đóng"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (isLoading && !isInitialLoad) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mini-loading svelte-1uha8ag"><div class="mini-spinner svelte-1uha8ag"></div> <span>Cập nhật...</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    ParkingPanel($$renderer2, {
      parkings: getFilteredParkings(),
      selectedParking: selectedParking(),
      userLocation,
      isOpen: showPanel
    });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="fab" aria-label="Vị trí của tôi" title="Vị trí của tôi">${html(LocationIcon)}</button></div>`);
  });
}
export {
  _page as default
};
