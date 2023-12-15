
// Import data from local sqlite server (Run the python file first)

// layer lists
let stationMarkers = []
// let heatMap = []
// let cityArea = []
// let crimeMarkers = []


// Define variables for our tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let stationLayer = L.layerGroup(stationMarkers)
let heatLayer = new L.layerGroup()
let areaLayer = new L.layerGroup()

// Only one base layer can be shown at a time.
let baseMaps = {
    Street: street,
    Topography: topo
  };



let overlayMaps = {
    LAPD: stationLayer,
    Crime: heatLayer,
    Districts: areaLayer
    // Details: crimeLayer
};

// Create the map object
var map = L.map('map', {
    
    center:[34.0319344,-118.2644802],
    zoom:10,
    layers:[street, stationLayer, heatLayer, areaLayer]
}
)

L.control.layers(baseMaps, overlayMaps).addTo(map);


// setting data to links from local API

// API Route for crime data
var dataUrl = 'http://127.0.0.1:5000/crimedata'

//  GEOJSON for Police Station Locations
var geoUrl = 'http://127.0.0.1:5000/stations'

//  GEOJSON for drawing city areas
var areaUrl = 'http://127.0.0.1:5000/cityareas'



function data(url) {
// pull crime data
let promise1 = d3.json(url).then(data => {

// iterate over crime data
    console.log(data)
    let heatArray = []
    for (i = 0; i < data.length; i++) {
    let lat = data[i].LAT
    let lon = data[i].LON
    let location = [lat,lon]
        if (location) {
        heatArray.push(location);
        }
    }

    L.heatLayer(heatArray, {
        radius: 20,
        blur: 35
    }).addTo(heatLayer)
})
}

// pull stations data
let promise2 = d3.json(geoUrl).then(data => {

// itterate over stations data
for (let i = 0; i < data.features.length; i++) {

    // Note that the geojson data reversed the lat and long coordinates.
    let coordinates = data.features[i].geometry.coordinates
    let longitude = coordinates[0]
    let latitude = coordinates[1]

    let station = data.features[i].properties;

    stationMarkers.push(L.marker([latitude,longitude])
    .bindPopup(`<h6>${station.DIVISION}</h6> <hr> <h6>Location: ${station.LOCATION.toLocaleString()}</h6>`).addTo(stationLayer))
}})

// pull district areas data
let promise3 = d3.json(areaUrl).then(data => {

    // iterate over district areas data
    for (let i = 0; i < data.features.length; i++) {

        if (data.features[i].geometry.coordinates.length === 2) {

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]
            let polyCoordinates2 = data.features[i].geometry.coordinates[1]
            // console.log(polyCoordinates1)

            // Switched coordinates with latitude first
            var fixedCoords1 = polyCoordinates1.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords2 = polyCoordinates2.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // console.log(fixedCoords)

            L.polygon([[fixedCoords1,fixedCoords2]], {
                // color: "yellow",
                // fill: false,
                // fillOpacity: 0.75
            }).addTo(areaLayer)
        }
        
        else if (data.features[i].geometry.coordinates.length === 1) {

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]

                // Switched coordinates with latitude first
                var fixedCoords1 = polyCoordinates1.map(function(coord) {
                    return [coord[1], coord[0]];
                });

                L.polygon([fixedCoords1], {}).addTo(areaLayer)
                }

        else if (data.features[i].geometry.coordinates.length === 3) {

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]
            let polyCoordinates2 = data.features[i].geometry.coordinates[1]
            let polyCoordinates3 = data.features[i].geometry.coordinates[2]

            // Switched coordinates with latitude first
            var fixedCoords1 = polyCoordinates1.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords2 = polyCoordinates2.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords3 = polyCoordinates3.map(function(coord) {
                return [coord[1], coord[0]];
            });

            L.polygon([[fixedCoords1,fixedCoords2,fixedCoords3]], {}).addTo(areaLayer)
        }

        else if (data.features[i].geometry.coordinates.length === 4) {

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]
            let polyCoordinates2 = data.features[i].geometry.coordinates[1]
            let polyCoordinates3 = data.features[i].geometry.coordinates[2]
            let polyCoordinates4 = data.features[i].geometry.coordinates[3]

            // Switched coordinates with latitude first
            var fixedCoords1 = polyCoordinates1.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords2 = polyCoordinates2.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords3 = polyCoordinates3.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords4 = polyCoordinates4.map(function(coord) {
                return [coord[1], coord[0]];
            });
            // console.log(fixedCoords)

            L.polygon([[fixedCoords1,fixedCoords2,fixedCoords3,fixedCoords4]], {}).addTo(areaLayer)
        }
        
        else {console.log("Once again. I'm out of ideas")}
        }

})

// Populates the district dropdown list with items that, when selected, set the map to the coordinates of that district
document.addEventListener("DOMContentLoaded", function () {
    

    // Get the dropdown element by its unique id
    const dropdown1 = document.getElementById("district-selector");
    const dropdownMenu1 = dropdown1.querySelector(".dropdown-menu");
    const dropdownText = dropdown1.querySelector(".btn");


    let districts = ['North Valley','South Valley','West LA','Central','East LA','South LA','Harbor Districts','West Hills']
    
    let districtCoordinates = [[34.25994983206024,-118.45081865787508], // North Valley
    [34.176837772589096, -118.49853515625001], // South Valley
    [34.06950035227694,-118.47691118717194], // West LA
    [34.085711502121676,-118.3220672607422], // Central
    [34.091113788749794,-118.21872711181642], // East LA
    [33.99556781046533,-118.3042895793915], // South LA
    [33.81543900487201,-118.28810244798663], // Harbors
    [34.21971760306106,-118.65619875490667], // West Hills
]
 
    // Loop through the names array and create dropdown items
    districts.forEach(function (name) {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#"; // You can set the link behavior if needed
        dropdownItem.textContent = name;
    
        dropdownItem.addEventListener("click", function () {
            console.log(name); // Log the selected item's text in the console
            dropdownText.textContent = name

            if (name == districts[0]) {
                map.setView(districtCoordinates[0], 12)
            }
            else if (name == districts[1]) {
                map.setView(districtCoordinates[1], 12)
            }
            else if (name == districts[2]) {
                map.setView(districtCoordinates[2], 12)
            }
            else if (name == districts[3]) {
                map.setView(districtCoordinates[3], 12.5)
            }
            else if (name == districts[4]) {
                map.setView(districtCoordinates[4], 13)
            }
            else if (name == districts[5]) {
                map.setView(districtCoordinates[5], 12)
            }
            else if (name == districts[6]) {
                map.setView(districtCoordinates[6], 11)
            }
            else if (name == districts[7]) {
                map.setView(districtCoordinates[7], 15)
            }
            else if (name == districts[8]) {
                map.setView(districtCoordinates[8], 15)
            }
            else if (name == districts[9]) {
                map.setView(districtCoordinates[9], 1)
            }
          });

        // Append the item to the dropdown menu
        dropdownMenu1.appendChild(dropdownItem);
    });
    });


// Populates the district dropdown list with items that, when selected, filters the heatmap data to reflect the selected crime
document.addEventListener("DOMContentLoaded", function () {


    // Get the dropdown element by its unique id
    const dropdown1 = document.getElementById("crime-selector");
    const dropdownMenu1 = dropdown1.querySelector(".dropdown-menu");
    const dropdownText = dropdown1.querySelector(".btn");


    crimes = [ 'ASSAULT', 'ARSON', 'BATTERY', 'BIKE', 'BOMB', 'BUNCO', 'BURGLARY', 'COUNTERFEIT', 'CREDIT CARD', 'CRIMINAL HOMICIDE',  
    'DISTURBING THE PEACE', 'FORGERY', 'EMBEZZLEMENT', 'EXTORTION', 'HUMAN TRAFFICKING', 'INDECENT EXPOSURE', 'KIDNAPPING', 'LEWD', 
    'PICKPOCKET', 'ROBBERY', 'SHOPLIFTING', 'SEX', 'STALKING', 'THEFT', 'TRESPASSING', 'VANDALISM', 'VEHICLE','OTHER']

    // Loop through the names array and create dropdown items
    crimes.forEach(function (name) {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#"; // You can set the link behavior if needed
        dropdownItem.textContent = name;
    
        dropdownItem.addEventListener("click", function () {
            console.log(name); // Log the selected item's text in the console
            dropdownText.textContent = name

            if (name == 'OTHER') {
                assaultURL = `http://127.0.0.1:5000/crimedata/other/all`
                console.log(assaultURL)
                // current.push(`${name}`)
                heatLayer.clearLayers()
                data(assaultURL)

            }
            // Dealing with Crime Code Descriptions that have spaces in them
            else {
                var spaceName = name;
                var noSpaceName = encodeURIComponent(spaceName);

                console.log(noSpaceName)

            assaultURL = `http://127.0.0.1:5000/crimedata/${noSpaceName}`
            console.log(assaultURL)
            heatLayer.clearLayers()
            data(assaultURL)
            }
          });

        // Append the item to the dropdown menu
        dropdownMenu1.appendChild(dropdownItem);
    });
    });


// Starting the layer control as open by triggering a click event on its toggle button
var controlToggle = document.querySelector('.leaflet-control-layers-toggle');
if (controlToggle) {
    controlToggle.click();
}

// Bar Chart Creation
// Define a function to fetch data from the API and create the chart.
function createAgeDistributionChart() {
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            // Extract ages and count the number of people for each age.
            const ageData = data.map(item => item['Vict Age']);
            const ageCounts = {};
            ageData.forEach(age => {
                ageCounts[age] = (ageCounts[age] || 0) + 1;
            });

            // Extract unique ages and their corresponding counts.
            const ages = Object.keys(ageCounts).map(age => parseInt(age, 10));
            const counts = Object.values(ageCounts);

            // Create a bar chart using Chart.js.
            const ctx = document.getElementById('ageChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ages,
                    datasets: [{
                        label: 'Distribution of Reported Victim Ages',
                        data: counts,
                        backgroundColor: 'rgba(0,0,255, 0.6)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Age'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '# of People'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Call the function to create the chart.
createAgeDistributionChart();

// Pie Chart Creation
// Define the API URL
const apiUrl = dataUrl;

// Fetch data from the API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Initialize empty objects to store the count of each gender
    const genderCount = {
      Male: 0,
      Female: 0,
      Other: 0,
    };

    // Iterate over the data to extract sex information from the 'Vice Sex' attribute
    data.forEach((entry) => {
      const sex = entry['Vict Sex'];

      // Increment the count based on the extracted sex information
      if (sex === 'M') {
        genderCount.Male++;
      } else if (sex === 'F') {
        genderCount.Female++;
      } else {
        genderCount.Other++;
      }
    });

    // Create an array of gender labels and their corresponding counts
    const genderLabels = Object.keys(genderCount);
    const genderData = Object.values(genderCount);

    // Get the canvas element
    const ctx = document.getElementById('genderChart').getContext('2d');

    // Create the pie chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: genderLabels,
        datasets: [
          {
            label: 'Distribution of Sexes',
            data: genderData,
            backgroundColor: ['lightblue', 'lightpink', 'gray'],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      },
    });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });


