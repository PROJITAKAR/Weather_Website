 // Your OpenWeatherMap API key
const apiKey = "aee91d0c63e3ba5db7424bd06b103e12";
let currentWeatherLayer = null;
let searchMarker = null;

// Initialize the map
const map = L.map("map").setView([20.5937, 78.9629], 5); // Centered on India

// Base map layers from different providers
const baseMaps = {
    "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
    }),
    
    "Esri World Imagery": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }),
    
    "Stamen Terrain": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>', 
    }),
    
    "Stamen Toner": L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>', 
    }),
    
    "CartoDB Dark": L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
    })
};

// Add default base map
baseMaps["Esri World Imagery"].addTo(map);

// Weather overlay options from OpenWeatherMap
const weatherLayers = {
    temp_new: {
    name: "Temperature",
    legend: [
        { color: "#522e60", label: "< -40°C" },
        { color: "#523c8d", label: "-40°C to -30°C" },
        { color: "#4b49a6", label: "-30°C to -20°C" },
        { color: "#3655ba", label: "-20°C to -10°C" },
        { color: "#1a6ed4", label: "-10°C to 0°C" },
        { color: "#0e92e1", label: "0°C to 10°C" },
        { color: "#57b2ea", label: "10°C to 20°C" },
        { color: "#8fd2f4", label: "20°C to 25°C" },
        { color: "#b5f0fc", label: "25°C to 30°C" },
        { color: "#d2fadb", label: "30°C to 35°C" },
        { color: "#f5f3ac", label: "35°C to 40°C" },
        { color: "#fad78e", label: "40°C to 45°C" },
        { color: "#f5a869", label: "45°C to 50°C" },
        { color: "#e77c5c", label: "> 50°C" }
    ]
    },
    precipitation_new: {
    name: "Precipitation",
    legend: [
        { color: "#FFFFFF00", label: "0 mm" },
        { color: "#a1d2f7", label: "0.1 mm" },
        { color: "#74b5ec", label: "0.5 mm" },
        { color: "#3e99e2", label: "1 mm" },
        { color: "#2073b5", label: "5 mm" },
        { color: "#234c9c", label: "10 mm" },
        { color: "#393c84", label: "20 mm" },
        { color: "#fe0102", label: "100 mm" },
        { color: "#d70119", label: "200 mm" },
        { color: "#800000", label: "300+ mm" }
    ]
    },
    clouds_new: {
    name: "Cloud Cover",
    legend: [
        { color: "#FFFFFF00", label: "0%" },
        { color: "#e9e9e9", label: "10-20%" },
        { color: "#d4d4d4", label: "20-40%" },
        { color: "#b9b9b9", label: "40-60%" },
        { color: "#969696", label: "60-80%" },
        { color: "#7a7a7a", label: "80-90%" },
        { color: "#5a5a5a", label: "90-100%" }
    ]
    },
    pressure_new: {
    name: "Pressure",
    legend: [
        { color: "#8038FF", label: "< 950 hPa" },
        { color: "#4E46CC", label: "950-980 hPa" },
        { color: "#3C5994", label: "980-1000 hPa" },
        { color: "#356E36", label: "1000-1020 hPa" },
        { color: "#5F8C33", label: "1020-1040 hPa" },
        { color: "#8FB031", label: "1040-1060 hPa" },
        { color: "#BFD330", label: "1060-1080 hPa" },
        { color: "#FFFA28", label: "> 1080 hPa" }
    ]
    },
    wind_new: {
    name: "Wind Speed",
    legend: [
        { color: "#FFFFFF00", label: "0 m/s" },
        { color: "#c1e9fd", label: "1-3 m/s" },
        { color: "#3cc1fd", label: "3-6 m/s" },
        { color: "#2a8afe", label: "6-9 m/s" },
        { color: "#1b60fe", label: "9-12 m/s" },
        { color: "#3929fe", label: "12-15 m/s" },
        { color: "#7028fe", label: "15-18 m/s" },
        { color: "#a626fe", label: "18-21 m/s" },
        { color: "#fe26c5", label: "21-24 m/s" },
        { color: "#fe2689", label: "24-27 m/s" },
        { color: "#fe2646", label: "27-30 m/s" },
        { color: "#fe6346", label: "30-33 m/s" },
        { color: "#fea346", label: "33-36 m/s" },
        { color: "#fee046", label: "36-39 m/s" },
        { color: "#ffff46", label: ">39 m/s" }
    ]
    }
};

// Function to update the legend based on the selected layer
function updateLegend(layerKey) {
    const legendContent = document.getElementById('legend-content');
    legendContent.innerHTML = ''; // Clear previous legend
    
    if (weatherLayers[layerKey] && weatherLayers[layerKey].legend) {
    weatherLayers[layerKey].legend.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = item.color;
        
        const label = document.createElement('span');
        label.textContent = item.label;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContent.appendChild(legendItem);
    });
    }
}

// Function to add weather layer
function updateLegend(layerKey) {
    const legendContent = document.getElementById('legend-content');
    legendContent.innerHTML = ''; // Clear previous legend
    
    if (weatherLayers[layerKey] && weatherLayers[layerKey].legend) {
        // Add the legend title
        const legendTitle = document.createElement('div');
        legendTitle.className = 'legend-title';
        legendTitle.textContent = weatherLayers[layerKey].name;
        legendContent.appendChild(legendTitle);
        
        // Add legend items
        weatherLayers[layerKey].legend.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = item.color;
            
            const label = document.createElement('span');
            label.textContent = item.label;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            legendContent.appendChild(legendItem);
        });
    }
}

// Function to add weather layer
function addWeatherLayer(layerKey) {
    // Remove previous weather layer if exists
    if (currentWeatherLayer) {
        map.removeLayer(currentWeatherLayer);
    }
    
    // Add new weather layer with increased opacity (0.9 instead of 0.7)
    currentWeatherLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/${layerKey}/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
            opacity: 0.9,
            zIndex: 10 // Ensure weather layer is on top
        }
    ).addTo(map);
    
    // Update the legend
    updateLegend(layerKey);
    
    // Update active layer indicator in UI
    updateActiveLayerIndicator(layerKey);
}

// Function to visually indicate which weather layer is active
function updateActiveLayerIndicator(layerKey) {
    // Remove active class from all options
    document.querySelectorAll('.weather-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to selected option
    const activeOption = document.querySelector(`.weather-option[data-layer="${layerKey}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
    }
}

// Function to search for a location
function searchLocation() {
    const searchInput = document.getElementById('location-search').value;
    if (!searchInput) return;
    
    // Use Nominatim for geocoding (OpenStreetMap's service)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const location = data[0];
                const lat = parseFloat(location.lat);
                const lon = parseFloat(location.lon);
                
                // Center the map on the found location
                map.setView([lat, lon], 10);
                
                // Add a marker
                if (searchMarker) {
                    map.removeLayer(searchMarker);
                }
                searchMarker = L.marker([lat, lon]).addTo(map)
                    .bindPopup(`<b>${location.display_name}</b>`)
                    .openPopup();
            } else {
                alert("Location not found. Please try a different search term.");
            }
        })
        .catch(error => {
            console.error("Error searching for location:", error);
            alert("Error searching for location. Please try again.");
        });
}

// Add search on Enter key press
document.getElementById('location-search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchLocation();
    }
});

// Add default weather layer (temperature)
addWeatherLayer('temp_new');

// Event listeners for weather layer radio buttons
document.querySelectorAll('input[name="weather"]').forEach(input => {
    input.addEventListener('change', function() {
        if (this.checked) {
            addWeatherLayer(this.value);
        }
    });
});

// Event listeners for basemap selection
let currentBaseLayer = baseMaps["OpenStreetMap"];
document.querySelectorAll('input[name="basemap"]').forEach(input => {
    input.addEventListener('change', function() {
        if (this.checked) {
            map.removeLayer(currentBaseLayer);
            currentBaseLayer = baseMaps[this.value];
            map.addLayer(currentBaseLayer);
            
            // Re-add weather layer to ensure it's on top
            if (currentWeatherLayer) {
                map.removeLayer(currentWeatherLayer);
                addWeatherLayer(document.querySelector('input[name="weather"]:checked').value);
            }
        }
    });
});

// Add zoom control
L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

// Add a scale control
L.control.scale({
    position: 'bottomleft',
    imperial: false
}).addTo(map);

// Fix for map not loading properly initially
setTimeout(function() {
    map.invalidateSize();
}, 100);

// Ensure map resizes properly
window.addEventListener('resize', function() {
    map.invalidateSize();
});