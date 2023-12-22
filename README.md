# Crime Data in LA - Full-Stack Dashboard

### Team Members: <br> 
[Martin Bedino](), <br>
[David Pinsky](), <br>
[Lois Stetson](), <br>
[Nathan-Andrew Tompkins (self)]() <br>


## Summary
This full-stack interactive dashboard of LA's crime data (reported between 2020-2023) is designed as a demonstration of my team's ability to:
 1. Gather, clean, and combine LA Policing and Crime data from various open sources, 
 2. Develop and deploy a non-local API using Python's Flask module in combination with an SQLite database which processes variable SQL queries.
 3. Design a single-page HTML5 dashboard that allows for interactive analysis of crime data by district and crime-type.
 4. Code a JavaScript file that handles all queries and API requests, serving the data through a Leaflet.js map.

# Project

## Import and Cleaning (Crime_data.ipynb)
1. There are 3 primary sources of the data used to populate this dashboard:
    1. The [primary crime data](REPLACE THIS), from Kaggle. 
        * The File located in this repository, [DataSample.csv](https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore), is a cleaned and deprecated version of the original source and comprises of 1,000 samples to meet GitHub's repository upload size-limits.
    2. The [police station location data](https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore), which was used to populate points on the interactive Leatlet.js heatmap representing police stations amidst the crime reported.
    3. The [the LA disctrict/area boundaries](https://geohub.lacity.org/datasets/lahub::neighborhood-service-areas/explore), used to draw the numerous GeoJSON encoded district/area boundaries on the map.

2. We used an .ipynb notebook ([data_cleaning.ipynb](data_cleaning.ipynb)) which imports the above LA crime data and places it into a Pandas dataframe. We dropped the unneeded columns, cleaned the records, then export a sample of the cleaned data ([DataSample.csv](data/DataSample.csv).) It should be noted that the cleaning of this data, while important, was a functional endeavor as cleaning was not the purpose of this project. As such, all data that did not have a reported age above 1 year (roughly 24.4% of the full data set) was excluded to increase efficiency of API calls.

### Deploying the (local) Back-End (api_server_local.py)
*This python file deploys a LOCAL Flask API. For information on the Deployed API, see below.*<br>
<br>
*Note: While cloning this repository in full is the best option to run this locally, the api_server.py file requires the noted Python dependencies (outlined below) to be installed before local deployement is successful, as well as the linked primary Crime Data source cited above. The DataCleaned.csv file that the data_cleaning.ipynb file exports operates on this original (large) .csv.* <br>

1. After importing our dependencies (Pandas, Flask, Flask_CORS, SQLAlchemy, GeoPandas) the DataCleaned.csv is read in and exported to an sqlite server. Our Flask app is then set up with a few main routes in mind:
    1. "/crimedata" - The first deploys all of the data from the CleanedData.csv in JSON format. While unused in the dashboard itself this route was vital to the debugging and creation of the visualization in the earlier stages of development.
    2. "/crimedata/-crime-" - Provides a queried selection of the dataset. Event listeners are set up to request data on a specific crime based on which crime is selected from the dropdown menu in the front-end index.html.
    3. "/crimedata/other/all" - Provides all crime data not specified in the dropdown menu when the user selects the "Other" dropdown option.
    4. "/stations" - Serves the location data for the police stations in the LA area, imported from the [police station location data](https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore) CSV file so the Leaflet.js map may add the points to a map layer.
    5. "/cityareas" - Provides [the LA district/area boundaries](https://geohub.lacity.org/datasets/lahub::neighborhood-service-areas/explore) of the LA area so the Leaflet.js map may add the areas to a map layer.

### Deploying the (hosted) Back-End (api_server_hosted.py)
*This python file is the code used in the HOSTED Flask application deployed at [tompkins.pythonanywhere.com](https://tompkins.pythonanywhere.com). For information on the LOCAL API file, see above.*<br>
<br>
*Note: This API is designed to be deployed on a hosted server. As such, my GitHub Pages for this repository ([here]()) is the best way to interact with the data. For direct access use this URL structure: ```https://tompkins.pythonanywhere.com/<flask route>```. The Flask routes are outlined below.*<br>
This version of the Flask application code includes a number of differences, the most important being the initialization of the API link variables changing from the local "LOCAL API LINK HERE" to the hosted "https://tompkins.pythonanywhere.com". This allowed for proper requests to the hosted Flask app.<br>

1. After importing our dependencies (Pandas, Flask, Flask_CORS, SQLAlchemy, GeoPandas) the DataCleaned.csv is read in and exported to an sqlite server. Our Flask app is then set up with a few main routes in mind:
    1. "/crimedata" - The first deploys all of the data from the CleanedData.csv in JSON format. While unused in the dashboard itself this route was vital to the debugging and creation of the visualization in the earlier stages of development.
    2. "/crimedata/-crime-" - Provides a queried selection of the dataset. Event listeners are set up to request data on a specific crime based on which crime is selected from the dropdown menu in the front-end index.html.
    3. "/crimedata/other/all" - Provides all crime data not specified in the dropdown menu when the user selects the "Other" dropdown option.
    4. "/stations" - Serves the location data for the police stations in the LA area, imported from the [police station location data](https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore) CSV file so the Leaflet.js map may add the points to a map layer.
    5. "/cityareas" - Provides [the LA disctrict/area boundaries](https://geohub.lacity.org/datasets/lahub::neighborhood-service-areas/explore) of the LA area so the Leaflet.js map may add the areas to a map layer.
 
### Creating the Front-End (/docs/index.html)
*The front-end development process included using tools such as Bootstrap, Leaflet.js, Leaflet-heat.js, and Plot.ly. The general structure is outlined below.*
- Head
  - Imported dependecies include:
    - Bootstrap #1
    - Leaflet
    - Leaflet-Heatmap
    - style.css (local)
    - Plotly
    - Chart.js #1
- Body
    - Gradient background
        - Infobox with two dropdown menus for LA district or specific crime selections.
    - Leaflet heat-map, with different layers for stations, district boundaries, crimes. Populates as crimes are selected. Zooms as districts are selected.
    - Chart for age distribution of records.
    - Chart for sex distribution of records.
  - Footer (and dependancies)
    - Dashboard team credits
    - Chart.js script #2
    - D3 script
    - app.js (local script)
    - Bootstrap script #2

### Javascript Logic (app.js)
1. We first set up a number of Leaflet layer variables for the Stations and District Areas for the API calls to populate. The map initialization itself occurs next, being sure to include layer controls for interactability.
2. We set our API urls to call from our local server and created a data() function to populate our heatmap as specific crimes are selected.
3. Our district and police-station map layers are populated by calling each dataset for that data, then drawn onto the map. Note that it was necessary to be particularly careful when coding this logic, as a number of districts contain "negative" areas which are under a different district of area classification.
4. D3 tools were utilized to populate the dropdown menus with district names and crime types. Event listeners were added to each dropdown menus option so that as they are clicked the map updates with the specific crime queried, or zooms in on the unique district selected.
5. Age and Sex distribution charts are generated and populated below the primary dashboard element (leaflet map.) Both charts were generated using the Chart.js libarary.
