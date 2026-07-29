/*
 * map.js — Leaflet interactive mini map for restaurant pages
 *
 * Mobile only. Features:
 *   - Leaflet map with CARTO light tiles (free, no API key)
 *   - Restaurant location markers with clustering
 *   - User location (Geolocation API, fallback to Bangkok center)
 *   - Card ↔ Map synchronization via IntersectionObserver
 *   - Active card distance display
 */

const MapModule = (() => {
  let map = null;
  let markersLayer = null;
  let activeMarker = null;
  let userLatLng = null;
  let markerMap = {};
  let _items = [];

  const BANGKOK_CENTER = [13.7563, 100.5018];
  const USER_MARKER_COLOR = '#4285F4';

  /**
   * Initialize the map inside #map-placeholder (mobile only).
   * Called from app.js after category data loads.
   */
  function init(items) {
    _items = items || [];
    // Mobile only
    if (window.innerWidth >= 768) return;

    const container = document.getElementById('map-placeholder');
    if (!container) return;

    // Clear placeholder content & reset styling for Leaflet
    container.innerHTML = '';
    container.style.background = 'none';
    container.style.display = 'block';
    container.style.borderRadius = '0';
    container.style.display = 'flex';   // keep any needed layout
    container.style.alignItems = 'stretch';

    // Create Leaflet map (minimal controls)
    map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
    }).setView(BANGKOK_CENTER, 12);

    // CARTO light tile layer — free, no API key
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>, &copy; CARTO'
    }).addTo(map);

    // Force map to recalculate size (container may be in sticky area)
    setTimeout(() => map.invalidateSize(), 150);

    // Get user location, then add markers
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
      radius: 7,
      color: USER_MARKER_COLOR,
      fillColor: USER_MARKER_COLOR,
      fillOpacity: 0.3,
      weight: 2,
    }).addTo(map).bindTooltip('我的位置', { permanent: false, direction: 'top' });

    // Draw a small radius indicator (300m)
    L.circle(latlng, {
      radius: 300,
      color: USER_MARKER_COLOR,
      fillColor: USER_MARKER_COLOR,
      fillOpacity: 0.06,
      weight: 1,
      dashArray: '3 6',
    }).addTo(map);
  }

  // ——— Restaurant Markers ———

  function addMarkers() {
    if (!map) return;
    markerMap = {};

    const markers = [];

    _items.forEach(item => {
      const coords = item.location?.coordinates;
      if (!coords?.lat || !coords?.lng) return;

      const latlng = [coords.lat, coords.lng];

      // Custom circle marker
      const marker = L.circleMarker(latlng, {
        radius: 5,
        color: '#775a19',
        fillColor: '#775a19',
        fillOpacity: 0.7,
        weight: 1.5,
        id: item.id,
      });

      marker.itemId = item.id;
      markerMap[item.id] = marker;

      // Tooltip
      marker.bindTooltip(item.name?.en || item.id, {
        permanent: false,
        direction: 'top',
        offset: [0, -6],
      });

      // Click marker → scroll to card
      marker.on('click', () => {
        const card = document.querySelector(`.card[data-id="${item.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      markers.push(marker);
    });

    // Add markers with clustering (avoids overlap when zoomed out)
    if (markers.length > 0 && window.L && L.markerClusterGroup) {
      markersLayer = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="
              background:#775a19;color:#fff;border-radius:50%;
              width:32px;height:32px;display:flex;align-items:center;
              justify-content:center;font-size:11px;font-weight:600;
              box-shadow:0 1px 4px rgba(0,0,0,0.2);
            ">${count}</div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
        }
      });
      markers.forEach(m => markersLayer.addLayer(m));
      map.addLayer(markersLayer);
    } else {
      markers.forEach(m => m.addTo(map));
    }

    // Fit bounds to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      setTimeout(() => {
        map.fitBounds(group.getBounds().pad(0.15));
      }, 200);
    }
  }

  // ——— Active Marker Highlight ———

  function setActiveMarker(itemId) {
    // Reset previous marker
    if (activeMarker) {
      activeMarker.setStyle({
        radius: 5,
        color: '#775a19',
        fillOpacity: 0.7,
        weight: 1.5,
      });
    }

    // Highlight new marker
    const marker = markerMap[itemId];
    if (marker) {
      marker.setStyle({
        radius: 9,
        color: '#c93a2b',
        fillOpacity: 1,
        weight: 2.5,
      });
      // Bring to front
      if (markersLayer) {
        markersLayer.removeLayer(marker);
        markersLayer.addLayer(marker);
      } else {
        marker.bringToFront();
      }
      activeMarker = marker;
    }
  }

  // ——— Card ↔ Map Synchronization ———

  function setupScrollDetection() {
    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    // Keep track of which card is currently being "distance-displayed"
    let distanceCardId = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const itemId = entry.target.dataset.id;
        if (!itemId) return;

        if (entry.isIntersecting) {
          // Card entered viewport → highlight marker, show distance
          setActiveMarker(itemId);
          updateActiveDistance(itemId);

          // Restore previous card's district text
          if (distanceCardId && distanceCardId !== itemId) {
            restoreDistrictText(distanceCardId);
          }
          distanceCardId = itemId;
        }
      });
    }, {
      // Account for fixed header (92px) plus some overshoot
      rootMargin: '-100px 0px -40% 0px',
      threshold: 0.2,
    });

    cards.forEach(card => observer.observe(card));
  }

  // ——— Distance Display on Active Card ———

  function updateActiveDistance(itemId) {
    if (!userLatLng) return;

    const card = document.querySelector(`.card[data-id="${itemId}"]`);
    if (!card) return;

    const districtEl = card.querySelector('.card__district-text');
    if (!districtEl) return;

    // Save original text once
    if (!districtEl.dataset.originalText) {
      districtEl.dataset.originalText = districtEl.textContent;
    }

    const item = _items.find(i => i.id === itemId);
    if (!item) return;

    const coords = item.location?.coordinates;
    if (!coords?.lat || !coords?.lng) return;

    const distKm = _haversine(
      userLatLng[0], userLatLng[1],
      coords.lat, coords.lng
    );

    districtEl.textContent = distKm < 1
      ? `距你 ${Math.round(distKm * 1000)}m`
      : `距你 ${distKm.toFixed(1)}km`;
  }

  function restoreDistrictText(itemId) {
    const card = document.querySelector(`.card[data-id="${itemId}"]`);
    if (!card) return;
    const districtEl = card.querySelector('.card__district-text');
    if (districtEl && districtEl.dataset.originalText) {
      districtEl.textContent = districtEl.dataset.originalText;
    }
  }

  // ——— Haversine distance (km) ———

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
