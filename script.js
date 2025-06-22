// Leaflet Map Initialization
const map = L.map("map").setView([22.5, 78.9], 5);

// OpenStreetMap Tiles
const osmTiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Layer Groups
const layers = {
  ndvi: L.layerGroup(),
  fires: L.layerGroup(),
  rainfall: L.layerGroup(),
  urban: L.layerGroup(),
};

// --- NDVI Sample Layer (Vegetation) ---
const ndviCircle = L.circle([23.5, 77.0], {
  color: "green",
  fillColor: "#3f3",
  fillOpacity: 0.4,
  radius: 50000,
}).bindPopup("Sample High NDVI (Vegetation) Zone");
layers.ndvi.addLayer(ndviCircle);

// --- Fires Sample Layer ---
const fireIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/482/482586.png",
  iconSize: [25, 25],
});
const fireMarkers = [
  L.marker([21.15, 79.09], { icon: fireIcon }).bindPopup("Forest fire near Nagpur"),
  L.marker([21.75, 86.90], { icon: fireIcon }).bindPopup("Forest fire near Simlipal, Odisha"),
];
fireMarkers.forEach((marker) => layers.fires.addLayer(marker));

// --- Rainfall Sample Layer (circle markers for rain spots) ---
const rainfallSpots = [
  { lat: 19.07, lon: 72.87, rain: 30 },
  { lat: 13.08, lon: 80.27, rain: 20 },
  { lat: 28.70, lon: 77.10, rain: 5 },
];
rainfallSpots.forEach((spot) => {
  const color = spot.rain > 25 ? "#0055ff" : spot.rain > 10 ? "#00aaff" : "#88d8ff";
  const circle = L.circleMarker([spot.lat, spot.lon], {
    radius: spot.rain,
    fillColor: color,
    color: "#0055ff",
    weight: 1,
    fillOpacity: 0.7,
  }).bindPopup(`Rainfall: ${spot.rain} mm`);
  layers.rainfall.addLayer(circle);
});

// --- Urban Growth Sample Layer (polygons) ---
// Approximate polygon around Mumbai area
const urbanPolygon = L.polygon(
  [
    [19.30, 72.75],
    [19.30, 73.00],
    [19.10, 73.00],
    [19.10, 72.75],
  ],
  { color: "orange", fillOpacity: 0.3 }
).bindPopup("Urban Growth Area: Mumbai Region");
layers.urban.addLayer(urbanPolygon);

// Show default layer (NDVI)
layers.ndvi.addTo(map);

// Manage layer visibility
function showLayer(layerName) {
  // Clear all layers
  Object.values(layers).forEach((layer) => map.removeLayer(layer));
  // Add selected layer
  layers[layerName].addTo(map);

  // Update info box
  const fireList = document.getElementById("fire-list");
  if (layerName === "fires") {
    fireList.innerHTML =
      "<ul><li>🔥 Forest fire near Nagpur, Maharashtra</li><li>🔥 Forest fire near Simlipal, Odisha</li></ul>";
  } else {
    fireList.innerHTML = "";
  }
}

// Navigation between sections
function showSection(sectionId) {
  const sections = document.querySelectorAll("main section");
  sections.forEach((sec) => {
    if (sec.id === sectionId) {
      sec.classList.add("active-section");
      sec.classList.remove("hidden-section");
    } else {
      sec.classList.remove("active-section");
      sec.classList.add("hidden-section");
    }
  });
}

// Initialize Chart.js Rainfall Chart
const ctx = document.getElementById("rainfallChart").getContext("2d");
const rainfallChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Rainfall (mm)",
        data: [12, 15, 20, 50, 150, 300, 400, 350, 200, 100, 40, 20],
        backgroundColor: "#0078d7",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
