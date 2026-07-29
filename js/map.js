/*
 * map.js — Leaflet interactive mini map for restaurant pages
 *
 * Mobile only. Features:
 *   - Leaflet map with CARTO light tiles (free, no API key)
 *   - Restaurant location markers (no clustering, active state visible)
 *   - User location (Geolocation API, fallback to Bangkok center)
 *   - Card ↔ Map synchronization via IntersectionObserver
 *   - Active card gets #775a19 border + distance display
 */

const MapModule = (() => {
  let map = null;
  let activeMarker = null;
  let userLatLng = null;
  let markerMap = {};
  let _items = [];

  const BANGKOK_CENTER = [13.7563, 100.5018];
  const USER_MARKER_COLOR = '#4285F4';

  const MARKER_DEFAULT = { radius: 5, color: '#775a19', fillOpacity: 0.7, weight: 1.5 };
  const MARKER_ACTIVE = { radius: 9, color: '#c93a2b', fillOpacity: 1, weight: 2.5 };

  /**
   * Initialize the map inside #map-placeholder (mobile only).
   */
  function init(items) {
    _items = items || [];
    if (window.innerWidth >= 768) return;

    const container = document.getElementById('map-placeholder');
    if (!container) return;

    // Clear placeholder
    container.innerHTML = '';
    container.style.background = 'none';
    container.style.borderRadius = '0';
    container.style.display = 'flex';
    container.style.alignItems = 'stretch';

    // Create Leaflet map
    map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
    }).setView(BANGKOK_CENTER, 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 150);

    getUserLocation(() => {
      addMarkers();
      setupScrollDetection();
    });
  }

  // ——— User Location ———

  function getUserLocation(callback) {
    if (!navigator.geolocation) {
      userLatLng = BANGKOK_CENTER;
      callback();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLatLng = [pos.coords.latitude, pos.coords.longitude];
        addUserMarker(userLatLng);
        callback();
      },
      () => {
        userLatLng = BANGKOK_CENTER;
        callback();
      },
      { enableHighAccuracy: false, timeout: 6000 }
    );
  }

  function addUserMarker(latlng) {
    if (!map) return;
    L.circleMarker(latlng, {
      radius: 7, color: USER_MARKER_COLOR, fillColor: USER_MARKER_COLOR,
      fillOpacity: 0.3, weight: 2,
    }).addTo(map).bindTooltip('我的位置', { permanent: false, direction: 'top' });

    L.circle(latlng, {
      radius: 300, color: USER_MARKER_COLOR, fillColor: USER_MARKER_COLOR,
      fillOpacity: 0.06, weight: 1, dashArray: '3 6',
    }).addTo(map);
  }

  // ——— Restaurant Markers (no clustering) ———

  function addMarkers() {
    if (!map) return;
    markerMap = {};

    _items.forEach(item => {
      const coords = item.location?.coordinates;
      if (!coords?.lat || !coords?.lng) return;

      const latlng = [coords.lat, coords.lng];
      const marker = L.circleMarker(latlng, { ...MARKER_DEFAULT, id: item.id });

      marker.itemId = item.id;
      markerMap[item.id] = marker;

      marker.bindTooltip(item.name?.en || item.id, {
        permanent: false, direction: 'top', offset: [0, -6],
      });

      // Click marker → highlight + scroll to card + show distance
      marker.on('click', () => {
        // Immediately highlight marker and card
        setActiveMarker(item.id);
        setActiveCard(item.id);
        updateActiveDistance(item.id);

        // Scroll card below the sticky-top area (don't let it hide behind map)
        const card = document.querySelector(`.card[data-id="${item.id}"]`);
        if (card) {
          const headerH = document.getElementById('fixed-header')?.offsetHeight || 92;
          const stickyEl = document.getElementById('sticky-top');
          const stickyH = stickyEl ? stickyEl.offsetHeight : 280;
          const offset = headerH + stickyH + 8; // 8px gap
          const cardTop = card.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: cardTop - offset, behavior: 'smooth' });
        }
      });

      marker.addTo(map);
    });

    // Fit bounds
    const allMarkers = Object.values(markerMap);
    if (allMarkers.length > 0) {
      const group = L.featureGroup(allMarkers);
      setTimeout(() => map.fitBounds(group.getBounds().pad(0.15)), 200);
    }
  }

  // ——— Active Marker Highlight ———

  function setActiveMarker(itemId) {
    if (activeMarker) {
      activeMarker.setStyle(MARKER_DEFAULT);
    }
    const marker = markerMap[itemId];
    if (marker) {
      marker.setStyle(MARKER_ACTIVE);
      marker.bringToFront();
      activeMarker = marker;
    }
  }

  // ——— Active Card Border Toggle ———

  let _prevActiveCard = null;

  function setActiveCard(itemId) {
    // Remove border from previous card
    if (_prevActiveCard) {
      _prevActiveCard.classList.remove('card--active');
    }

    // Add border to new card
    const card = document.querySelector(`.card[data-id="${itemId}"]`);
    if (card) {
      card.classList.add('card--active');
      _prevActiveCard = card;
    }
  }

  // ——— Card ↔ Map Synchronization ———

  function setupScrollDetection() {
    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    let distanceCardId = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const itemId = entry.target.dataset.id;
        if (!itemId) return;

        if (entry.isIntersecting) {
          // Card visible → highlight marker, show distance, add border
          setActiveMarker(itemId);
          setActiveCard(itemId);
          updateActiveDistance(itemId);

          if (distanceCardId && distanceCardId !== itemId) {
            restoreDistrictText(distanceCardId);
          }
          distanceCardId = itemId;
        }
      });
    }, {
      rootMargin: '-100px 0px -40% 0px',
      threshold: 0.2,
    });

    cards.forEach(card => observer.observe(card));
  }

  // ——— Distance Display ———

  function updateActiveDistance(itemId) {
    if (!userLatLng) return;

    const card = document.querySelector(`.card[data-id="${itemId}"]`);
    if (!card) return;

    const districtEl = card.querySelector('.card__district-text');
    if (!districtEl) return;

    if (!districtEl.dataset.originalText) {
      districtEl.dataset.originalText = districtEl.textContent;
    }

    const item = _items.find(i => i.id === itemId);
    if (!item) return;

    const coords = item.location?.coordinates;
    if (!coords?.lat || !coords?.lng) return;

    const distKm = _haversine(userLatLng[0], userLatLng[1], coords.lat, coords.lng);
    districtEl.textContent = distKm < 1
      ? `距你 ${Math.round(distKm * 1000)}m`
      : `距你 ${distKm.toFixed(1)}km`;
  }

  function restoreDistrictText(itemId) {
    const card = document.querySelector(`.card[data-id="${itemId}"]`);
    if (!card) return;
    const el = card.querySelector('.card__district-text');
    if (el && el.dataset.originalText) {
      el.textContent = el.dataset.originalText;
    }
  }

  // ——— Haversine ———

  function _haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return { init };
})();
